import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  previewSkillDamage,
  previewSpellDamage,
} from "../abilities/previewAbilityValues";
import {
  calculateBasicAttackDamage,
  CLEAVE_SPLASH_DAMAGE,
} from "../warriors/classPassiveTraits";
import {
  applyArmorMitigation,
  applyResistanceMitigation,
} from "../warriors/damageMitigation";
import {
  ROUTING_HIGH_DEFENSE,
  ROUTING_LOW_DEFENSE,
} from "../warriors/mitigationRoutingAssert";
import { resolveMitigatedHit } from "../warriors/resolveMitigatedHit";
import {
  getEffectiveArmor,
  getEffectiveResistance,
  getEffectiveStrength,
} from "../statusEffects/resolveCombatStats";

/**
 * Layer 4 — UI / optimistic preview parity.
 *
 * Frontend `battleDamagePreview.ts` and cleave replay in
 * `resolveWarriorsAtBattleEnd.ts` call these shared helpers. There is no
 * frontend test runner yet, so this suite locks the mitigation math those UI
 * paths depend on.
 */
describe("Layer 4: UI damage preview parity contracts", () => {
  const attacker = {
    warriorClass: "Berserker",
    health: 20,
    currentHealth: 20,
    strength: 15,
    faith: 0,
    spellDamage: 0,
    statusEffects: [],
    statBuffs: [],
  };

  it("basic-attack preview path matches calculateBasicAttackDamage + effective armor", () => {
    const defender = {
      warriorClass: "Berserker",
      gender: "Male" as const,
      picture: 1,
      armor: 20,
      resistance: ROUTING_HIGH_DEFENSE,
      statusEffects: [],
      statBuffs: [{ turnsRemaining: 2, statModifiers: { armor: 10 } }],
    };

    const attackPower = getEffectiveStrength(
      attacker,
      attacker.statusEffects,
      attacker.statBuffs
    );
    const defenderArmor = getEffectiveArmor(
      defender,
      defender.statusEffects,
      defender.statBuffs
    );

    assert.equal(attackPower, 15);
    assert.equal(defenderArmor, 30);
    assert.equal(
      calculateBasicAttackDamage(attackPower, defender.warriorClass, {
        defenderArmor,
      }),
      applyArmorMitigation(15, 30)
    );
  });

  it("skill preview path matches applyArmorMitigation (battleDamagePreview skill branch)", () => {
    const skill = {
      baseDamageTarget: 15,
      baseHealTarget: 0,
      scalingFactor: 0,
      type: null,
      effect: null,
    };
    const defender = {
      warriorClass: "Berserker",
      gender: "Male" as const,
      picture: 1,
      armor: ROUTING_HIGH_DEFENSE,
      resistance: ROUTING_LOW_DEFENSE,
    };

    assert.equal(
      previewSkillDamage(skill, attacker, defender),
      applyArmorMitigation(15, ROUTING_HIGH_DEFENSE)
    );
  });

  it("spell preview path matches applyResistanceMitigation (battleDamagePreview spell branch)", () => {
    const spell = {
      baseDamageTarget: 15,
      baseHealTarget: 0,
      scalingFactor: 0,
      type: null,
      effect: null,
    };
    const defender = {
      warriorClass: "Berserker",
      gender: "Male" as const,
      picture: 1,
      armor: ROUTING_HIGH_DEFENSE,
      resistance: ROUTING_HIGH_DEFENSE,
      statusEffects: [],
      statBuffs: [{ turnsRemaining: 1, statModifiers: { resistance: -10 } }],
    };

    const effectiveResistance = getEffectiveResistance(
      defender,
      defender.statusEffects,
      defender.statBuffs
    );
    assert.equal(effectiveResistance, 40);
    assert.equal(
      previewSpellDamage(spell, attacker, defender),
      applyResistanceMitigation(15, 40)
    );
  });

  it("cleave replay path matches resolveMitigatedHit armor mitigation", () => {
    const splashArmor = 20;
    const hit = resolveMitigatedHit({
      rawDamage: CLEAVE_SPLASH_DAMAGE,
      mitigation: "armor",
      defense: splashArmor,
      currentHealth: 20,
    });

    assert.equal(
      hit.damageDealt,
      applyArmorMitigation(CLEAVE_SPLASH_DAMAGE, splashArmor)
    );
    assert.equal(hit.newHealth, 20 - hit.damageDealt);
  });

  it("cleave hover preview path matches applyArmorMitigation on splash damage", () => {
    // battleDamagePreview addBasicAttackPreviews uses the same math for
    // out-of-range horizontal neighbors of a primary target.
    assert.equal(
      applyArmorMitigation(CLEAVE_SPLASH_DAMAGE, 20),
      resolveMitigatedHit({
        rawDamage: CLEAVE_SPLASH_DAMAGE,
        mitigation: "armor",
        defense: 20,
        currentHealth: 100,
      }).damageDealt
    );
  });
});
