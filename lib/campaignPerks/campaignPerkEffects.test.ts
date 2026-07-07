import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CAMPAIGN_PERK_ID } from "./campaignPerkIds";
import {
  EXPANDED_GRIMOIRE_MARKET_SPELLS_PER_WEEK,
  HEREGELD_WEEKLY_GOLD_BONUS,
  LIGHT_IN_THE_DARKNESS_RECRUIT_FAITH_BONUS,
  RUNIC_WISDOM_XP_MULTIPLIER,
  UMBRAL_GRACE_RECRUIT_SPEED_BONUS,
} from "./campaignPerkConstants";
import {
  applyCampaignPerkToExperienceGain,
  applyCampaignPerkToNationHealthLoss,
  applyCampaignPerkToStartingGold,
  applyRecruitStatBonuses,
  buildCampaignPerkWeeklyGoldDeltas,
  getCampaignPerkMarketSpellCount,
  getCampaignPerkWeeklyGoldBonus,
  getRecruitStatBonuses,
} from "./campaignPerkEffects";

describe("applyCampaignPerkToStartingGold", () => {
  it("adds the War Chest bonus", () => {
    assert.equal(
      applyCampaignPerkToStartingGold(50, CAMPAIGN_PERK_ID.warChest),
      65
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
  });

  it("returns the base amount when no perk is set", () => {
    assert.equal(applyCampaignPerkToStartingGold(50, null), 50);
  });
});

describe("getCampaignPerkWeeklyGoldBonus", () => {
  it("returns the Heregeld bonus", () => {
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
    assert.equal(
      applyCampaignPerkToNationHealthLoss(30, CAMPAIGN_PERK_ID.resilientNation),
      25
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
