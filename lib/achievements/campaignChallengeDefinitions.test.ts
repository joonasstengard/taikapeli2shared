import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CAMPAIGN_CHALLENGE_KEY,
} from "./campaignChallengeKeys";
import { getNewlyBrokenCampaignChallenges } from "./campaignChallengeDefinitions";

function recruitmentEvent(recruitmentCount: number) {
  return {
    type: "player_recruited" as const,
    warriorClass: "Peasant" as const,
    recruitmentCount,
  };
}

describe("getNewlyBrokenCampaignChallenges", () => {
  it("does not break the peasants-only challenge when recruiting a Peasant", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), {
      type: "player_recruited",
      warriorClass: "Peasant",
      recruitmentCount: 1,
    });

    assert.deepEqual(newlyBroken, []);
  });

  it("breaks the peasants-only challenge when recruiting a non-Peasant", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), {
      type: "player_recruited",
      warriorClass: "Ranger",
      recruitmentCount: 1,
    });

    assert.deepEqual(newlyBroken, [
      CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment,
    ]);
  });

  it("does not report an already broken challenge again", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set([CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment]),
      {
        type: "player_recruited",
        warriorClass: "Ranger",
        recruitmentCount: 1,
      }
    );

    assert.deepEqual(newlyBroken, []);
  });

  it("allows recruitments until each challenge's limit is exceeded", () => {
    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(new Set(), recruitmentEvent(1)),
      []
    );

    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(new Set(), recruitmentEvent(2)),
      [CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment]
    );

    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(
        new Set([CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment]),
        recruitmentEvent(3)
      ),
      [CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments]
    );

    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(
        new Set([
          CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment,
          CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments,
        ]),
        recruitmentEvent(4)
      ),
      [CAMPAIGN_CHALLENGE_KEY.maxThreeRecruitments]
    );
  });

  it("breaks all recruitment-count challenges on the fourth recruitment from a clean state", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set(),
      recruitmentEvent(4)
    );

    assert.deepEqual(newlyBroken, [
      CAMPAIGN_CHALLENGE_KEY.maxThreeRecruitments,
      CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments,
      CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment,
    ]);
  });

  it("does not report already broken recruitment-count challenges again", () => {
    const brokenAfterFourth = getNewlyBrokenCampaignChallenges(
      new Set([
        CAMPAIGN_CHALLENGE_KEY.maxThreeRecruitments,
        CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments,
        CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment,
      ]),
      recruitmentEvent(5)
    );

    assert.deepEqual(brokenAfterFourth, []);
  });
});
