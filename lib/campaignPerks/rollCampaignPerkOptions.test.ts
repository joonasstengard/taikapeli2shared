import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ALL_CAMPAIGN_PERK_IDS } from "./campaignPerkIds";
import {
  rollCampaignPerkOptions,
  rollRandomCampaignPerk,
} from "./rollCampaignPerkOptions";

describe("rollCampaignPerkOptions", () => {
  it("returns the requested number of unique perk ids", () => {
    const perkIds = rollCampaignPerkOptions(3, () => 0.1);

    assert.equal(perkIds.length, 3);
    assert.equal(new Set(perkIds).size, 3);
    assert.ok(perkIds.every((perkId) => ALL_CAMPAIGN_PERK_IDS.includes(perkId)));
  });

  it("returns every perk when the pool is smaller than the requested count", () => {
    const perkIds = rollCampaignPerkOptions(ALL_CAMPAIGN_PERK_IDS.length + 1, () => 0.5);

    assert.deepEqual(
      [...perkIds].sort(),
      [...ALL_CAMPAIGN_PERK_IDS].sort()
    );
  });

  it("is deterministic when the random source is deterministic", () => {
    const values = [0.9, 0.1, 0.5, 0.2, 0.8, 0.4];
    const firstRoll = rollCampaignPerkOptions(3, createDeterministicRandom(values));
    const secondRoll = rollCampaignPerkOptions(3, createDeterministicRandom(values));

    assert.deepEqual(firstRoll, secondRoll);
  });
});

describe("rollRandomCampaignPerk", () => {
  it("returns a valid perk id", () => {
    const perkId = rollRandomCampaignPerk(() => 0);

    assert.ok(ALL_CAMPAIGN_PERK_IDS.includes(perkId));
  });
});

function createDeterministicRandom(values: number[]) {
  let index = 0;
  return () => {
    const value = values[Math.min(index, values.length - 1)];
    index += 1;
    return value;
  };
}
