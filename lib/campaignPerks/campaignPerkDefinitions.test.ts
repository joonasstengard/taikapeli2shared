import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ALL_CAMPAIGN_PERK_IDS } from "./campaignPerkIds";
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

  it("throws for unknown campaign perks", () => {
    assert.throws(
      () => getCampaignPerkDefinition("not_a_real_perk" as never),
      /Unknown campaign perk: not_a_real_perk/
    );
  });
});
