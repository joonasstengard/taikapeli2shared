import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ACHIEVEMENT_ID } from "./achievementIds";
import {
  ACHIEVEMENT_DEFINITIONS,
  ACHIEVEMENT_DEFINITIONS_BY_ID,
  ACHIEVEMENT_TIERS,
  CAMPAIGN_END_ACHIEVEMENT_DEFINITIONS,
  ISMO_WARRIOR_NAME_SUBSTRING,
  ARCANE_MYSTERIES_MIN_SPELL_PURCHASES,
  GHOST_WARRIOR_REQUIRED_CLASS,
} from "./achievementDefinitions";
import { CAMPAIGN_CHALLENGE_KEY } from "./campaignChallengeKeys";

describe("achievement definitions", () => {
  it("uses unique achievement ids", () => {
    const ids = ACHIEVEMENT_DEFINITIONS.map((definition) => definition.id);
    assert.equal(ids.length, new Set(ids).size);
  });

  it("maps every definition by id", () => {
    for (const definition of ACHIEVEMENT_DEFINITIONS) {
      assert.equal(ACHIEVEMENT_DEFINITIONS_BY_ID[definition.id], definition);
    }
  });

  it("includes every campaign-end definition in the campaign-end list", () => {
    const campaignEndIds = new Set(
      CAMPAIGN_END_ACHIEVEMENT_DEFINITIONS.map((definition) => definition.id)
    );

    for (const definition of ACHIEVEMENT_DEFINITIONS) {
      if (definition.trigger === "campaign_won") {
        assert.ok(campaignEndIds.has(definition.id));
      }
    }
  });
});

describe("legends of ismo achievement definition", () => {
  const ismoDefinition = ACHIEVEMENT_DEFINITIONS_BY_ID[ACHIEVEMENT_ID.ismoCampaignWin];

  it("is registered with the expected metadata", () => {
    assert.equal(ismoDefinition.title, "Legends of Ismo");
    assert.equal(
      ismoDefinition.description,
      "Win a campaign with a warrior whose name contains 'Ismo'."
    );
    assert.equal(ismoDefinition.category, "exploration");
    assert.equal(ismoDefinition.tier, "medium");
    assert.equal(ismoDefinition.isSecret, false);
    assert.equal(ismoDefinition.trigger, "campaign_won");
  });

  it("uses the shared Ismo substring constant", () => {
    assert.equal(
      ismoDefinition.requiredWarriorNameContains,
      ISMO_WARRIOR_NAME_SUBSTRING
    );
    assert.equal(ismoDefinition.requiredWarriorNameContains, "Ismo");
  });

  it("does not rely on counter stats or unrelated challenge keys", () => {
    assert.equal(ismoDefinition.counterStatKey, undefined);
    assert.equal(ismoDefinition.targetCount, undefined);
    assert.equal(ismoDefinition.campaignChallengeKey, undefined);
    assert.equal(ismoDefinition.requiredLeaguePoints, undefined);
    assert.equal(ismoDefinition.minTreasuryGold, undefined);
    assert.equal(ismoDefinition.minDistinctRecruitedWarriorClasses, undefined);
  });

  it("uses a valid tier label", () => {
    assert.ok(ACHIEVEMENT_TIERS.includes(ismoDefinition.tier));
  });
});

describe("arcane mysteries achievement definition", () => {
  const arcaneMysteriesDefinition =
    ACHIEVEMENT_DEFINITIONS_BY_ID[ACHIEVEMENT_ID.arcaneMysteriesCampaignWin];

  it("is registered with the expected metadata", () => {
    assert.equal(arcaneMysteriesDefinition.title, "Arcane mysteries");
    assert.equal(
      arcaneMysteriesDefinition.description,
      "Win a campaign after buying 3 or more spells from the market."
    );
    assert.equal(arcaneMysteriesDefinition.category, "exploration");
    assert.equal(arcaneMysteriesDefinition.tier, "easy");
    assert.equal(arcaneMysteriesDefinition.isSecret, false);
    assert.equal(arcaneMysteriesDefinition.trigger, "campaign_won");
  });

  it("uses the shared spell purchase threshold constant", () => {
    assert.equal(
      arcaneMysteriesDefinition.minSpellPurchases,
      ARCANE_MYSTERIES_MIN_SPELL_PURCHASES
    );
    assert.equal(arcaneMysteriesDefinition.minSpellPurchases, 3);
  });

  it("does not rely on counter stats, challenge keys, or unrelated win conditions", () => {
    assert.equal(arcaneMysteriesDefinition.counterStatKey, undefined);
    assert.equal(arcaneMysteriesDefinition.targetCount, undefined);
    assert.equal(arcaneMysteriesDefinition.campaignChallengeKey, undefined);
    assert.equal(arcaneMysteriesDefinition.requiredLeaguePoints, undefined);
    assert.equal(arcaneMysteriesDefinition.minTreasuryGold, undefined);
    assert.equal(
      arcaneMysteriesDefinition.minDistinctRecruitedWarriorClasses,
      undefined
    );
    assert.equal(
      arcaneMysteriesDefinition.requiredWarriorNameContains,
      undefined
    );
  });

  it("never exposes progress tracking fields", () => {
    assert.equal(arcaneMysteriesDefinition.counterStatKey, undefined);
    assert.equal(arcaneMysteriesDefinition.targetCount, undefined);
  });

  it("uses a valid tier label", () => {
    assert.ok(ACHIEVEMENT_TIERS.includes(arcaneMysteriesDefinition.tier));
  });
});

describe("ghost warrior achievement definition", () => {
  const ghostWarriorDefinition =
    ACHIEVEMENT_DEFINITIONS_BY_ID[ACHIEVEMENT_ID.ghostWarriorCampaignWin];

  it("is registered with the expected metadata", () => {
    assert.equal(ghostWarriorDefinition.title, "Ghost warrior");
    assert.equal(
      ghostWarriorDefinition.description,
      "Win a campaign with an Infiltrator in your army."
    );
    assert.equal(ghostWarriorDefinition.category, "exploration");
    assert.equal(ghostWarriorDefinition.tier, "medium");
    assert.equal(ghostWarriorDefinition.isSecret, false);
    assert.equal(ghostWarriorDefinition.trigger, "campaign_won");
  });

  it("uses the shared Infiltrator class constant", () => {
    assert.equal(
      ghostWarriorDefinition.requiredWarriorClassInArmy,
      GHOST_WARRIOR_REQUIRED_CLASS
    );
    assert.equal(ghostWarriorDefinition.requiredWarriorClassInArmy, "Infiltrator");
  });

  it("does not rely on counter stats or unrelated win conditions", () => {
    assert.equal(ghostWarriorDefinition.counterStatKey, undefined);
    assert.equal(ghostWarriorDefinition.targetCount, undefined);
    assert.equal(ghostWarriorDefinition.campaignChallengeKey, undefined);
    assert.equal(ghostWarriorDefinition.requiredLeaguePoints, undefined);
    assert.equal(ghostWarriorDefinition.minTreasuryGold, undefined);
    assert.equal(
      ghostWarriorDefinition.minDistinctRecruitedWarriorClasses,
      undefined
    );
    assert.equal(ghostWarriorDefinition.requiredWarriorNameContains, undefined);
    assert.equal(ghostWarriorDefinition.minSpellPurchases, undefined);
  });

  it("uses a valid tier label", () => {
    assert.ok(ACHIEVEMENT_TIERS.includes(ghostWarriorDefinition.tier));
  });
});

const RACE_ONLY_ACHIEVEMENT_CASES = [
  {
    idKey: "humanOnlyCampaignWin" as const,
    title: "Human alliance",
    description: "Win a campaign only using Human warriors.",
    challengeKey: "humanOnlyRecruitment" as const,
  },
  {
    idKey: "elfOnlyCampaignWin" as const,
    title: "Elven might",
    description: "Win a campaign only using Elf warriors.",
    challengeKey: "elfOnlyRecruitment" as const,
  },
  {
    idKey: "dwarfOnlyCampaignWin" as const,
    title: "Dwarven ingenuity",
    description: "Win a campaign only using Dwarf warriors.",
    challengeKey: "dwarfOnlyRecruitment" as const,
  },
  {
    idKey: "orcOnlyCampaignWin" as const,
    title: "Orcish warband",
    description: "Win a campaign only using Orc warriors.",
    challengeKey: "orcOnlyRecruitment" as const,
  },
] as const;

describe("race-only campaign win achievement definitions", () => {
  for (const achievementCase of RACE_ONLY_ACHIEVEMENT_CASES) {
    describe(achievementCase.title, () => {
      const definition =
        ACHIEVEMENT_DEFINITIONS_BY_ID[ACHIEVEMENT_ID[achievementCase.idKey]];

      it("is registered with the expected metadata", () => {
        assert.equal(definition.title, achievementCase.title);
        assert.equal(definition.description, achievementCase.description);
        assert.equal(definition.category, "exploration");
        assert.equal(definition.tier, "easy");
        assert.equal(definition.isSecret, false);
        assert.equal(definition.trigger, "campaign_won");
      });

      it("uses the expected recruitment challenge key", () => {
        assert.equal(
          definition.campaignChallengeKey,
          CAMPAIGN_CHALLENGE_KEY[achievementCase.challengeKey]
        );
      });

      it("does not rely on counter stats or unrelated win conditions", () => {
        assert.equal(definition.counterStatKey, undefined);
        assert.equal(definition.targetCount, undefined);
        assert.equal(definition.requiredLeaguePoints, undefined);
        assert.equal(definition.minTreasuryGold, undefined);
        assert.equal(
          definition.minDistinctRecruitedWarriorClasses,
          undefined
        );
        assert.equal(definition.requiredWarriorNameContains, undefined);
        assert.equal(definition.requiredWarriorClassInArmy, undefined);
        assert.equal(definition.minSpellPurchases, undefined);
      });

      it("uses a valid tier label", () => {
        assert.ok(ACHIEVEMENT_TIERS.includes(definition.tier));
      });
    });
  }
});
