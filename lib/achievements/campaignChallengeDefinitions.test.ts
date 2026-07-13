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

const CLASS_RESTRICTION_CHALLENGES = [
  CAMPAIGN_CHALLENGE_KEY.holyOrderRecruitment,
  CAMPAIGN_CHALLENGE_KEY.arcaneCircleRecruitment,
] as const;

describe("getNewlyBrokenCampaignChallenges", () => {
  it("does not break the peasants-only challenge when recruiting a Peasant", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), {
      type: "player_recruited",
      warriorClass: "Peasant",
      recruitmentCount: 1,
    });

    assert.equal(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment),
      false
    );
  });

  it("breaks the peasants-only challenge when recruiting a non-Peasant", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), {
      type: "player_recruited",
      warriorClass: "Ranger",
      recruitmentCount: 1,
    });

    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment)
    );
  });

  it("does not report an already broken challenge again", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set([
        CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment,
        ...CLASS_RESTRICTION_CHALLENGES,
      ]),
      {
        type: "player_recruited",
        warriorClass: "Ranger",
        recruitmentCount: 1,
      }
    );

    assert.deepEqual(newlyBroken, []);
  });

  it("allows recruitments until each challenge's limit is exceeded", () => {
    const classRestrictionsBroken = new Set(CLASS_RESTRICTION_CHALLENGES);

    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(
        classRestrictionsBroken,
        recruitmentEvent(1)
      ),
      []
    );

    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(
        classRestrictionsBroken,
        recruitmentEvent(2)
      ),
      [CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment]
    );

    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(
        new Set([
          ...classRestrictionsBroken,
          CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment,
        ]),
        recruitmentEvent(3)
      ),
      [CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments]
    );

    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(
        new Set([
          ...classRestrictionsBroken,
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

    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.maxThreeRecruitments)
    );
    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments)
    );
    assert.ok(newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment));
  });

  it("does not report already broken recruitment-count challenges again", () => {
    const brokenAfterFourth = getNewlyBrokenCampaignChallenges(
      new Set([
        CAMPAIGN_CHALLENGE_KEY.maxThreeRecruitments,
        CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments,
        CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment,
        ...CLASS_RESTRICTION_CHALLENGES,
      ]),
      recruitmentEvent(5)
    );

    assert.deepEqual(brokenAfterFourth, []);
  });

  it("does not break the holy-order challenge when recruiting Priestesses or Paladins", () => {
    for (const warriorClass of ["Priestess", "Paladin"] as const) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), {
        type: "player_recruited",
        warriorClass,
        recruitmentCount: 1,
      });

      assert.equal(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.holyOrderRecruitment),
        false
      );
    }
  });

  it("breaks the holy-order challenge when recruiting other classes", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), {
      type: "player_recruited",
      warriorClass: "Knight",
      recruitmentCount: 1,
    });

    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.holyOrderRecruitment)
    );
  });

  it("does not break the arcane-circle challenge when recruiting Sorcerers, Shamans or Warlocks", () => {
    for (const warriorClass of ["Sorcerer", "Shaman", "Warlock"] as const) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), {
        type: "player_recruited",
        warriorClass,
        recruitmentCount: 1,
      });

      assert.equal(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.arcaneCircleRecruitment),
        false
      );
    }
  });

  it("breaks the arcane-circle challenge when recruiting other classes", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), {
      type: "player_recruited",
      warriorClass: "Priestess",
      recruitmentCount: 1,
    });

    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.arcaneCircleRecruitment)
    );
  });
});
