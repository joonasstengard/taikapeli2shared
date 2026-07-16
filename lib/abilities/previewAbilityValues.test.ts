import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";
import { calculateLastStandDamage } from "./calculateLastStandDamage";
import { estimateSacrificeSelfCostPenalty } from "./calculateSacrificePower";
import {
  previewSkillCombatValues,
  previewSkillDamage,
  previewSpellCombatValues,
  previewSpellDamage,
  previewSpellManaRestore,
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

describe("estimateSacrificeSelfCostPenalty", () => {
  it("uses current health as AI self-cost penalty", () => {
    assert.equal(
      estimateSacrificeSelfCostPenalty({ health: 10, currentHealth: 6 }),
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

  it("does not change damage scaling for sacrifice", () => {
    assert.equal(
      previewSpellDamage(
        { ...holyBolt, effect: { effectType: "sacrifice" } },
        {
          health: 10,
          currentHealth: 7,
          strength: 0,
          faith: 4,
          spellDamage: 6,
        }
      ),
      10
    );
  });

  it("adds Eldritch Spite bonus against Orc defenders", () => {
    assert.equal(
      previewSpellDamage(
        holyBolt,
        {
          warriorClass: "Sorcerer",
          health: 10,
          currentHealth: 10,
          strength: 0,
          faith: 0,
          spellDamage: 0,
        },
        {
          warriorClass: "Brutalizer",
          gender: "Male",
          picture: 1,
        }
      ),
      6
    );
  });

  it("does not add Eldritch Spite bonus against non-Orc defenders", () => {
    assert.equal(
      previewSpellDamage(
        holyBolt,
        {
          warriorClass: "Sorcerer",
          health: 10,
          currentHealth: 10,
          strength: 0,
          faith: 0,
          spellDamage: 0,
        },
        {
          warriorClass: "Knight",
          gender: "Male",
          picture: 1,
        }
      ),
      5
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

  it("uses effective strength from active stat buffs", () => {
    assert.equal(
      previewSkillDamage(
        strike,
        {
          health: 10,
          currentHealth: 10,
          strength: 4,
          faith: 0,
          spellDamage: 0,
          statBuffs: [{ turnsRemaining: 3, statModifiers: { strength: 5 } }],
        }
      ),
      12
    );
  });

  it("scales from speed when damageScalingStat is speed", () => {
    const trample = {
      baseDamageTarget: 1,
      baseHealTarget: 0,
      scalingFactor: 1,
      damageScalingStat: "speed" as const,
      type: null,
      effect: null,
    };

    assert.equal(
      previewSkillDamage(trample, {
        health: 10,
        currentHealth: 10,
        strength: 20,
        speed: 6,
        faith: 0,
        spellDamage: 0,
      }),
      7
    );
  });

  it("uses effective speed from active stat buffs for speed-scaling skills", () => {
    const trample = {
      baseDamageTarget: 1,
      baseHealTarget: 0,
      scalingFactor: 1,
      damageScalingStat: "speed" as const,
      type: null,
      effect: null,
    };

    assert.equal(
      previewSkillDamage(trample, {
        health: 10,
        currentHealth: 10,
        strength: 20,
        speed: 5,
        faith: 0,
        spellDamage: 0,
        statBuffs: [{ turnsRemaining: 2, statModifiers: { speed: 4 } }],
      }),
      10
    );
  });

  it("ignores speed for default strength-scaling skills", () => {
    assert.equal(
      previewSkillDamage(strike, {
        health: 10,
        currentHealth: 10,
        strength: 4,
        speed: 20,
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
        manaRestore: null,
        hasLastStandEffect: false,
        hasSacrificeEffect: false,
      }
    );
  });

  it("includes mana restore when present", () => {
    assert.deepEqual(
      previewSpellCombatValues(
        {
          baseDamageTarget: 0,
          baseHealTarget: 0,
          baseManaRestore: 4,
          scalingFactor: 0.5,
          type: "Holy",
          effect: null,
        },
        {
          health: 10,
          currentHealth: 10,
          strength: 0,
          faith: 5,
          spellDamage: 0,
        }
      ),
      {
        damage: null,
        heal: null,
        staminaRestore: null,
        manaRestore: 6,
        hasLastStandEffect: false,
        hasSacrificeEffect: false,
      }
    );
  });
});

describe("previewSpellManaRestore", () => {
  it("adds faith scaling for holy spells", () => {
    assert.equal(
      previewSpellManaRestore(
        {
          baseDamageTarget: 0,
          baseHealTarget: 0,
          baseManaRestore: 4,
          scalingFactor: 0.5,
          type: "Holy",
        },
        {
          health: 10,
          currentHealth: 10,
          strength: 0,
          faith: 5,
          spellDamage: 0,
        }
      ),
      6
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
        manaRestore: null,
        hasLastStandEffect: false,
        hasSacrificeEffect: false,
      }
    );
  });
});
