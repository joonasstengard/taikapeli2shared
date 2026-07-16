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
  grantsBloodFeudDamageBonus,
  grantsBracedBasicAttackBonus,
  grantsEldritchSpiteDamageBonus,
  grantsHolySpellCastSelfHeal,
  grantsHuntersMarkBasicAttackBonus,
  grantsKingsCommandAllyStrengthBuff,
  grantsSpellCastManaMasteryRestore,
  grantsWildChannelPrimalSkillManaRestore,
  grantsWildChannelPrimalSpellStaminaRestore,
  getBloodFeudDamageBonusAgainstWarrior,
  getDevotionSpellHealBonus,
  getEldritchSpiteDamageBonusAgainstWarrior,
  HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS,
  isKingsCommandStrengthBuffTarget,
} from "./classPassiveTraits";
import { applyArmorMitigation } from "./damageMitigation";

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

  it("assigns Eldritch Spite to Sorcerer", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Sorcerer, "eldritchSpite");
    assert.equal(
      getClassPassiveTraitForClass("Sorcerer")?.name,
      "Eldritch Spite"
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

  it("assigns Blood Feud to Brutalizer", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Brutalizer, "bloodFeud");
    assert.equal(
      getClassPassiveTraitForClass("Brutalizer")?.name,
      "Blood Feud"
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

  it("applies armor before the Knight's Plate Bearing reduction", () => {
    assert.equal(
      calculateBasicAttackDamage(10, "Knight", { defenderArmor: 20 }),
      5
    );
  });

  it("Layer 3: locks strength × armor × Plate Bearing damage table", () => {
    const cases: ReadonlyArray<{
      attackPower: number;
      armor: number;
      defenderClass: string;
      expected: number;
    }> = [
      { attackPower: 8, armor: 0, defenderClass: "Berserker", expected: 8 },
      { attackPower: 8, armor: 10, defenderClass: "Berserker", expected: 6 },
      { attackPower: 8, armor: 10, defenderClass: "Knight", expected: 5 },
      { attackPower: 15, armor: 20, defenderClass: "Berserker", expected: 10 },
      { attackPower: 15, armor: 20, defenderClass: "Knight", expected: 9 },
      { attackPower: 1, armor: 50, defenderClass: "Berserker", expected: 1 },
      { attackPower: 1, armor: 50, defenderClass: "Knight", expected: 1 },
      { attackPower: 2, armor: 50, defenderClass: "Knight", expected: 1 },
      { attackPower: 10, armor: 5, defenderClass: "Berserker", expected: 8 },
      { attackPower: 10, armor: 5, defenderClass: "Knight", expected: 7 },
      { attackPower: 0, armor: 20, defenderClass: "Berserker", expected: 0 },
      { attackPower: 0, armor: 20, defenderClass: "Knight", expected: 0 },
    ];

    for (const row of cases) {
      const actual = calculateBasicAttackDamage(row.attackPower, row.defenderClass, {
        defenderArmor: row.armor,
      });
      assert.equal(
        actual,
        row.expected,
        `power=${row.attackPower} armor=${row.armor} class=${row.defenderClass}`
      );

      const mitigated = applyArmorMitigation(
        Math.max(0, row.attackPower),
        row.armor
      );
      const expectedFromFormula =
        row.defenderClass === "Knight"
          ? mitigated > 0
            ? Math.max(1, mitigated - 1)
            : 0
          : mitigated;
      assert.equal(
        actual,
        expectedFromFormula,
        `formula mismatch power=${row.attackPower} armor=${row.armor} class=${row.defenderClass}`
      );
    }
  });

  it("does not modify damage against defenders without traits", () => {
    assert.equal(calculateBasicAttackDamage(5, "Berserker"), 5);
    assert.equal(calculateBasicAttackDamage(1, "Berserker"), 1);
  });

  it("clamps negative attack power to zero before traits", () => {
    assert.equal(calculateBasicAttackDamage(-3, "Berserker"), 0);
    assert.equal(calculateBasicAttackDamage(-3, "Knight"), 0);
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

  it("adds Blood Feud bonus against Human and Elf defenders", () => {
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Brutalizer",
        defenderRace: "Human",
      }),
      6
    );
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Brutalizer",
        defenderRace: "Elf",
      }),
      6
    );
  });

  it("does not add Blood Feud bonus against other races", () => {
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Brutalizer",
        defenderRace: "Orc",
      }),
      5
    );
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Brutalizer",
        defenderRace: "Dwarf",
      }),
      5
    );
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Brutalizer",
      }),
      5
    );
  });

  it("adds Eldritch Spite bonus against Orc defenders", () => {
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Sorcerer",
        defenderRace: "Orc",
      }),
      6
    );
  });

  it("does not add Eldritch Spite bonus against other races", () => {
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Sorcerer",
        defenderRace: "Human",
      }),
      5
    );
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Sorcerer",
        defenderRace: "Elf",
      }),
      5
    );
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Sorcerer",
        defenderRace: "Dwarf",
      }),
      5
    );
    assert.equal(
      calculateBasicAttackDamage(5, "Berserker", {
        attackerClass: "Sorcerer",
      }),
      5
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
    assert.equal(
      calculateBasicAttackDamage(5, "Knight", {
        attackerClass: "Brutalizer",
        defenderRace: "Human",
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

describe("grantsBloodFeudDamageBonus", () => {
  it("applies to Brutalizer attacks against Humans and Elves", () => {
    assert.equal(grantsBloodFeudDamageBonus("Brutalizer", "Human"), true);
    assert.equal(grantsBloodFeudDamageBonus("Brutalizer", "Elf"), true);
  });

  it("does not apply against other races or for other classes", () => {
    assert.equal(grantsBloodFeudDamageBonus("Brutalizer", "Orc"), false);
    assert.equal(grantsBloodFeudDamageBonus("Brutalizer", "Dwarf"), false);
    assert.equal(grantsBloodFeudDamageBonus("Brutalizer", undefined), false);
    assert.equal(grantsBloodFeudDamageBonus("Berserker", "Human"), false);
  });
});

describe("getBloodFeudDamageBonusAgainstWarrior", () => {
  it("resolves Human and Elf defenders from class picture identity", () => {
    assert.equal(
      getBloodFeudDamageBonusAgainstWarrior("Brutalizer", {
        warriorClass: "Knight",
        gender: "Male",
        picture: 1,
      }),
      1
    );
    assert.equal(
      getBloodFeudDamageBonusAgainstWarrior("Brutalizer", {
        warriorClass: "Moonblade",
        gender: "Male",
        picture: 3,
      }),
      1
    );
  });

  it("does not bonus Orc or Dwarf defenders", () => {
    assert.equal(
      getBloodFeudDamageBonusAgainstWarrior("Brutalizer", {
        warriorClass: "Brutalizer",
        gender: "Male",
        picture: 1,
      }),
      0
    );
    assert.equal(
      getBloodFeudDamageBonusAgainstWarrior("Brutalizer", {
        warriorClass: "Marksman",
        gender: "Male",
        picture: 12,
      }),
      0
    );
  });
});

describe("grantsEldritchSpiteDamageBonus", () => {
  it("applies to Sorcerer attacks against Orcs", () => {
    assert.equal(grantsEldritchSpiteDamageBonus("Sorcerer", "Orc"), true);
  });

  it("does not apply against other races or for other classes", () => {
    assert.equal(grantsEldritchSpiteDamageBonus("Sorcerer", "Human"), false);
    assert.equal(grantsEldritchSpiteDamageBonus("Sorcerer", "Elf"), false);
    assert.equal(grantsEldritchSpiteDamageBonus("Sorcerer", "Dwarf"), false);
    assert.equal(grantsEldritchSpiteDamageBonus("Sorcerer", undefined), false);
    assert.equal(grantsEldritchSpiteDamageBonus("Brutalizer", "Orc"), false);
  });
});

describe("getEldritchSpiteDamageBonusAgainstWarrior", () => {
  it("resolves Orc defenders from class picture identity", () => {
    assert.equal(
      getEldritchSpiteDamageBonusAgainstWarrior("Sorcerer", {
        warriorClass: "Brutalizer",
        gender: "Male",
        picture: 1,
      }),
      1
    );
    assert.equal(
      getEldritchSpiteDamageBonusAgainstWarrior("Sorcerer", {
        warriorClass: "Charger",
        gender: "Male",
        picture: 10,
      }),
      1
    );
  });

  it("does not bonus Human, Elf, or Dwarf defenders", () => {
    assert.equal(
      getEldritchSpiteDamageBonusAgainstWarrior("Sorcerer", {
        warriorClass: "Knight",
        gender: "Male",
        picture: 1,
      }),
      0
    );
    assert.equal(
      getEldritchSpiteDamageBonusAgainstWarrior("Sorcerer", {
        warriorClass: "Moonblade",
        gender: "Male",
        picture: 3,
      }),
      0
    );
    assert.equal(
      getEldritchSpiteDamageBonusAgainstWarrior("Sorcerer", {
        warriorClass: "Marksman",
        gender: "Male",
        picture: 12,
      }),
      0
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
  it("is unused while no class is assigned Mana Mastery", () => {
    assert.equal(grantsSpellCastManaMasteryRestore("Sorcerer"), false);
    assert.equal(grantsSpellCastManaMasteryRestore("Warlock"), false);
    assert.equal(grantsSpellCastManaMasteryRestore("Priestess"), false);
  });
});

describe("applySpellCastManaMasteryRestoreToWarrior", () => {
  it("does not restore mana while Mana Mastery is unassigned", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        warriorClass: "Sorcerer",
        currentMana: 4,
        mana: 12,
      }),
      { currentMana: 4 }
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
  const baseStats = {
    health: 10,
    mana: 1,
    strength: 4,
    stamina: 3,
    speed: 2,
    faith: 1,
    spellDamage: 1,
    armor: 5,
    resistance: 3,
    currentHealth: 8,
    currentMana: 1,
    currentStamina: 3,
  };

  it("adds +1 to the selected permanent stat", () => {
    const result = applyHumbleOriginsLevelUpBonus(baseStats, 2);

    assert.equal(result.strength, 5);
    assert.equal(result.health, baseStats.health);
  });

  it("also increases matching current pool stats when alive", () => {
    const result = applyHumbleOriginsLevelUpBonus(baseStats, 0);

    assert.equal(result.health, 11);
    assert.equal(result.currentHealth, 9);
  });

  it("does not restore current health for defeated warriors", () => {
    const stats = {
      ...baseStats,
      currentHealth: 0,
      currentMana: 0,
      currentStamina: 0,
    };

    const result = applyHumbleOriginsLevelUpBonus(stats, 0);

    assert.equal(result.health, 11);
    assert.equal(result.currentHealth, 0);
  });

  it("Layer 3: includes armor and resistance in the level-up stat key list", () => {
    assert.equal(HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS[7], "armor");
    assert.equal(HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS[8], "resistance");
    assert.ok(HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS.includes("armor"));
    assert.ok(HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS.includes("resistance"));
  });

  it("Layer 3: grants +1 armor when the random index selects armor", () => {
    const armorIndex = HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS.indexOf("armor");
    assert.equal(armorIndex, 7);

    const result = applyHumbleOriginsLevelUpBonus(baseStats, armorIndex);

    assert.equal(result.armor, baseStats.armor + 1);
    assert.equal(result.resistance, baseStats.resistance);
    assert.equal(result.strength, baseStats.strength);
  });

  it("Layer 3: grants +1 resistance when the random index selects resistance", () => {
    const resistanceIndex =
      HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS.indexOf("resistance");
    assert.equal(resistanceIndex, 8);

    const result = applyHumbleOriginsLevelUpBonus(baseStats, resistanceIndex);

    assert.equal(result.resistance, baseStats.resistance + 1);
    assert.equal(result.armor, baseStats.armor);
    assert.equal(result.strength, baseStats.strength);
  });

  it("Layer 3: wraps randomStatIndex with modulo across armor/resistance", () => {
    const length = HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS.length;
    const armorViaWrap = applyHumbleOriginsLevelUpBonus(baseStats, 7 + length);
    const resistanceViaWrap = applyHumbleOriginsLevelUpBonus(
      baseStats,
      8 + length
    );

    assert.equal(armorViaWrap.armor, baseStats.armor + 1);
    assert.equal(resistanceViaWrap.resistance, baseStats.resistance + 1);
  });
});
