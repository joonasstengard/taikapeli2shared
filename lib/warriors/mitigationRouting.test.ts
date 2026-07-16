import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  previewSkillDamage,
  previewSpellDamage,
} from "../abilities/previewAbilityValues";
import { applyArmorMitigation, applyResistanceMitigation } from "./damageMitigation";
import { calculateBasicAttackDamage } from "./classPassiveTraits";
import {
  assertMagicMitigationRouting,
  assertPhysicalMitigationRouting,
  ROUTING_HIGH_DEFENSE,
  ROUTING_LOW_DEFENSE,
} from "./mitigationRoutingAssert";
import { resolveMitigatedHit } from "./resolveMitigatedHit";

const RAW = 15;
const CURRENT_HEALTH = 100;

describe("Layer 1 — mitigation routing contracts", () => {
  describe("resolveMitigatedHit kind routing", () => {
    it("applies armor mitigation when kind is armor", () => {
      const highDefense = resolveMitigatedHit({
        rawDamage: RAW,
        mitigation: "armor",
        defense: ROUTING_HIGH_DEFENSE,
        currentHealth: CURRENT_HEALTH,
      }).damageDealt;
      const lowDefense = resolveMitigatedHit({
        rawDamage: RAW,
        mitigation: "armor",
        defense: ROUTING_LOW_DEFENSE,
        currentHealth: CURRENT_HEALTH,
      }).damageDealt;

      assert.equal(highDefense, applyArmorMitigation(RAW, ROUTING_HIGH_DEFENSE));
      assert.ok(lowDefense > highDefense);
      assert.equal(
        lowDefense,
        applyArmorMitigation(RAW, ROUTING_LOW_DEFENSE)
      );
    });

    it("applies resistance mitigation when kind is resistance", () => {
      const highDefense = resolveMitigatedHit({
        rawDamage: RAW,
        mitigation: "resistance",
        defense: ROUTING_HIGH_DEFENSE,
        currentHealth: CURRENT_HEALTH,
      }).damageDealt;
      const lowDefense = resolveMitigatedHit({
        rawDamage: RAW,
        mitigation: "resistance",
        defense: ROUTING_LOW_DEFENSE,
        currentHealth: CURRENT_HEALTH,
      }).damageDealt;

      assert.equal(
        highDefense,
        applyResistanceMitigation(RAW, ROUTING_HIGH_DEFENSE)
      );
      assert.ok(lowDefense > highDefense);
    });

    it("does not apply armor or resistance when mitigation is none", () => {
      assert.equal(
        resolveMitigatedHit({
          rawDamage: RAW,
          mitigation: "none",
          defense: ROUTING_HIGH_DEFENSE,
          currentHealth: CURRENT_HEALTH,
        }).damageDealt,
        RAW
      );
    });
  });

  describe("calculateBasicAttackDamage routing", () => {
    it("uses defenderArmor for non-Knight defenders", () => {
      const highArmor = calculateBasicAttackDamage(RAW, "Berserker", {
        defenderArmor: ROUTING_HIGH_DEFENSE,
      });
      const lowArmor = calculateBasicAttackDamage(RAW, "Berserker", {
        defenderArmor: ROUTING_LOW_DEFENSE,
      });

      assert.equal(highArmor, applyArmorMitigation(RAW, ROUTING_HIGH_DEFENSE));
      assert.equal(lowArmor, applyArmorMitigation(RAW, ROUTING_LOW_DEFENSE));
      assert.ok(lowArmor > highArmor);
    });
  });

  describe("previewAbilityValues routing", () => {
    const strike = {
      baseDamageTarget: 15,
      baseHealTarget: 0,
      scalingFactor: 0,
      type: null,
      effect: null,
    };

    const bolt = {
      baseDamageTarget: 15,
      baseHealTarget: 0,
      scalingFactor: 0,
      type: null,
      effect: null,
    };

    const caster = {
      health: 20,
      currentHealth: 20,
      strength: 0,
      faith: 0,
      spellDamage: 0,
    };

    it("previewSkillDamage uses armor and ignores resistance", () => {
      const damageHighArmorLowResistance = previewSkillDamage(strike, caster, {
        warriorClass: "Berserker",
        gender: "Male",
        picture: 1,
        armor: ROUTING_HIGH_DEFENSE,
        resistance: ROUTING_LOW_DEFENSE,
      });
      const damageHighArmorHighResistance = previewSkillDamage(strike, caster, {
        warriorClass: "Berserker",
        gender: "Male",
        picture: 1,
        armor: ROUTING_HIGH_DEFENSE,
        resistance: ROUTING_HIGH_DEFENSE,
      });
      const damageLowArmorHighResistance = previewSkillDamage(strike, caster, {
        warriorClass: "Berserker",
        gender: "Male",
        picture: 1,
        armor: ROUTING_LOW_DEFENSE,
        resistance: ROUTING_HIGH_DEFENSE,
      });

      assertPhysicalMitigationRouting(
        {
          damageHighArmorLowResistance,
          damageHighArmorHighResistance,
          damageLowArmorHighResistance,
        },
        "previewSkillDamage"
      );
      assert.equal(
        damageHighArmorLowResistance,
        applyArmorMitigation(15, ROUTING_HIGH_DEFENSE)
      );
    });

    it("previewSpellDamage uses resistance and ignores armor", () => {
      const damageLowArmorHighResistance = previewSpellDamage(bolt, caster, {
        warriorClass: "Berserker",
        gender: "Male",
        picture: 1,
        armor: ROUTING_LOW_DEFENSE,
        resistance: ROUTING_HIGH_DEFENSE,
      });
      const damageHighArmorHighResistance = previewSpellDamage(bolt, caster, {
        warriorClass: "Berserker",
        gender: "Male",
        picture: 1,
        armor: ROUTING_HIGH_DEFENSE,
        resistance: ROUTING_HIGH_DEFENSE,
      });
      const damageHighArmorLowResistance = previewSpellDamage(bolt, caster, {
        warriorClass: "Berserker",
        gender: "Male",
        picture: 1,
        armor: ROUTING_HIGH_DEFENSE,
        resistance: ROUTING_LOW_DEFENSE,
      });

      assertMagicMitigationRouting(
        {
          damageLowArmorHighResistance,
          damageHighArmorHighResistance,
          damageHighArmorLowResistance,
        },
        "previewSpellDamage"
      );
      assert.equal(
        damageLowArmorHighResistance,
        applyResistanceMitigation(15, ROUTING_HIGH_DEFENSE)
      );
    });
  });
});
