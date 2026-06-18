import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateLastStandDamage } from "./calculateLastStandDamage";
import {
  previewSkillCombatValues,
  previewSkillDamage,
  previewSpellCombatValues,
  previewSpellDamage,
} from "./previewAbilityValues";

describe("calculateLastStandDamage", () => {
  it("returns base damage at full health", () => {
    assert.equal(
      calculateLastStandDamage({ health: 10, currentHealth: 10 }, 4),
      4
    );
  });

  it("scales up to 2x base at zero health", () => {
    assert.equal(
      calculateLastStandDamage({ health: 10, currentHealth: 0 }, 4),
      8
    );
  });

  it("scales linearly at half missing health", () => {
    assert.equal(
      calculateLastStandDamage({ health: 10, currentHealth: 5 }, 4),
      6
    );
  });
});

describe("previewSpellDamage", () => {
  const holyBolt = {
    baseDamageTarget: 5,
    baseHealTarget: 0,
    scalingFactor: 0.5,
    type: "Holy",
    effect: null,
  };

  it("adds faith and spell damage scaling", () => {
    assert.equal(
      previewSpellDamage(holyBolt, {
        health: 10,
        currentHealth: 10,
        strength: 0,
        faith: 4,
        spellDamage: 6,
      }),
      10
    );
  });

  it("applies lastStand before scaling bonuses", () => {
    assert.equal(
      previewSpellDamage(
        { ...holyBolt, effect: { effectType: "lastStand" } },
        {
          health: 10,
          currentHealth: 0,
          strength: 0,
          faith: 0,
          spellDamage: 0,
        }
      ),
      10
    );
  });
});

describe("previewSkillDamage", () => {
  const strike = {
    baseDamageTarget: 3,
    baseHealTarget: 0,
    scalingFactor: 1,
    type: null,
    effect: null,
  };

  it("adds strength scaling", () => {
    assert.equal(
      previewSkillDamage(strike, {
        health: 10,
        currentHealth: 10,
        strength: 4,
        faith: 0,
        spellDamage: 0,
      }),
      7
    );
  });
});

describe("previewSpellCombatValues", () => {
  it("omits zero-value fields", () => {
    assert.deepEqual(
      previewSpellCombatValues(
        {
          baseDamageTarget: 5,
          baseHealTarget: 0,
          scalingFactor: 0,
          type: "Fire",
          effect: null,
        },
        {
          health: 10,
          currentHealth: 10,
          strength: 0,
          faith: 0,
          spellDamage: 0,
        }
      ),
      {
        damage: 5,
        heal: null,
        staminaRestore: null,
        hasLastStandEffect: false,
      }
    );
  });
});

describe("previewSkillCombatValues", () => {
  it("includes stamina restore when present", () => {
    assert.deepEqual(
      previewSkillCombatValues(
        {
          baseDamageTarget: 0,
          baseHealTarget: 0,
          baseStaminaRestore: 3,
          scalingFactor: 0,
          type: null,
          effect: null,
        },
        {
          health: 10,
          currentHealth: 10,
          strength: 0,
          faith: 0,
          spellDamage: 0,
        }
      ),
      {
        damage: null,
        heal: null,
        staminaRestore: 3,
        hasLastStandEffect: false,
      }
    );
  });
});
