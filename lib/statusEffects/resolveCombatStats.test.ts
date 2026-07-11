import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_EFFECT_KEY } from "./statusEffectTypes";
import {
  getEffectiveSpeed,
  getEffectiveStrength,
  resolveCombatStats,
  toEffectiveSkillCasterCombatStats,
} from "./resolveCombatStats";

describe("resolveCombatStats", () => {
  const baseWarrior = {
    strength: 7,
    speed: 4,
    faith: 2,
    spellDamage: 3,
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

  it("does not apply transform stats from status effect alone", () => {
    const result = resolveCombatStats(baseWarrior, [
      {
        effectKey: STATUS_EFFECT_KEY.transformWolf,
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
      }
    );
  });
});
