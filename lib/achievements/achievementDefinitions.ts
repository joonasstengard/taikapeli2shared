import { ACHIEVEMENT_ID, type AchievementId } from "./achievementIds";
import {
  CAMPAIGN_CHALLENGE_KEY,
  type CampaignChallengeKey,
} from "./campaignChallengeKeys";
import { STAT_KEY, type StatKey } from "./statKeys";

export type AchievementTrigger = "campaign_won";

export type AchievementCategory = "starter" | "challenge" | "exploration";

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  category: AchievementCategory;
  isSecret: boolean;
  trigger: AchievementTrigger;
  counterStatKey?: StatKey;
  targetCount?: number;
  campaignChallengeKey?: CampaignChallengeKey;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: ACHIEVEMENT_ID.firstCampaignWin,
    title: "Tournament victor",
    description: "Win your first campaign.",
    category: "starter",
    isSecret: false,
    trigger: "campaign_won",
    counterStatKey: STAT_KEY.campaignsWon,
    targetCount: 1,
  },
  {
    id: ACHIEVEMENT_ID.tenCampaignWins,
    title: "Tournament veteran",
    description: "Win 10 campaigns.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    counterStatKey: STAT_KEY.campaignsWon,
    targetCount: 10,
  },
  {
    id: ACHIEVEMENT_ID.hundredCampaignWins,
    title: "Tournament elite",
    description: "Win 100 campaigns.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    counterStatKey: STAT_KEY.campaignsWon,
    targetCount: 100,
  },
  {
    id: ACHIEVEMENT_ID.fiveHundredCampaignWins,
    title: "Tournament master",
    description: "Win 500 campaigns.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    counterStatKey: STAT_KEY.campaignsWon,
    targetCount: 500,
  },
  {
    id: ACHIEVEMENT_ID.maxThreeWarriorsCampaignWin,
    title: "Small company",
    description: "Win a campaign with three warriors or less.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.maxThreeRecruitments,
  },
  {
    id: ACHIEVEMENT_ID.maxTwoWarriorsCampaignWin,
    title: "Tight unit",
    description: "Win a campaign with two warriors or less.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments,
  },
  {
    id: ACHIEVEMENT_ID.maxOneWarriorCampaignWin,
    title: "Lone champion",
    description: "Win a campaign with only one warrior.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment,
  },
  {
    id: ACHIEVEMENT_ID.peasantsOnlyCampaignWin,
    title: "Peasant uprising",
    description: "Win a campaign with only Peasants.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment,
  },
];

export const ACHIEVEMENT_DEFINITIONS_BY_ID: Record<
  AchievementId,
  AchievementDefinition
> = Object.fromEntries(
  ACHIEVEMENT_DEFINITIONS.map((definition) => [definition.id, definition])
) as Record<AchievementId, AchievementDefinition>;

export const CAMPAIGN_END_ACHIEVEMENT_DEFINITIONS =
  ACHIEVEMENT_DEFINITIONS.filter(
    (definition) => definition.trigger === "campaign_won"
  );
