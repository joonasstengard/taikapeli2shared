import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyDefenseMitigation } from "../warriors/damageMitigation";
import { STATUS_EFFECT_KEY } from "./statusEffectTypes";
import {
  getEffectiveArmor,
  getEffectiveResistance,
  getEffectiveSpeed,
  getEffectiveStrength,
  resolveCombatStats,
  toEffectiveSkillCasterCombatStats,
  toEffectiveSpellCasterCombatStats,
} from "./resolveCombatStats";

describe("resolveCombatStats", () => {
  const baseWarrior = {
    strength: 7,
    speed: 4,
    faith: 2,
    spellDamage: 3,
    armor: 8,
    resistance: 6,
  };

  it("returns base stats when there are no active effects", () => {
    const result = resolveCombatStats(baseWarrior, []);

    assert.deepEqual(result.base, baseWarrior);
    assert.deepEqual(result.effective, baseWarrior);
    assert.deepEqual(result.bonuses, {});
  });

  it("applies stat buff bonuses from instances", () => {
    const result = resolveCombatStats(baseWarrior, [], [
      { turnsRemaining: 3, statModifiers: { strength: 5, speed: 5 } },
    ]);

    assert.equal(result.effective.strength, 12);
    assert.equal(result.effective.speed, 9);
    assert.equal(result.bonuses.strength, 5);
    assert.equal(result.bonuses.speed, 5);
  });

  it("ignores expired stat buff instances", () => {
    assert.equal(
      getEffectiveStrength(baseWarrior, [], [
        { turnsRemaining: 0, statModifiers: { strength: 5 } },
      ]),
      7
    );
  });

  it("uses effective speed for turn order helpers", () => {
    assert.equal(
      getEffectiveSpeed(baseWarrior, [], [
        { turnsRemaining: 2, statModifiers: { speed: 5 } },
      ]),
      9
    );
  });

  it("resolves effective armor and resistance", () => {
    const buffs = [
      {
        turnsRemaining: 2,
        statModifiers: { armor: 4, resistance: -2 },
      },
    ];

    assert.equal(getEffectiveArmor(baseWarrior, [], buffs), 12);
    assert.equal(getEffectiveResistance(baseWarrior, [], buffs), 4);
  });

  it("Layer 3: allows shreds to drive effective armor/resistance negative", () => {
    const buffs = [
      {
        turnsRemaining: 2,
        statModifiers: { armor: -20, resistance: -10 },
      },
    ];

    assert.equal(getEffectiveArmor(baseWarrior, [], buffs), -12);
    assert.equal(getEffectiveResistance(baseWarrior, [], buffs), -4);
    assert.equal(resolveCombatStats(baseWarrior, [], buffs).bonuses.armor, -20);
    assert.equal(
      resolveCombatStats(baseWarrior, [], buffs).bonuses.resistance,
      -10
    );
  });

  it("Layer 3: mitigation treats negative effective defense as passthrough", () => {
    // resolveCombatStats does not floor; applyDefenseMitigation clamps defense ≤ 0.
    const shreddedArmor = getEffectiveArmor(baseWarrior, [], [
      { turnsRemaining: 1, statModifiers: { armor: -20 } },
    ]);
    assert.ok(shreddedArmor < 0);
    assert.equal(applyDefenseMitigation(15, shreddedArmor), 15);

    const shreddedResistance = getEffectiveResistance(baseWarrior, [], [
      { turnsRemaining: 1, statModifiers: { resistance: -20 } },
    ]);
    assert.ok(shreddedResistance < 0);
    assert.equal(applyDefenseMitigation(15, shreddedResistance), 15);
  });

  it("Layer 3: stacks armor/resistance buffs and shreds into one effective value", () => {
    const result = resolveCombatStats(baseWarrior, [], [
      { turnsRemaining: 2, statModifiers: { armor: 5, resistance: 3 } },
      { turnsRemaining: 1, statModifiers: { armor: -2, resistance: -1 } },
    ]);

    assert.equal(result.effective.armor, 11);
    assert.equal(result.effective.resistance, 8);
    assert.equal(result.bonuses.armor, 3);
    assert.equal(result.bonuses.resistance, 2);
  });

  it("does not apply transform stats from status effect alone", () => {
    const result = resolveCombatStats(baseWarrior, [
      {
        effectKey: STATUS_EFFECT_KEY.transformSkarWolf,
        turnsRemaining: 3,
      },
    ]);

    assert.deepEqual(result.effective, baseWarrior);
  });
});

describe("toEffectiveSkillCasterCombatStats", () => {
  const baseWarrior = {
    strength: 7,
    speed: 4,
    faith: 2,
    spellDamage: 3,
    armor: 8,
    resistance: 6,
  };

  it("returns all effective combat stats for skill scaling", () => {
    assert.deepEqual(
      toEffectiveSkillCasterCombatStats(baseWarrior, [], [
        { turnsRemaining: 2, statModifiers: { strength: 3, speed: 5 } },
      ]),
      {
        strength: 10,
        speed: 9,
        faith: 2,
        spellDamage: 3,
        armor: 8,
        resistance: 6,
      }
    );
  });

  it("Layer 3: includes effective armor and resistance buffs for skill casters", () => {
    assert.deepEqual(
      toEffectiveSkillCasterCombatStats(baseWarrior, [], [
        { turnsRemaining: 2, statModifiers: { armor: 4, resistance: 2 } },
      ]),
      {
        strength: 7,
        speed: 4,
        faith: 2,
        spellDamage: 3,
        armor: 12,
        resistance: 8,
      }
    );
  });
});

describe("toEffectiveSpellCasterCombatStats", () => {
  it("Layer 3: spell caster stats stay faith/spellDamage only", () => {
    assert.deepEqual(
      toEffectiveSpellCasterCombatStats(
        {
          strength: 7,
          speed: 4,
          faith: 2,
          spellDamage: 3,
          armor: 8,
          resistance: 6,
        },
        [],
        [{ turnsRemaining: 2, statModifiers: { faith: 3, armor: 10 } }]
      ),
      { faith: 5, spellDamage: 3 }
    );
  });
});
