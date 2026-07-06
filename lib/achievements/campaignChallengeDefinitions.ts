import type { WarriorClass } from "../warriors/warriorPictureVariants";
import {
  CAMPAIGN_CHALLENGE_KEY,
  type CampaignChallengeKey,
} from "./campaignChallengeKeys";

export type CampaignChallengeEvent = {
  type: "player_recruited";
  warriorClass: WarriorClass;
  recruitmentCount: number;
};

export interface CampaignChallengeDefinition {
  key: CampaignChallengeKey;
  isBrokenBy(event: CampaignChallengeEvent): boolean;
}

function isMaxRecruitmentsBroken(
  event: CampaignChallengeEvent,
  maxRecruitments: number
): boolean {
  return (
    event.type === "player_recruited" &&
    event.recruitmentCount > maxRecruitments
  );
}

export const CAMPAIGN_CHALLENGE_DEFINITIONS: CampaignChallengeDefinition[] = [
  {
    key: CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment,
    isBrokenBy: (event) =>
      event.type === "player_recruited" && event.warriorClass !== "Peasant",
  },
  {
    key: CAMPAIGN_CHALLENGE_KEY.maxThreeRecruitments,
    isBrokenBy: (event) => isMaxRecruitmentsBroken(event, 3),
  },
  {
    key: CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments,
    isBrokenBy: (event) => isMaxRecruitmentsBroken(event, 2),
  },
  {
    key: CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment,
    isBrokenBy: (event) => isMaxRecruitmentsBroken(event, 1),
  },
];

export function getNewlyBrokenCampaignChallenges(
  brokenKeys: ReadonlySet<CampaignChallengeKey>,
  event: CampaignChallengeEvent
): CampaignChallengeKey[] {
  const newlyBroken: CampaignChallengeKey[] = [];

  for (const definition of CAMPAIGN_CHALLENGE_DEFINITIONS) {
    if (brokenKeys.has(definition.key)) {
      continue;
    }

    if (definition.isBrokenBy(event)) {
      newlyBroken.push(definition.key);
    }
  }

  return newlyBroken;
}
