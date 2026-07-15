import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ALL_CAMPAIGN_PERK_IDS, CAMPAIGN_PERK_ID } from "./campaignPerkIds";
import {
  DURN_KHARAD_DRILL_TRAINING_COST_MULTIPLIER,
  EXPANDED_GRIMOIRE_MARKET_SPELL_PRICE_MULTIPLIER,
  EXPANDED_GRIMOIRE_MARKET_SPELLS_PER_WEEK,
  HEREGELD_WEEKLY_GOLD_BONUS,
  RESILIENT_NATION_HEALTH_LOSS_REDUCTION,
  WAR_CHEST_STARTING_GOLD_BONUS,
} from "./campaignPerkConstants";
import {
  CAMPAIGN_PERK_DEFINITIONS,
  CAMPAIGN_PERK_DEFINITIONS_BY_ID,
  getCampaignPerkDefinition,
} from "./campaignPerkDefinitions";

describe("CAMPAIGN_PERK_DEFINITIONS", () => {
  it("defines every campaign perk exactly once", () => {
    const definitionIds = CAMPAIGN_PERK_DEFINITIONS.map(
      (definition) => definition.id
    );

    assert.deepEqual(
      [...definitionIds].sort(),
      [...ALL_CAMPAIGN_PERK_IDS].sort()
    );
    assert.equal(new Set(definitionIds).size, ALL_CAMPAIGN_PERK_IDS.length);
  });

  it("keeps the lookup map in sync with the definitions", () => {
    for (const definition of CAMPAIGN_PERK_DEFINITIONS) {
      assert.equal(CAMPAIGN_PERK_DEFINITIONS_BY_ID[definition.id], definition);
      assert.equal(getCampaignPerkDefinition(definition.id), definition);
    }
  });

  it("keeps buffed perk effect values and copy aligned", () => {
    const warChest = getCampaignPerkDefinition(CAMPAIGN_PERK_ID.warChest);
    assert.equal(WAR_CHEST_STARTING_GOLD_BONUS, 20);
    assert.deepEqual(warChest.effect, {
      type: "starting_gold",
      bonus: WAR_CHEST_STARTING_GOLD_BONUS,
    });
    assert.match(warChest.description, /20 extra gold/);

    const resilientNation = getCampaignPerkDefinition(
      CAMPAIGN_PERK_ID.resilientNation
    );
    assert.equal(RESILIENT_NATION_HEALTH_LOSS_REDUCTION, 10);
    assert.deepEqual(resilientNation.effect, {
      type: "nation_health_loss_reduction",
      reduction: RESILIENT_NATION_HEALTH_LOSS_REDUCTION,
    });
    assert.match(resilientNation.description, /10 less nation health/);

    const heregeld = getCampaignPerkDefinition(CAMPAIGN_PERK_ID.heregeld);
    assert.equal(HEREGELD_WEEKLY_GOLD_BONUS, 5);
    assert.deepEqual(heregeld.effect, {
      type: "weekly_gold",
      bonus: HEREGELD_WEEKLY_GOLD_BONUS,
    });
    assert.match(heregeld.description, /5 extra gold every week/);

    const expandedGrimoire = getCampaignPerkDefinition(
      CAMPAIGN_PERK_ID.expandedGrimoire
    );
    assert.equal(EXPANDED_GRIMOIRE_MARKET_SPELL_PRICE_MULTIPLIER, 0.8);
    assert.deepEqual(expandedGrimoire.effect, {
      type: "market_spell_options",
      count: EXPANDED_GRIMOIRE_MARKET_SPELLS_PER_WEEK,
      priceMultiplier: EXPANDED_GRIMOIRE_MARKET_SPELL_PRICE_MULTIPLIER,
    });
    assert.match(expandedGrimoire.description, /20% less gold/);

    const durnKharadDrill = getCampaignPerkDefinition(
      CAMPAIGN_PERK_ID.durnKharadDrill
    );
    assert.equal(DURN_KHARAD_DRILL_TRAINING_COST_MULTIPLIER, 0.8);
    assert.deepEqual(durnKharadDrill.effect, {
      type: "training_cost_multiplier",
      multiplier: DURN_KHARAD_DRILL_TRAINING_COST_MULTIPLIER,
    });
    assert.equal(durnKharadDrill.iconFileName, "durn_kharad_drill.png");
    assert.match(durnKharadDrill.description, /20% less gold/);
  });

  it("throws for unknown campaign perks", () => {
    assert.throws(
      () => getCampaignPerkDefinition("not_a_real_perk" as never),
      /Unknown campaign perk: not_a_real_perk/
    );
  });
});
