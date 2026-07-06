import { ACHIEVEMENT_ID, type AchievementId } from "./achievementIds";
import {
  CAMPAIGN_CHALLENGE_KEY,
  type CampaignChallengeKey,
} from "./campaignChallengeKeys";
import { STAT_KEY, type StatKey } from "./statKeys";

/** Starting nation health; undefeated runs must finish with this amount. */
export const UNDEFEATED_CAMPAIGN_LEAGUE_POINTS = 100;

/** Minimum unspent treasury gold required for the gold hoarder achievement. */
export const GOLD_HOARDER_MIN_TREASURY = 100;

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
  requiredLeaguePoints?: number;
  minTreasuryGold?: number;
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
    description: "Win a campaign using three warriors or less.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.maxThreeRecruitments,
  },
  {
    id: ACHIEVEMENT_ID.maxTwoWarriorsCampaignWin,
    title: "Tight unit",
    description: "Win a campaign using two warriors or less.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments,
  },
  {
    id: ACHIEVEMENT_ID.maxOneWarriorCampaignWin,
    title: "Lone champion",
    description: "Win a campaign using only one warrior.",
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
  {
    id: ACHIEVEMENT_ID.undefeatedCampaignWin,
    title: "Undefeated",
    description: "Win a campaign without losing a single battle.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    requiredLeaguePoints: UNDEFEATED_CAMPAIGN_LEAGUE_POINTS,
  },
  {
    id: ACHIEVEMENT_ID.goldHoarderCampaignWin,
    title: "Gold hoarder",
    description: "Win a campaign with 100+ unspent gold.",
    category: "challenge",
    isSecret: false,
    trigger: "campaign_won",
    minTreasuryGold: GOLD_HOARDER_MIN_TREASURY,
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
