import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CAMPAIGN_PERK_ID } from "./campaignPerkIds";
import {
  ABILITY_MASTERY_REQUIRED_LEVEL_OFFSET,
  DURN_KHARAD_DRILL_TRAINING_COST_MULTIPLIER,
  EXPANDED_GRIMOIRE_MARKET_SPELLS_PER_WEEK,
  EXPANDED_GRIMOIRE_MARKET_SPELL_PRICE_MULTIPLIER,
  HEREGELD_WEEKLY_GOLD_BONUS,
  LIGHT_IN_THE_DARKNESS_RECRUIT_FAITH_BONUS,
  PRESSED_INTO_SERVICE_STARTING_PEASANT_COUNT,
  RESILIENT_NATION_HEALTH_LOSS_REDUCTION,
  RUNIC_WISDOM_XP_MULTIPLIER,
  UMBRAL_GRACE_RECRUIT_SPEED_BONUS,
  WAR_CHEST_STARTING_GOLD_BONUS,
} from "./campaignPerkConstants";
import {
  applyCampaignPerkToAbilityGrants,
  applyCampaignPerkToAbilityRequiredLevel,
  applyCampaignPerkToMarketSpellPrice,
  applyCampaignPerkToExperienceGain,
  applyCampaignPerkToNationHealthLoss,
  applyCampaignPerkToStartingGold,
  applyCampaignPerkToTrainingCost,
  applyRecruitStatBonuses,
  buildCampaignPerkWeeklyGoldDeltas,
  calculateTrainingCostForCampaignPerk,
  getAbilityRequiredLevelOffset,
  getCampaignPerkMarketSpellCount,
  getCampaignPerkStartingWarriors,
  getCampaignPerkWeeklyGoldBonus,
  getRecruitStatBonuses,
  calculateTrainingCostForArmyPerk,
} from "./campaignPerkEffects";
import {
  calculateTrainingCost,
  trainingCostForPoint,
} from "../warriors/trainingCost";
import { isAbilityUnlocked } from "../warriors/isAbilityUnlocked";
import { LEVEL_SKILL_BUCKETS_BY_CLASS } from "../skills/levelSkillBuckets";
import { LEVEL_SPELL_BUCKETS_BY_CLASS } from "../spells/levelSpellBuckets";

describe("applyCampaignPerkToStartingGold", () => {
  it("adds the War Chest bonus", () => {
    assert.equal(WAR_CHEST_STARTING_GOLD_BONUS, 20);
    assert.equal(
      applyCampaignPerkToStartingGold(50, CAMPAIGN_PERK_ID.warChest),
      70
    );
  });

  it("ignores unrelated perks", () => {
    assert.equal(
      applyCampaignPerkToStartingGold(50, CAMPAIGN_PERK_ID.runicWisdom),
      50
    );
    assert.equal(
      applyCampaignPerkToStartingGold(50, CAMPAIGN_PERK_ID.heregeld),
      50
    );
    assert.equal(
      applyCampaignPerkToStartingGold(50, CAMPAIGN_PERK_ID.pressedIntoService),
      50
    );
  });

  it("returns the base amount when no perk is set", () => {
    assert.equal(applyCampaignPerkToStartingGold(50, null), 50);
  });
});

describe("getCampaignPerkStartingWarriors", () => {
  it("returns a Peasant grant for Pressed Into Service", () => {
    assert.equal(PRESSED_INTO_SERVICE_STARTING_PEASANT_COUNT, 1);
    assert.deepEqual(
      getCampaignPerkStartingWarriors(CAMPAIGN_PERK_ID.pressedIntoService),
      [
        {
          warriorClass: "Peasant",
          count: PRESSED_INTO_SERVICE_STARTING_PEASANT_COUNT,
        },
      ]
    );
  });

  it("returns an empty list for unrelated perks and missing ids", () => {
    assert.deepEqual(getCampaignPerkStartingWarriors(CAMPAIGN_PERK_ID.warChest), []);
    assert.deepEqual(
      getCampaignPerkStartingWarriors(CAMPAIGN_PERK_ID.runicWisdom),
      []
    );
    assert.deepEqual(getCampaignPerkStartingWarriors(null), []);
    assert.deepEqual(getCampaignPerkStartingWarriors(undefined), []);
  });
});

describe("getCampaignPerkWeeklyGoldBonus", () => {
  it("returns the Heregeld bonus", () => {
    assert.equal(HEREGELD_WEEKLY_GOLD_BONUS, 5);
    assert.equal(
      getCampaignPerkWeeklyGoldBonus(CAMPAIGN_PERK_ID.heregeld),
      HEREGELD_WEEKLY_GOLD_BONUS
    );
  });

  it("ignores unrelated perks", () => {
    assert.equal(getCampaignPerkWeeklyGoldBonus(CAMPAIGN_PERK_ID.warChest), 0);
  });

  it("returns zero when no perk is set", () => {
    assert.equal(getCampaignPerkWeeklyGoldBonus(null), 0);
    assert.equal(getCampaignPerkWeeklyGoldBonus(undefined), 0);
  });
});

describe("buildCampaignPerkWeeklyGoldDeltas", () => {
  it("grants weekly gold only to active armies with Heregeld", () => {
    assert.deepEqual(
      buildCampaignPerkWeeklyGoldDeltas([
        {
          id: 1,
          isEliminated: false,
          campaignPerkId: CAMPAIGN_PERK_ID.heregeld,
        },
        {
          id: 2,
          isEliminated: true,
          campaignPerkId: CAMPAIGN_PERK_ID.heregeld,
        },
        {
          id: 3,
          isEliminated: false,
          campaignPerkId: CAMPAIGN_PERK_ID.warChest,
        },
      ]),
      [{ armyId: 1, goldDelta: HEREGELD_WEEKLY_GOLD_BONUS }]
    );
  });
});

describe("getCampaignPerkMarketSpellCount", () => {
  it("uses the Expanded Grimoire market size", () => {
    assert.equal(
      getCampaignPerkMarketSpellCount(4, CAMPAIGN_PERK_ID.expandedGrimoire),
      EXPANDED_GRIMOIRE_MARKET_SPELLS_PER_WEEK
    );
  });

  it("returns the base market size for unrelated or missing perks", () => {
    assert.equal(getCampaignPerkMarketSpellCount(4, CAMPAIGN_PERK_ID.warChest), 4);
    assert.equal(getCampaignPerkMarketSpellCount(4, null), 4);
    assert.equal(getCampaignPerkMarketSpellCount(4, undefined), 4);
  });
});

describe("applyCampaignPerkToMarketSpellPrice", () => {
  it("discounts market spells for Expanded Grimoire", () => {
    assert.equal(EXPANDED_GRIMOIRE_MARKET_SPELL_PRICE_MULTIPLIER, 0.8);
    assert.equal(
      applyCampaignPerkToMarketSpellPrice(20, CAMPAIGN_PERK_ID.expandedGrimoire),
      16
    );
    assert.equal(
      applyCampaignPerkToMarketSpellPrice(13, CAMPAIGN_PERK_ID.expandedGrimoire),
      10
    );
  });

  it("returns the base price for unrelated or missing perks", () => {
    assert.equal(
      applyCampaignPerkToMarketSpellPrice(20, CAMPAIGN_PERK_ID.warChest),
      20
    );
    assert.equal(applyCampaignPerkToMarketSpellPrice(20, null), 20);
    assert.equal(applyCampaignPerkToMarketSpellPrice(20, undefined), 20);
  });
});

describe("applyCampaignPerkToExperienceGain", () => {
  it("applies the Runic Wisdom multiplier with rounding", () => {
    assert.equal(
      applyCampaignPerkToExperienceGain(25, CAMPAIGN_PERK_ID.runicWisdom),
      28
    );
  });

  it("rounds fractional XP the same way as Humble Origins", () => {
    assert.equal(RUNIC_WISDOM_XP_MULTIPLIER, 1.1);
    assert.equal(
      applyCampaignPerkToExperienceGain(4, CAMPAIGN_PERK_ID.runicWisdom),
      4
    );
    assert.equal(
      applyCampaignPerkToExperienceGain(5, CAMPAIGN_PERK_ID.runicWisdom),
      6
    );
    assert.equal(
      applyCampaignPerkToExperienceGain(10, CAMPAIGN_PERK_ID.runicWisdom),
      11
    );
  });

  it("ignores unrelated perks", () => {
    assert.equal(
      applyCampaignPerkToExperienceGain(25, CAMPAIGN_PERK_ID.warChest),
      25
    );
  });

  it("returns the base amount when no perk is set", () => {
    assert.equal(applyCampaignPerkToExperienceGain(25, null), 25);
    assert.equal(applyCampaignPerkToExperienceGain(25, undefined), 25);
  });

  it("does not change zero or negative xp", () => {
    assert.equal(
      applyCampaignPerkToExperienceGain(0, CAMPAIGN_PERK_ID.runicWisdom),
      0
    );
    assert.equal(
      applyCampaignPerkToExperienceGain(-5, CAMPAIGN_PERK_ID.runicWisdom),
      -5
    );
  });
});

describe("applyCampaignPerkToNationHealthLoss", () => {
  it("reduces loss for Resilient Nation", () => {
    assert.equal(RESILIENT_NATION_HEALTH_LOSS_REDUCTION, 10);
    assert.equal(
      applyCampaignPerkToNationHealthLoss(30, CAMPAIGN_PERK_ID.resilientNation),
      20
    );
  });

  it("clamps reduced loss to the configured minimum", () => {
    assert.equal(
      applyCampaignPerkToNationHealthLoss(3, CAMPAIGN_PERK_ID.resilientNation),
      1
    );
  });

  it("ignores unrelated perks", () => {
    assert.equal(
      applyCampaignPerkToNationHealthLoss(30, CAMPAIGN_PERK_ID.warChest),
      30
    );
  });
});

describe("getRecruitStatBonuses", () => {
  it("returns +2 faith for Light In The Darkness", () => {
    assert.deepEqual(
      getRecruitStatBonuses(CAMPAIGN_PERK_ID.lightInTheDarkness),
      { faith: LIGHT_IN_THE_DARKNESS_RECRUIT_FAITH_BONUS, speed: 0 }
    );
  });

  it("returns +2 speed for Umbral Grace", () => {
    assert.deepEqual(getRecruitStatBonuses(CAMPAIGN_PERK_ID.umbralGrace), {
      faith: 0,
      speed: UMBRAL_GRACE_RECRUIT_SPEED_BONUS,
    });
  });

  it("ignores unrelated perks", () => {
    assert.deepEqual(getRecruitStatBonuses(CAMPAIGN_PERK_ID.warChest), {
      faith: 0,
      speed: 0,
    });
  });

  it("returns no bonuses when no perk is set", () => {
    assert.deepEqual(getRecruitStatBonuses(null), { faith: 0, speed: 0 });
    assert.deepEqual(getRecruitStatBonuses(undefined), { faith: 0, speed: 0 });
  });
});

describe("applyRecruitStatBonuses", () => {
  it("adds faith and speed bonuses to warrior stats", () => {
    assert.deepEqual(
      applyRecruitStatBonuses(
        { faith: 3, speed: 5 },
        { faith: 2, speed: 0 }
      ),
      { faith: 5, speed: 5 }
    );
    assert.deepEqual(
      applyRecruitStatBonuses(
        { faith: 3, speed: 5 },
        { faith: 0, speed: 2 }
      ),
      { faith: 3, speed: 7 }
    );
  });
});

describe("applyCampaignPerkToTrainingCost", () => {
  it("discounts training costs for Durn Kharad Drill", () => {
    assert.equal(DURN_KHARAD_DRILL_TRAINING_COST_MULTIPLIER, 0.8);
    assert.equal(
      applyCampaignPerkToTrainingCost(10, CAMPAIGN_PERK_ID.durnKharadDrill),
      8
    );
    assert.equal(
      applyCampaignPerkToTrainingCost(13, CAMPAIGN_PERK_ID.durnKharadDrill),
      10
    );
    assert.equal(
      applyCampaignPerkToTrainingCost(2, CAMPAIGN_PERK_ID.durnKharadDrill),
      2
    );
  });

  it("rounds the same way as market spell discounts", () => {
    assert.equal(
      applyCampaignPerkToTrainingCost(11, CAMPAIGN_PERK_ID.durnKharadDrill),
      Math.round(11 * DURN_KHARAD_DRILL_TRAINING_COST_MULTIPLIER)
    );
  });

  it("ignores unrelated perks", () => {
    assert.equal(
      applyCampaignPerkToTrainingCost(10, CAMPAIGN_PERK_ID.warChest),
      10
    );
    assert.equal(
      applyCampaignPerkToTrainingCost(10, CAMPAIGN_PERK_ID.expandedGrimoire),
      10
    );
  });

  it("returns the base cost when no perk is set", () => {
    assert.equal(applyCampaignPerkToTrainingCost(10, null), 10);
    assert.equal(applyCampaignPerkToTrainingCost(10, undefined), 10);
  });

  it("does not change zero or negative costs", () => {
    assert.equal(
      applyCampaignPerkToTrainingCost(0, CAMPAIGN_PERK_ID.durnKharadDrill),
      0
    );
    assert.equal(
      applyCampaignPerkToTrainingCost(-5, CAMPAIGN_PERK_ID.durnKharadDrill),
      -5
    );
  });
});

describe("calculateTrainingCostForCampaignPerk", () => {
  it("matches the base training cost without a perk", () => {
    assert.equal(
      calculateTrainingCostForCampaignPerk(5, 10, null),
      calculateTrainingCost(5, 10)
    );
    assert.equal(
      calculateTrainingCostForCampaignPerk(5, 10, CAMPAIGN_PERK_ID.warChest),
      calculateTrainingCost(5, 10)
    );
  });

  it("applies Durn Kharad Drill per training point for multi-level trains", () => {
    const fromStat = 5;
    const toStat = 10;
    let expected = 0;

    for (let level = fromStat; level < toStat; level += 1) {
      expected += applyCampaignPerkToTrainingCost(
        trainingCostForPoint(level),
        CAMPAIGN_PERK_ID.durnKharadDrill
      );
    }

    assert.equal(
      calculateTrainingCostForCampaignPerk(
        fromStat,
        toStat,
        CAMPAIGN_PERK_ID.durnKharadDrill
      ),
      expected
    );
    assert.equal(expected, 36);
    assert.equal(calculateTrainingCost(fromStat, toStat), 45);
  });

  it("returns zero when the target is not higher than the current stat", () => {
    assert.equal(
      calculateTrainingCostForCampaignPerk(
        10,
        10,
        CAMPAIGN_PERK_ID.durnKharadDrill
      ),
      0
    );
    assert.equal(
      calculateTrainingCostForCampaignPerk(
        10,
        8,
        CAMPAIGN_PERK_ID.durnKharadDrill
      ),
      0
    );
  });
});

describe("calculateTrainingCostForArmyPerk (player army contract)", () => {
  it("discounts training when the player army has Durn Kharad Drill", () => {
    assert.equal(
      calculateTrainingCostForArmyPerk(
        5,
        10,
        CAMPAIGN_PERK_ID.durnKharadDrill
      ),
      36
    );
  });

  it("does not discount training for unrelated army perks", () => {
    assert.equal(
      calculateTrainingCostForArmyPerk(5, 10, CAMPAIGN_PERK_ID.runicWisdom),
      calculateTrainingCost(5, 10)
    );
  });

  it("ignores invalid stored perk ids", () => {
    assert.equal(
      calculateTrainingCostForArmyPerk(5, 10, "not_a_real_perk"),
      calculateTrainingCost(5, 10)
    );
    assert.equal(
      calculateTrainingCostForArmyPerk(5, 10, null),
      calculateTrainingCost(5, 10)
    );
  });
});

describe("getAbilityRequiredLevelOffset", () => {
  it("returns -1 for Ability Mastery", () => {
    assert.equal(ABILITY_MASTERY_REQUIRED_LEVEL_OFFSET, -1);
    assert.equal(
      getAbilityRequiredLevelOffset(CAMPAIGN_PERK_ID.abilityMastery),
      ABILITY_MASTERY_REQUIRED_LEVEL_OFFSET
    );
  });

  it("returns zero for unrelated or missing perks", () => {
    assert.equal(getAbilityRequiredLevelOffset(CAMPAIGN_PERK_ID.warChest), 0);
    assert.equal(getAbilityRequiredLevelOffset(null), 0);
    assert.equal(getAbilityRequiredLevelOffset(undefined), 0);
  });
});

describe("applyCampaignPerkToAbilityRequiredLevel", () => {
  it("unlocks abilities one level earlier for Ability Mastery", () => {
    assert.equal(
      applyCampaignPerkToAbilityRequiredLevel(
        4,
        CAMPAIGN_PERK_ID.abilityMastery
      ),
      3
    );
    assert.equal(
      applyCampaignPerkToAbilityRequiredLevel(
        3,
        CAMPAIGN_PERK_ID.abilityMastery
      ),
      2
    );
    assert.equal(
      applyCampaignPerkToAbilityRequiredLevel(
        2,
        CAMPAIGN_PERK_ID.abilityMastery
      ),
      1
    );
  });

  it("never reduces requiredLevel below 1", () => {
    assert.equal(
      applyCampaignPerkToAbilityRequiredLevel(
        1,
        CAMPAIGN_PERK_ID.abilityMastery
      ),
      1
    );
  });

  it("leaves requiredLevel unchanged for unrelated or missing perks", () => {
    assert.equal(
      applyCampaignPerkToAbilityRequiredLevel(3, CAMPAIGN_PERK_ID.warChest),
      3
    );
    assert.equal(applyCampaignPerkToAbilityRequiredLevel(3, null), 3);
    assert.equal(applyCampaignPerkToAbilityRequiredLevel(3, undefined), 3);
  });

  it("makes a former level-3 ability usable at warrior level 2", () => {
    const adjusted = applyCampaignPerkToAbilityRequiredLevel(
      3,
      CAMPAIGN_PERK_ID.abilityMastery
    );

    assert.equal(isAbilityUnlocked(2, 3), false);
    assert.equal(isAbilityUnlocked(2, adjusted), true);
    assert.equal(isAbilityUnlocked(1, adjusted), false);
  });
});

describe("applyCampaignPerkToAbilityGrants", () => {
  it("lowers requiredLevel on every grant for Ability Mastery", () => {
    const grants = [
      { skillId: 10, requiredLevel: 1 },
      { skillId: 20, requiredLevel: 2 },
      { skillId: 30, requiredLevel: 4 },
    ];

    assert.deepEqual(
      applyCampaignPerkToAbilityGrants(grants, CAMPAIGN_PERK_ID.abilityMastery),
      [
        { skillId: 10, requiredLevel: 1 },
        { skillId: 20, requiredLevel: 1 },
        { skillId: 30, requiredLevel: 3 },
      ]
    );
  });

  it("returns the same array reference when the perk has no unlock offset", () => {
    const grants = [{ spellId: 1, requiredLevel: 3 }];

    assert.equal(
      applyCampaignPerkToAbilityGrants(grants, CAMPAIGN_PERK_ID.warChest),
      grants
    );
    assert.equal(applyCampaignPerkToAbilityGrants(grants, null), grants);
  });

  it("does not mutate the original grants array", () => {
    const grants = [
      { skillId: 1, requiredLevel: 3 },
      { skillId: 2, requiredLevel: 4 },
    ];

    applyCampaignPerkToAbilityGrants(grants, CAMPAIGN_PERK_ID.abilityMastery);

    assert.deepEqual(grants, [
      { skillId: 1, requiredLevel: 3 },
      { skillId: 2, requiredLevel: 4 },
    ]);
  });

  it("shifts every class skill/spell bucket level earlier without going below 1", () => {
    const skillBucketLevels = [
      ...new Set(
        Object.values(LEVEL_SKILL_BUCKETS_BY_CLASS).flatMap((buckets) =>
          Object.keys(buckets ?? {}).map(Number)
        )
      ),
    ];
    const spellBucketLevels = [
      ...new Set(
        Object.values(LEVEL_SPELL_BUCKETS_BY_CLASS).flatMap((buckets) =>
          Object.keys(buckets ?? {}).map(Number)
        )
      ),
    ];

    for (const requiredLevel of [...skillBucketLevels, ...spellBucketLevels]) {
      const adjusted = applyCampaignPerkToAbilityRequiredLevel(
        requiredLevel,
        CAMPAIGN_PERK_ID.abilityMastery
      );

      assert.equal(adjusted, Math.max(1, requiredLevel - 1));
      if (requiredLevel > 1) {
        assert.equal(isAbilityUnlocked(requiredLevel - 1, adjusted), true);
        assert.equal(isAbilityUnlocked(requiredLevel - 1, requiredLevel), false);
      }
    }
  });
});
