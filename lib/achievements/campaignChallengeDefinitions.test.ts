import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CAMPAIGN_CHALLENGE_KEY,
} from "./campaignChallengeKeys";
import {
  getNewlyBrokenCampaignChallenges,
  type CampaignChallengeEvent,
} from "./campaignChallengeDefinitions";
import type { WarriorClass } from "../warriors/warriorPictureVariants";

function recruitmentEvent(
  warriorClass: WarriorClass,
  recruitmentCount: number,
  gender: CampaignChallengeEvent["gender"] = "Male",
  picture = 1
): CampaignChallengeEvent {
  return {
    type: "player_recruited",
    warriorClass,
    gender,
    picture,
    recruitmentCount,
  };
}

const CLASS_RESTRICTION_CHALLENGES = [
  CAMPAIGN_CHALLENGE_KEY.holyOrderRecruitment,
  CAMPAIGN_CHALLENGE_KEY.arcaneCircleRecruitment,
] as const;

const RACE_ONLY_CHALLENGES = [
  CAMPAIGN_CHALLENGE_KEY.humanOnlyRecruitment,
  CAMPAIGN_CHALLENGE_KEY.elfOnlyRecruitment,
  CAMPAIGN_CHALLENGE_KEY.dwarfOnlyRecruitment,
  CAMPAIGN_CHALLENGE_KEY.orcOnlyRecruitment,
] as const;

/** Non-race restriction tests ignore race-only challenges by pre-breaking them. */
const NON_RACE_CHALLENGE_NOISE = [
  ...RACE_ONLY_CHALLENGES,
] as const;

describe("getNewlyBrokenCampaignChallenges", () => {
  it("does not break the peasants-only challenge when recruiting a Peasant", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set(),
      recruitmentEvent("Peasant", 1)
    );

    assert.equal(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment),
      false
    );
  });

  it("breaks the peasants-only challenge when recruiting a non-Peasant", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set(),
      recruitmentEvent("Ranger", 1, "Male", 5)
    );

    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment)
    );
  });

  it("does not report an already broken challenge again", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set([
        CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment,
        ...CLASS_RESTRICTION_CHALLENGES,
        ...NON_RACE_CHALLENGE_NOISE,
      ]),
      recruitmentEvent("Ranger", 1, "Male", 5)
    );

    assert.deepEqual(newlyBroken, []);
  });

  it("allows recruitments until each challenge's limit is exceeded", () => {
    const classRestrictionsBroken = new Set([
      ...CLASS_RESTRICTION_CHALLENGES,
      ...NON_RACE_CHALLENGE_NOISE,
    ]);

    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(
        classRestrictionsBroken,
        recruitmentEvent("Peasant", 1)
      ),
      []
    );

    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(
        classRestrictionsBroken,
        recruitmentEvent("Peasant", 2)
      ),
      [CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment]
    );

    assert.deepEqual(
      getNewlyBrokenCampaignChallenges(
        new Set([
          ...classRestrictionsBroken,
          CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment,
        ]),
        recruitmentEvent("Peasant", 3)
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
        recruitmentEvent("Peasant", 4)
      ),
      [CAMPAIGN_CHALLENGE_KEY.maxThreeRecruitments]
    );
  });

  it("breaks all recruitment-count challenges on the fourth recruitment from a clean state", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set(),
      recruitmentEvent("Peasant", 4)
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
        ...NON_RACE_CHALLENGE_NOISE,
      ]),
      recruitmentEvent("Peasant", 5)
    );

    assert.deepEqual(brokenAfterFourth, []);
  });

  it("does not break the holy-order challenge when recruiting Priestesses or Paladins", () => {
    for (const warriorClass of ["Priestess", "Paladin"] as const) {
      const gender = warriorClass === "Priestess" ? "Female" : "Male";
      const newlyBroken = getNewlyBrokenCampaignChallenges(
        new Set(),
        recruitmentEvent(warriorClass, 1, gender, 1)
      );

      assert.equal(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.holyOrderRecruitment),
        false
      );
    }
  });

  it("breaks the holy-order challenge when recruiting other classes", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set(),
      recruitmentEvent("Knight", 1)
    );

    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.holyOrderRecruitment)
    );
  });

  it("does not break the arcane-circle challenge when recruiting Sorcerers, Shamans or Warlocks", () => {
    for (const warriorClass of ["Sorcerer", "Shaman", "Warlock"] as const) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(
        new Set(),
        recruitmentEvent(warriorClass, 1)
      );

      assert.equal(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.arcaneCircleRecruitment),
        false
      );
    }
  });

  it("breaks the arcane-circle challenge when recruiting other classes", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set(),
      recruitmentEvent("Priestess", 1, "Female", 1)
    );

    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.arcaneCircleRecruitment)
    );
  });
});

describe("race-only recruitment challenges", () => {
  it("does not break human-only when recruiting Human portrait variants", () => {
    const humanRecruits = [
      recruitmentEvent("Knight", 1, "Male", 1),
      recruitmentEvent("Paladin", 2, "Male", 1),
      recruitmentEvent("Peasant", 3, "Male", 1),
      recruitmentEvent("Charger", 4, "Male", 9),
      recruitmentEvent("Shaman", 5, "Male", 4),
    ] as const;

    const brokenKeys = new Set<
      (typeof CAMPAIGN_CHALLENGE_KEY)[keyof typeof CAMPAIGN_CHALLENGE_KEY]
    >();

    for (const event of humanRecruits) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(brokenKeys, event);
      assert.equal(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.humanOnlyRecruitment),
        false
      );
      for (const key of newlyBroken) {
        brokenKeys.add(key);
      }
    }
  });

  it("breaks human-only when recruiting non-Human portrait variants", () => {
    const nonHumanRecruits = [
      recruitmentEvent("Ranger", 1, "Male", 5),
      recruitmentEvent("Moonblade", 1, "Male", 3),
      recruitmentEvent("Charger", 1, "Male", 10),
      recruitmentEvent("King", 1, "Male", 8),
      recruitmentEvent("Peasant", 1, "Male", 21),
    ] as const;

    for (const event of nonHumanRecruits) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), event);
      assert.ok(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.humanOnlyRecruitment),
        `expected human-only to break for ${event.warriorClass} ${event.gender} picture ${event.picture}`
      );
    }
  });

  it("does not break elf-only when recruiting Elf portrait variants", () => {
    const elfRecruits = [
      recruitmentEvent("Ranger", 1, "Male", 5),
      recruitmentEvent("Moonblade", 2, "Male", 3),
      recruitmentEvent("Knight", 3, "Male", 11),
    ] as const;

    const brokenKeys = new Set<
      (typeof CAMPAIGN_CHALLENGE_KEY)[keyof typeof CAMPAIGN_CHALLENGE_KEY]
    >();

    for (const event of elfRecruits) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(brokenKeys, event);
      assert.equal(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.elfOnlyRecruitment),
        false
      );
      for (const key of newlyBroken) {
        brokenKeys.add(key);
      }
    }
  });

  it("breaks elf-only when recruiting non-Elf portrait variants", () => {
    const nonElfRecruits = [
      recruitmentEvent("Knight", 1, "Male", 1),
      recruitmentEvent("Paladin", 1, "Male", 1),
      recruitmentEvent("Charger", 1, "Male", 10),
    ] as const;

    for (const event of nonElfRecruits) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), event);
      assert.ok(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.elfOnlyRecruitment),
        `expected elf-only to break for ${event.warriorClass} picture ${event.picture}`
      );
    }
  });

  it("does not break dwarf-only when recruiting Dwarf portrait variants", () => {
    const dwarfRecruits = [
      recruitmentEvent("King", 1, "Male", 8),
      recruitmentEvent("Marksman", 2, "Male", 10),
      recruitmentEvent("Peasant", 3, "Male", 21),
    ] as const;

    const brokenKeys = new Set<
      (typeof CAMPAIGN_CHALLENGE_KEY)[keyof typeof CAMPAIGN_CHALLENGE_KEY]
    >();

    for (const event of dwarfRecruits) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(brokenKeys, event);
      assert.equal(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.dwarfOnlyRecruitment),
        false
      );
      for (const key of newlyBroken) {
        brokenKeys.add(key);
      }
    }
  });

  it("breaks dwarf-only when recruiting non-Dwarf portrait variants", () => {
    const nonDwarfRecruits = [
      recruitmentEvent("Knight", 1, "Male", 1),
      recruitmentEvent("Ranger", 1, "Male", 5),
      recruitmentEvent("Charger", 1, "Male", 10),
    ] as const;

    for (const event of nonDwarfRecruits) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), event);
      assert.ok(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.dwarfOnlyRecruitment),
        `expected dwarf-only to break for ${event.warriorClass} picture ${event.picture}`
      );
    }
  });

  it("does not break orc-only when recruiting Orc portrait variants", () => {
    const orcRecruits = [
      recruitmentEvent("Charger", 1, "Male", 10),
      recruitmentEvent("Berserker", 2, "Male", 5),
      recruitmentEvent("Shaman", 3, "Male", 5),
    ] as const;

    const brokenKeys = new Set<
      (typeof CAMPAIGN_CHALLENGE_KEY)[keyof typeof CAMPAIGN_CHALLENGE_KEY]
    >();

    for (const event of orcRecruits) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(brokenKeys, event);
      assert.equal(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.orcOnlyRecruitment),
        false
      );
      for (const key of newlyBroken) {
        brokenKeys.add(key);
      }
    }
  });

  it("breaks orc-only when recruiting non-Orc portrait variants", () => {
    const nonOrcRecruits = [
      recruitmentEvent("Knight", 1, "Male", 1),
      recruitmentEvent("Ranger", 1, "Male", 5),
      recruitmentEvent("King", 1, "Male", 8),
    ] as const;

    for (const event of nonOrcRecruits) {
      const newlyBroken = getNewlyBrokenCampaignChallenges(new Set(), event);
      assert.ok(
        newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.orcOnlyRecruitment),
        `expected orc-only to break for ${event.warriorClass} picture ${event.picture}`
      );
    }
  });

  it("breaks all other race-only challenges when a mixed-race recruit is added", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set(),
      recruitmentEvent("Knight", 1, "Male", 11)
    );

    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.humanOnlyRecruitment)
    );
    assert.equal(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.elfOnlyRecruitment),
      false
    );
    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.dwarfOnlyRecruitment)
    );
    assert.ok(
      newlyBroken.includes(CAMPAIGN_CHALLENGE_KEY.orcOnlyRecruitment)
    );
  });

  it("does not report already broken race-only challenges again", () => {
    const newlyBroken = getNewlyBrokenCampaignChallenges(
      new Set([
        CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment,
        ...CLASS_RESTRICTION_CHALLENGES,
        ...RACE_ONLY_CHALLENGES,
      ]),
      recruitmentEvent("Ranger", 1, "Male", 5)
    );

    assert.deepEqual(newlyBroken, []);
  });

  it("evaluates race from picture index, not class alone", () => {
    const humanKnight = getNewlyBrokenCampaignChallenges(
      new Set(),
      recruitmentEvent("Knight", 1, "Male", 1)
    );
    const elfKnight = getNewlyBrokenCampaignChallenges(
      new Set(),
      recruitmentEvent("Knight", 1, "Male", 11)
    );

    assert.equal(
      humanKnight.includes(CAMPAIGN_CHALLENGE_KEY.humanOnlyRecruitment),
      false
    );
    assert.equal(
      humanKnight.includes(CAMPAIGN_CHALLENGE_KEY.elfOnlyRecruitment),
      true
    );
    assert.equal(
      elfKnight.includes(CAMPAIGN_CHALLENGE_KEY.humanOnlyRecruitment),
      true
    );
    assert.equal(
      elfKnight.includes(CAMPAIGN_CHALLENGE_KEY.elfOnlyRecruitment),
      false
    );
  });
});
