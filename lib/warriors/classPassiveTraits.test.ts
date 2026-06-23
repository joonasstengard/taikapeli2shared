import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyBasicAttackBleedingToWarrior,
  applyKingsCommandStaminaRestoreToAlly,
  applySpellCastManaMasteryRestoreToWarrior,
  applyTakedownTraitRestoreToWarrior,
  calculateBasicAttackDamage,
  CLASS_PASSIVE_TRAITS,
  getClassPassiveTraitForClass,
  grantsBasicAttackBleeding,
  grantsBasicAttackCleave,
  grantsBracedBasicAttackBonus,
  grantsHolySpellCastSelfHeal,
  grantsHuntersMarkBasicAttackBonus,
  grantsKingsCommandAllyStaminaRestore,
  grantsSpellCastManaMasteryRestore,
  getDevotionSpellHealBonus,
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

  it("assigns Soul Harvest to Necromancer", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Necromancer, "soulHarvest");
    assert.equal(
      getClassPassiveTraitForClass("Necromancer")?.name,
      "Soul Harvest"
    );
  });

  it("assigns Relentless Pursuit to Horseman", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Horseman, "relentlessPursuit");
    assert.equal(
      getClassPassiveTraitForClass("Horseman")?.name,
      "Relentless Pursuit"
    );
  });

  it("assigns Rend to Raider", () => {
    assert.equal(CLASS_PASSIVE_TRAITS.Raider, "rend");
    assert.equal(getClassPassiveTraitForClass("Raider")?.name, "Rend");
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

  it("returns null for classes without a trait", () => {
    assert.equal(getClassPassiveTraitForClass("Peasant"), null);
  });
});

describe("calculateBasicAttackDamage", () => {
  it("reduces basic attack damage for Knight defenders", () => {
    assert.equal(calculateBasicAttackDamage(5, "Knight"), 4);
    assert.equal(calculateBasicAttackDamage(2, "Knight"), 1);
    assert.equal(calculateBasicAttackDamage(1, "Knight"), 1);
  });

  it("does not modify damage against defenders without traits", () => {
    assert.equal(calculateBasicAttackDamage(5, "Raider"), 5);
    assert.equal(calculateBasicAttackDamage(1, "Raider"), 1);
  });

  it("clamps negative attack power to zero before traits", () => {
    assert.equal(calculateBasicAttackDamage(-3, "Raider"), 0);
    assert.equal(calculateBasicAttackDamage(-3, "Knight"), 1);
  });

  it("adds Braced bonus for stationary Marksman attackers", () => {
    assert.equal(
      calculateBasicAttackDamage(5, "Raider", {
        attackerClass: "Marksman",
        attackerHasMovedThisTurn: 0,
      }),
      6
    );
  });

  it("does not add Braced bonus after Marksman has moved", () => {
    assert.equal(
      calculateBasicAttackDamage(5, "Raider", {
        attackerClass: "Marksman",
        attackerHasMovedThisTurn: 1,
      }),
      5
    );
  });

  it("adds Hunter's Mark bonus against Frozen defenders", () => {
    assert.equal(
      calculateBasicAttackDamage(4, "Raider", {
        attackerClass: "Ranger",
        defenderStatusEffects: [
          { effectKey: "frozen", turnsRemaining: 1 },
        ],
      }),
      5
    );
  });

  it("does not add Hunter's Mark bonus against non-Frozen defenders", () => {
    assert.equal(
      calculateBasicAttackDamage(4, "Raider", {
        attackerClass: "Ranger",
        defenderStatusEffects: [
          { effectKey: "frozen", turnsRemaining: 0 },
        ],
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
  it("applies to Ranger attacks against Frozen targets", () => {
    assert.equal(
      grantsHuntersMarkBasicAttackBonus("Ranger", [
        { effectKey: "frozen", turnsRemaining: 1 },
      ]),
      true
    );
  });

  it("does not apply without Frozen or for other classes", () => {
    assert.equal(grantsHuntersMarkBasicAttackBonus("Ranger", []), false);
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

  it("restores 1 mana for Necromancer takedowns", () => {
    assert.deepEqual(
      applyTakedownTraitRestoreToWarrior({
        class: "Necromancer",
        ...baseResources,
      }),
      { currentMana: 4, currentStamina: 4 }
    );
  });

  it("restores 1 stamina for Horseman takedowns", () => {
    assert.deepEqual(
      applyTakedownTraitRestoreToWarrior({
        class: "Horseman",
        ...baseResources,
      }),
      { currentMana: 3, currentStamina: 5 }
    );
  });

  it("caps restored resources at max values", () => {
    assert.deepEqual(
      applyTakedownTraitRestoreToWarrior({
        class: "Necromancer",
        currentMana: 10,
        mana: 10,
        currentStamina: 4,
        stamina: 12,
      }),
      { currentMana: 10, currentStamina: 4 }
    );

    assert.deepEqual(
      applyTakedownTraitRestoreToWarrior({
        class: "Horseman",
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
        class: "Knight",
        ...baseResources,
      }),
      { currentMana: 3, currentStamina: 4 }
    );
  });
});

describe("grantsBasicAttackBleeding", () => {
  it("applies to Raider basic attacks", () => {
    assert.equal(grantsBasicAttackBleeding("Raider"), true);
  });

  it("does not apply to other classes", () => {
    assert.equal(grantsBasicAttackBleeding("Knight"), false);
    assert.equal(grantsBasicAttackBleeding("Horseman"), false);
  });
});

describe("grantsBasicAttackCleave", () => {
  it("applies to Moonblade basic attacks", () => {
    assert.equal(grantsBasicAttackCleave("Moonblade"), true);
  });

  it("does not apply to other classes", () => {
    assert.equal(grantsBasicAttackCleave("Raider"), false);
    assert.equal(grantsBasicAttackCleave("Knight"), false);
  });
});

describe("grantsSpellCastManaMasteryRestore", () => {
  it("applies to Sorcerer spell casts", () => {
    assert.equal(grantsSpellCastManaMasteryRestore("Sorcerer"), true);
  });

  it("does not apply to other classes", () => {
    assert.equal(grantsSpellCastManaMasteryRestore("Necromancer"), false);
    assert.equal(grantsSpellCastManaMasteryRestore("Priestess"), false);
  });
});

describe("applySpellCastManaMasteryRestoreToWarrior", () => {
  it("restores 1 mana for Sorcerer spell casts", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        class: "Sorcerer",
        currentMana: 4,
        mana: 12,
      }),
      { currentMana: 5 }
    );
  });

  it("caps restored mana at max", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        class: "Sorcerer",
        currentMana: 12,
        mana: 12,
      }),
      { currentMana: 12 }
    );
  });

  it("does not restore mana for other classes", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        class: "Priestess",
        currentMana: 4,
        mana: 12,
      }),
      { currentMana: 4 }
    );
  });
});

describe("grantsKingsCommandAllyStaminaRestore", () => {
  it("applies to King skill and spell use", () => {
    assert.equal(grantsKingsCommandAllyStaminaRestore("King"), true);
  });

  it("does not apply to other classes", () => {
    assert.equal(grantsKingsCommandAllyStaminaRestore("Paladin"), false);
    assert.equal(grantsKingsCommandAllyStaminaRestore("Horseman"), false);
  });
});

describe("applyKingsCommandStaminaRestoreToAlly", () => {
  const kingCaster = { id: 1, class: "King", armyId: 10 };
  const ally = {
    id: 2,
    armyId: 10,
    currentHealth: 5,
    currentStamina: 3,
    stamina: 8,
  };

  it("restores 1 stamina to alive allies in the same army", () => {
    assert.deepEqual(
      applyKingsCommandStaminaRestoreToAlly(ally, kingCaster),
      { currentStamina: 4 }
    );
  });

  it("does not restore stamina to the caster", () => {
    assert.deepEqual(
      applyKingsCommandStaminaRestoreToAlly(
        { ...ally, id: 1 },
        kingCaster
      ),
      { currentStamina: 3 }
    );
  });

  it("does not restore stamina to enemies or dead allies", () => {
    assert.deepEqual(
      applyKingsCommandStaminaRestoreToAlly(
        { ...ally, armyId: 99 },
        kingCaster
      ),
      { currentStamina: 3 }
    );
    assert.deepEqual(
      applyKingsCommandStaminaRestoreToAlly(
        { ...ally, currentHealth: 0 },
        kingCaster
      ),
      { currentStamina: 3 }
    );
  });

  it("caps restored stamina at max", () => {
    assert.deepEqual(
      applyKingsCommandStaminaRestoreToAlly(
        { ...ally, currentStamina: 8 },
        kingCaster
      ),
      { currentStamina: 8 }
    );
  });

  it("does not restore stamina for non-King casters", () => {
    assert.deepEqual(
      applyKingsCommandStaminaRestoreToAlly(ally, {
        ...kingCaster,
        class: "Paladin",
      }),
      { currentStamina: 3 }
    );
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
  it("adds bleeding for 1 turn", () => {
    const result = applyBasicAttackBleedingToWarrior(undefined);
    assert.equal(result.length, 1);
    assert.equal(result[0]?.effectKey, "bleeding");
    assert.equal(result[0]?.turnsRemaining, 1);
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
