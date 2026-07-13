import type {
  WarriorClass,
  WarriorGender,
} from "../warriors/warriorPictureVariants";
import {
  getWarriorRace,
  type WarriorRace,
} from "../warriors/warriorRaces";
import {
  CAMPAIGN_CHALLENGE_KEY,
  type CampaignChallengeKey,
} from "./campaignChallengeKeys";

export type CampaignChallengeEvent = {
  type: "player_recruited";
  warriorClass: WarriorClass;
  gender: WarriorGender;
  picture: number;
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

function isRecruitmentOutsideAllowedClasses(
  event: CampaignChallengeEvent,
  allowedClasses: ReadonlySet<WarriorClass>
): boolean {
  return (
    event.type === "player_recruited" &&
    !allowedClasses.has(event.warriorClass)
  );
}

function isRecruitmentOutsideAllowedRace(
  event: CampaignChallengeEvent,
  allowedRace: WarriorRace
): boolean {
  return (
    event.type === "player_recruited" &&
    getWarriorRace(event.warriorClass, event.gender, event.picture) !==
      allowedRace
  );
}

const HOLY_ORDER_CLASSES = new Set<WarriorClass>(["Priestess", "Paladin"]);
const ARCANE_CIRCLE_CLASSES = new Set<WarriorClass>([
  "Sorcerer",
  "Shaman",
  "Warlock",
]);

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
  {
    key: CAMPAIGN_CHALLENGE_KEY.holyOrderRecruitment,
    isBrokenBy: (event) =>
      isRecruitmentOutsideAllowedClasses(event, HOLY_ORDER_CLASSES),
  },
  {
    key: CAMPAIGN_CHALLENGE_KEY.arcaneCircleRecruitment,
    isBrokenBy: (event) =>
      isRecruitmentOutsideAllowedClasses(event, ARCANE_CIRCLE_CLASSES),
  },
  {
    key: CAMPAIGN_CHALLENGE_KEY.humanOnlyRecruitment,
    isBrokenBy: (event) => isRecruitmentOutsideAllowedRace(event, "Human"),
  },
  {
    key: CAMPAIGN_CHALLENGE_KEY.elfOnlyRecruitment,
    isBrokenBy: (event) => isRecruitmentOutsideAllowedRace(event, "Elf"),
  },
  {
    key: CAMPAIGN_CHALLENGE_KEY.dwarfOnlyRecruitment,
    isBrokenBy: (event) => isRecruitmentOutsideAllowedRace(event, "Dwarf"),
  },
  {
    key: CAMPAIGN_CHALLENGE_KEY.orcOnlyRecruitment,
    isBrokenBy: (event) => isRecruitmentOutsideAllowedRace(event, "Orc"),
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
