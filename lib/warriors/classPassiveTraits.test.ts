import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyBasicAttackBleedingToWarrior,
  createKingsCommandStrengthBuffParams,
  applyHumbleOriginsExperienceBonus,
  applyHumbleOriginsLevelUpBonus,
  applySpellCastManaMasteryRestoreToWarrior,
  applyTakedownTraitRestoreToWarrior,
  applyWildChannelPrimalSkillManaRestoreToWarrior,
  applyWildChannelPrimalSpellStaminaRestoreToWarrior,
  calculateBasicAttackDamage,
  CLASS_PASSIVE_TRAITS,
  getClassPassiveTraitForClass,
  grantsBasicAttackBleeding,
  grantsBasicAttackCleave,
  grantsBracedBasicAttackBonus,
  grantsHolySpellCastSelfHeal,
  grantsHuntersMarkBasicAttackBonus,
  grantsKingsCommandAllyStrengthBuff,
  grantsSpellCastManaMasteryRestore,
  grantsWildChannelPrimalSkillManaRestore,
  grantsWildChannelPrimalSpellStaminaRestore,
  getDevotionSpellHealBonus,
  isKingsCommandStrengthBuffTarget,
} from "./classPassiveTraits";

describe("CLASS_PASSIVE_TRAITS", () => {
  it("assigns Plate Bearing to Knight", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Knight, "plateBearing");
    assert.equal(getClassPassiveTraitForClass("Knight")?.name, "Plate Bearing");
  });

  it("assigns Sanctified to Paladin", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Paladin, "sanctified");
    assert.equal(getClassPassiveTraitForClass("Paladin")?.name, "Sanctified");
  });

  it("assigns Soul Harvest to Warlock", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Warlock, "soulHarvest");
    assert.equal(
      getClassPassiveTraitForClass("Warlock")?.name,
      "Soul Harvest"
    );
  });

  it("assigns Relentless Pursuit to Charger", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Charger, "relentlessPursuit");
    assert.equal(
      getClassPassiveTraitForClass("Charger")?.name,
      "Relentless Pursuit"
    );
  });

  it("assigns Rend to Berserker", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Berserker, "rend");
    assert.equal(getClassPassiveTraitForClass("Berserker")?.name, "Rend");
  });

  it("assigns Devotion to Priestess", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Priestess, "devotion");
    assert.equal(getClassPassiveTraitForClass("Priestess")?.name, "Devotion");
  });

  it("assigns Mana Mastery to Sorcerer", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Sorcerer, "manaMastery");
    assert.equal(
      getClassPassiveTraitForClass("Sorcerer")?.name,
      "Mana Mastery"
    );
  });

  it("assigns Cleave to Moonblade", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Moonblade, "cleave");
    assert.equal(getClassPassiveTraitForClass("Moonblade")?.name, "Cleave");
  });

  it("assigns Braced to Marksman", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Marksman, "braced");
    assert.equal(getClassPassiveTraitForClass("Marksman")?.name, "Braced");
  });

  it("assigns Hunter's Mark to Ranger", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Ranger, "huntersMark");
    assert.equal(
      getClassPassiveTraitForClass("Ranger")?.name,
      "Hunter's Mark"
    );
  });

  it("assigns The King's Command to King", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.King, "kingsCommand");
    assert.equal(
      getClassPassiveTraitForClass("King")?.name,
      "The King's Command"
    );
  });

  it("assigns Humble Origins to Peasant", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Peasant, "humbleOrigins");
    assert.equal(
      getClassPassiveTraitForClass("Peasant")?.name,
      "Humble Origins"
    );
  });

  it("assigns Wild Channel to Shaman", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Shaman, "wildChannel");
    assert.equal(
      getClassPassiveTraitForClass("Shaman")?.name,
      "Wild Channel"
    );
  });

  it("returns null for classes without a trait", () => {
    assert.equal(getClassPassiveTraitForClass("UnknownClass"), null);
  });
});

describe("calculateBasicAttackDamage", () => {
  it("reduces basic attack damage for Knight defenders", () => {
    assert.equal(calculateBasicAttackDamage(5, "Knight"), 4);
    assert.equal(calculateBasicAttackDamage(2, "Knight"), 1);
    assert.equal(calculateBasicAttackDamage(1, "Knight"), 1);
  });

  it("does not modify damage against defenders without traits", () => {
    assert.equal(calculateBasicAttackDamage(5, "Berserker"), 5);
    assert.equal(calculateBasicAttackDamage(1, "Berserker"), 1);
  });

  it("clamps negative attack power to zero before traits", () => {
    assert.equal(calculateBasicAttackDamage(-3, "Berserker"), 0);
    assert.equal(calculateBasicAttackDamage(-3, "Knight"), 1);
  });

  it("adds Braced bonus for stationary Marksman attackers", () => {
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Marksman",
        attackerHasMovedThisTurn: 0,
      }),
      6
    );
  });

  it("does not add Braced bonus after Marksman has moved", () => {
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Marksman",
        attackerHasMovedThisTurn: 1,
      }),
      5
    );
  });

  it("adds Hunter's Mark bonus against Frozen, Bleeding, or Stunned defenders", () => {
    for (const effectKey of ["frozen", "bleeding", "stunned"]) {
      assert.equal(
        calculateBasicAttackDamage(4, "Berserker", {
          attackerClass: "Ranger",
          defenderStatusEffects: [{ effectKey, turnsRemaining: 1 }],
        }),
        5
      );
    }
  });

  it("does not add Hunter's Mark bonus against unaffected defenders", () => {
    assert.equal(
      calculateBasicAttackDamage(4, "Berserker", {
        attackerClass: "Ranger",
        defenderStatusEffects: [{ effectKey: "frozen", turnsRemaining: 0 }],
      }),
      4
    );
    assert.equal(
      calculateBasicAttackDamage(4, "Berserker", {
        attackerClass: "Ranger",
        defenderStatusEffects: [],
      }),
      4
    );
  });

  it("applies offensive bonuses before defender damage reduction", () => {
    assert.equal(
      calculateBasicAttackDamage(5, "Knight", {
        attackerClass: "Marksman",
        attackerHasMovedThisTurn: 0,
      }),
      5
    );
  });
});

describe("grantsBracedBasicAttackBonus", () => {
  it("applies to stationary Marksmen", () => {
    assert.equal(grantsBracedBasicAttackBonus("Marksman", 0), true);
    assert.equal(grantsBracedBasicAttackBonus("Marksman", false), true);
  });

  it("does not apply after moving or for other classes", () => {
    assert.equal(grantsBracedBasicAttackBonus("Marksman", 1), false);
    assert.equal(grantsBracedBasicAttackBonus("Ranger", 0), false);
  });
});

describe("grantsHuntersMarkBasicAttackBonus", () => {
  it("applies to Ranger attacks against Frozen, Bleeding, or Stunned targets", () => {
    for (const effectKey of ["frozen", "bleeding", "stunned"]) {
      assert.equal(
        grantsHuntersMarkBasicAttackBonus("Ranger", [
          { effectKey, turnsRemaining: 1 },
        ]),
        true
      );
    }
  });

  it("does not apply without a qualifying status or for other classes", () => {
    assert.equal(grantsHuntersMarkBasicAttackBonus("Ranger", []), false);
    assert.equal(
      grantsHuntersMarkBasicAttackBonus("Ranger", [
        { effectKey: "bleeding", turnsRemaining: 0 },
      ]),
      false
    );
    assert.equal(
      grantsHuntersMarkBasicAttackBonus("Marksman", [
        { effectKey: "frozen", turnsRemaining: 1 },
      ]),
      false
    );
  });
});

describe("grantsHolySpellCastSelfHeal", () => {
  it("applies to Paladin Holy spells", () => {
    assert.equal(grantsHolySpellCastSelfHeal("Paladin", "Holy"), true);
  });

  it("does not apply to non-Holy spells", () => {
    assert.equal(grantsHolySpellCastSelfHeal("Paladin", "Frost"), false);
    assert.equal(grantsHolySpellCastSelfHeal("Paladin", null), false);
  });

  it("does not apply to other classes", () => {
    assert.equal(grantsHolySpellCastSelfHeal("Priestess", "Holy"), false);
    assert.equal(grantsHolySpellCastSelfHeal("Knight", "Holy"), false);
  });
});

describe("applyTakedownTraitRestoreToWarrior", () => {
  const baseResources = {
    currentMana: 3,
    mana: 10,
    currentStamina: 4,
    stamina: 12,
  };

  it("restores 1 mana for Warlock takedowns", () => {
    assert.deepEqual(
      applyTakedownTraitRestoreToWarrior({
        warriorClass: "Warlock",
        ...baseResources,
      }),
      { currentMana: 4, currentStamina: 4 }
    );
  });

  it("restores 1 stamina for Charger takedowns", () => {
    assert.deepEqual(
      applyTakedownTraitRestoreToWarrior({
        warriorClass: "Charger",
        ...baseResources,
      }),
      { currentMana: 3, currentStamina: 5 }
    );
  });

  it("caps restored resources at max values", () => {
    assert.deepEqual(
      applyTakedownTraitRestoreToWarrior({
        warriorClass: "Warlock",
        currentMana: 10,
        mana: 10,
        currentStamina: 4,
        stamina: 12,
      }),
      { currentMana: 10, currentStamina: 4 }
    );

    assert.deepEqual(
      applyTakedownTraitRestoreToWarrior({
        warriorClass: "Charger",
        currentMana: 3,
        mana: 10,
        currentStamina: 12,
        stamina: 12,
      }),
      { currentMana: 3, currentStamina: 12 }
    );
  });

  it("does not restore resources for classes without takedown traits", () => {
    assert.deepEqual(
      applyTakedownTraitRestoreToWarrior({
        warriorClass: "Knight",
        ...baseResources,
      }),
      { currentMana: 3, currentStamina: 4 }
    );
  });
});

describe("grantsBasicAttackBleeding", () => {
  it("applies to Berserker basic attacks", () => {
    assert.equal(grantsBasicAttackBleeding("Berserker"), true);
  });

  it("does not apply to other classes", () => {
    assert.equal(grantsBasicAttackBleeding("Knight"), false);
    assert.equal(grantsBasicAttackBleeding("Charger"), false);
  });
});

describe("grantsBasicAttackCleave", () => {
  it("applies to Moonblade basic attacks", () => {
    assert.equal(grantsBasicAttackCleave("Moonblade"), true);
  });

  it("does not apply to other classes", () => {
    assert.equal(grantsBasicAttackCleave("Berserker"), false);
    assert.equal(grantsBasicAttackCleave("Knight"), false);
  });
});

describe("grantsSpellCastManaMasteryRestore", () => {
  it("applies to Sorcerer spell casts", () => {
    assert.equal(grantsSpellCastManaMasteryRestore("Sorcerer"), true);
  });

  it("does not apply to other classes", () => {
    assert.equal(grantsSpellCastManaMasteryRestore("Warlock"), false);
    assert.equal(grantsSpellCastManaMasteryRestore("Priestess"), false);
  });
});

describe("applySpellCastManaMasteryRestoreToWarrior", () => {
  it("restores 1 mana for Sorcerer spell casts", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        warriorClass: "Sorcerer",
        currentMana: 4,
        mana: 12,
      }),
      { currentMana: 5 }
    );
  });

  it("caps restored mana at max", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        warriorClass: "Sorcerer",
        currentMana: 12,
        mana: 12,
      }),
      { currentMana: 12 }
    );
  });

  it("does not restore mana for other classes", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        warriorClass: "Priestess",
        currentMana: 4,
        mana: 12,
      }),
      { currentMana: 4 }
    );
  });
});

describe("grantsWildChannelPrimalSpellStaminaRestore", () => {
  it("applies to Shaman Primal spell casts", () => {
    assert.equal(
      grantsWildChannelPrimalSpellStaminaRestore("Shaman", "Primal"),
      true
    );
  });

  it("does not apply to non-Primal spells", () => {
    assert.equal(
      grantsWildChannelPrimalSpellStaminaRestore("Shaman", "Holy"),
      false
    );
    assert.equal(
      grantsWildChannelPrimalSpellStaminaRestore("Shaman", null),
      false
    );
  });

  it("does not apply to other classes", () => {
    assert.equal(
      grantsWildChannelPrimalSpellStaminaRestore("Sorcerer", "Primal"),
      false
    );
  });
});

describe("grantsWildChannelPrimalSkillManaRestore", () => {
  it("applies to Shaman Primal skill use", () => {
    assert.equal(
      grantsWildChannelPrimalSkillManaRestore("Shaman", "Primal"),
      true
    );
  });

  it("does not apply to non-Primal skills", () => {
    assert.equal(
      grantsWildChannelPrimalSkillManaRestore("Shaman", null),
      false
    );
  });

  it("does not apply to other classes", () => {
    assert.equal(
      grantsWildChannelPrimalSkillManaRestore("Moonblade", "Primal"),
      false
    );
  });
});

describe("applyWildChannelPrimalSpellStaminaRestoreToWarrior", () => {
  it("restores 1 stamina for Shaman Primal spell casts", () => {
    assert.deepEqual(
      applyWildChannelPrimalSpellStaminaRestoreToWarrior(
        {
          warriorClass: "Shaman",
          currentStamina: 4,
          stamina: 10,
        },
        "Primal"
      ),
      { currentStamina: 5 }
    );
  });

  it("caps restored stamina at max", () => {
    assert.deepEqual(
      applyWildChannelPrimalSpellStaminaRestoreToWarrior(
        {
          warriorClass: "Shaman",
          currentStamina: 10,
          stamina: 10,
        },
        "Primal"
      ),
      { currentStamina: 10 }
    );
  });

  it("does not restore stamina for non-Primal spells or other classes", () => {
    assert.deepEqual(
      applyWildChannelPrimalSpellStaminaRestoreToWarrior(
        {
          warriorClass: "Shaman",
          currentStamina: 4,
          stamina: 10,
        },
        null
      ),
      { currentStamina: 4 }
    );
    assert.deepEqual(
      applyWildChannelPrimalSpellStaminaRestoreToWarrior(
        {
          warriorClass: "Sorcerer",
          currentStamina: 4,
          stamina: 10,
        },
        "Primal"
      ),
      { currentStamina: 4 }
    );
  });
});

describe("applyWildChannelPrimalSkillManaRestoreToWarrior", () => {
  it("restores 1 mana for Shaman Primal skill use", () => {
    assert.deepEqual(
      applyWildChannelPrimalSkillManaRestoreToWarrior(
        {
          warriorClass: "Shaman",
          currentMana: 4,
          mana: 12,
        },
        "Primal"
      ),
      { currentMana: 5 }
    );
  });

  it("caps restored mana at max", () => {
    assert.deepEqual(
      applyWildChannelPrimalSkillManaRestoreToWarrior(
        {
          warriorClass: "Shaman",
          currentMana: 12,
          mana: 12,
        },
        "Primal"
      ),
      { currentMana: 12 }
    );
  });

  it("does not restore mana for non-Primal skills or other classes", () => {
    assert.deepEqual(
      applyWildChannelPrimalSkillManaRestoreToWarrior(
        {
          warriorClass: "Shaman",
          currentMana: 4,
          mana: 12,
        },
        null
      ),
      { currentMana: 4 }
    );
    assert.deepEqual(
      applyWildChannelPrimalSkillManaRestoreToWarrior(
        {
          warriorClass: "Sorcerer",
          currentMana: 4,
          mana: 12,
        },
        "Primal"
      ),
      { currentMana: 4 }
    );
  });
});

describe("grantsKingsCommandAllyStrengthBuff", () => {
  it("applies to King skill and spell use", () => {
    assert.equal(grantsKingsCommandAllyStrengthBuff("King"), true);
  });

  it("does not apply to other classes", () => {
    assert.equal(grantsKingsCommandAllyStrengthBuff("Paladin"), false);
    assert.equal(grantsKingsCommandAllyStrengthBuff("Charger"), false);
  });
});

describe("isKingsCommandStrengthBuffTarget", () => {
  const kingCaster = { id: 1, warriorClass: "King", armyId: 10 };
  const ally = {
    id: 2,
    armyId: 10,
    currentHealth: 5,
  };

  it("targets alive allies in the same army", () => {
    assert.equal(isKingsCommandStrengthBuffTarget(ally, kingCaster), true);
  });

  it("does not target the caster", () => {
    assert.equal(
      isKingsCommandStrengthBuffTarget({ ...ally, id: 1 }, kingCaster),
      false
    );
  });

  it("does not target enemies or dead allies", () => {
    assert.equal(
      isKingsCommandStrengthBuffTarget({ ...ally, armyId: 99 }, kingCaster),
      false
    );
    assert.equal(
      isKingsCommandStrengthBuffTarget(
        { ...ally, currentHealth: 0 },
        kingCaster
      ),
      false
    );
  });

  it("does not target allies for non-King casters", () => {
    assert.equal(
      isKingsCommandStrengthBuffTarget(ally, {
        ...kingCaster,
        warriorClass: "Paladin",
      }),
      false
    );
  });
});

describe("createKingsCommandStrengthBuffParams", () => {
  it("returns a 1-turn +1 strength buff", () => {
    assert.deepEqual(createKingsCommandStrengthBuffParams(), {
      statModifiers: { strength: 1 },
      duration: 1,
      label: "King's Command",
    });
  });
});

describe("getDevotionSpellHealBonus", () => {
  it("returns 1 for Priestess healers", () => {
    assert.equal(getDevotionSpellHealBonus("Priestess"), 1);
  });

  it("returns 0 for other classes", () => {
    assert.equal(getDevotionSpellHealBonus("Paladin"), 0);
    assert.equal(getDevotionSpellHealBonus(undefined), 0);
  });
});

describe("applyBasicAttackBleedingToWarrior", () => {
  it("adds bleeding for 2 turns", () => {
    const result = applyBasicAttackBleedingToWarrior(undefined);
    assert.equal(result.length, 1);
    assert.equal(result[0]?.effectKey, "bleeding");
    assert.equal(result[0]?.turnsRemaining, 2);
  });

  it("extends existing bleeding duration", () => {
    const result = applyBasicAttackBleedingToWarrior([
      {
        effectKey: "bleeding",
        name: "Bleeding",
        turnsRemaining: 2,
        tags: [],
      },
    ]);
    assert.equal(result[0]?.turnsRemaining, 2);
  });
});

describe("applyHumbleOriginsExperienceBonus", () => {
  it("increases XP by 10% for Peasants", () => {
    assert.equal(applyHumbleOriginsExperienceBonus("Peasant", 20), 22);
    assert.equal(applyHumbleOriginsExperienceBonus("Peasant", 7), 8);
  });

  it("does not modify XP for other classes", () => {
    assert.equal(applyHumbleOriginsExperienceBonus("Knight", 20), 20);
  });

  it("ignores non-positive amounts", () => {
    assert.equal(applyHumbleOriginsExperienceBonus("Peasant", 0), 0);
  });
});

describe("applyHumbleOriginsLevelUpBonus", () => {
  it("adds +1 to the selected permanent stat", () => {
    const stats = {
      health: 10,
      mana: 1,
      strength: 4,
      stamina: 3,
      speed: 2,
      faith: 1,
      spellDamage: 1,
      currentHealth: 8,
      currentMana: 1,
      currentStamina: 3,
    };

    const result = applyHumbleOriginsLevelUpBonus(stats, 2);

    assert.equal(result.strength, 5);
    assert.equal(result.health, stats.health);
  });

  it("also increases matching current pool stats when alive", () => {
    const stats = {
      health: 10,
      mana: 1,
      strength: 4,
      stamina: 3,
      speed: 2,
      faith: 1,
      spellDamage: 1,
      currentHealth: 8,
      currentMana: 1,
      currentStamina: 3,
    };

    const result = applyHumbleOriginsLevelUpBonus(stats, 0);

    assert.equal(result.health, 11);
    assert.equal(result.currentHealth, 9);
  });

  it("does not restore current health for defeated warriors", () => {
    const stats = {
      health: 10,
      mana: 1,
      strength: 4,
      stamina: 3,
      speed: 2,
      faith: 1,
      spellDamage: 1,
      currentHealth: 0,
      currentMana: 0,
      currentStamina: 0,
    };

    const result = applyHumbleOriginsLevelUpBonus(stats, 0);

    assert.equal(result.health, 11);
    assert.equal(result.currentHealth, 0);
  });
});
