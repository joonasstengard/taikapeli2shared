import { ACHIEVEMENT_ID, type AchievementId } from "./achievementIds";
import {
  CAMPAIGN_CHALLENGE_KEY,
  type CampaignChallengeKey,
} from "./campaignChallengeKeys";
import { STAT_KEY, type StatKey } from "./statKeys";

/** Starting nation health; undefeated runs must finish with this amount. */
export const UNDEFEATED_CAMPAIGN_LEAGUE_POINTS = 100;

/** Minimum unspent treasury gold required for the gold saver achievement. */
export const GOLD_SAVER_MIN_TREASURY = 50;

/** Minimum unspent treasury gold required for the gold hoarder achievement. */
export const GOLD_HOARDER_MIN_TREASURY = 100;

/** Distinct warrior classes required for the diverse company achievement. */
export const DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES = 5;

/** Substring matched case-sensitively against warrior names at campaign win. */
export const ISMO_WARRIOR_NAME_SUBSTRING = "Ismo";

/** Minimum spell market purchases required for the arcane mysteries achievement. */
export const ARCANE_MYSTERIES_MIN_SPELL_PURCHASES = 3;

export type AchievementTrigger = "campaign_won";

export type AchievementCategory = "starter" | "challenge" | "exploration";

export type AchievementTier = "easy" | "medium" | "hard";

export const ACHIEVEMENT_TIERS: AchievementTier[] = ["easy", "medium", "hard"];

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  isSecret: boolean;
  trigger: AchievementTrigger;
  counterStatKey?: StatKey;
  targetCount?: number;
  campaignChallengeKey?: CampaignChallengeKey;
  requiredLeaguePoints?: number;
  minTreasuryGold?: number;
  minDistinctRecruitedWarriorClasses?: number;
  requiredWarriorNameContains?: string;
  minSpellPurchases?: number;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: ACHIEVEMENT_ID.firstCampaignWin,
    title: "Tournament victor",
    description: "Win your first campaign.",
    category: "starter",
    tier: "easy",
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
    tier: "easy",
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
    tier: "hard",
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
    tier: "hard",
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
    tier: "medium",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.maxThreeRecruitments,
  },
  {
    id: ACHIEVEMENT_ID.maxTwoWarriorsCampaignWin,
    title: "Tight unit",
    description: "Win a campaign using two warriors or less.",
    category: "challenge",
    tier: "hard",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.maxTwoRecruitments,
  },
  {
    id: ACHIEVEMENT_ID.maxOneWarriorCampaignWin,
    title: "Lone champion",
    description: "Win a campaign using only one warrior.",
    category: "challenge",
    tier: "hard",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.maxOneRecruitment,
  },
  {
    id: ACHIEVEMENT_ID.peasantsOnlyCampaignWin,
    title: "Peasant uprising",
    description: "Win a campaign with only Peasants.",
    category: "challenge",
    tier: "hard",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.peasantsOnlyRecruitment,
  },
  {
    id: ACHIEVEMENT_ID.undefeatedCampaignWin,
    title: "Undefeated",
    description: "Win a campaign without losing a single battle.",
    category: "challenge",
    tier: "medium",
    isSecret: false,
    trigger: "campaign_won",
    requiredLeaguePoints: UNDEFEATED_CAMPAIGN_LEAGUE_POINTS,
  },
  {
    id: ACHIEVEMENT_ID.goldSaverCampaignWin,
    title: "Gold saver",
    description: "Win a campaign with 50+ unspent gold.",
    category: "challenge",
    tier: "medium",
    isSecret: false,
    trigger: "campaign_won",
    minTreasuryGold: GOLD_SAVER_MIN_TREASURY,
  },
  {
    id: ACHIEVEMENT_ID.goldHoarderCampaignWin,
    title: "Gold hoarder",
    description: "Win a campaign with 100+ unspent gold.",
    category: "challenge",
    tier: "hard",
    isSecret: false,
    trigger: "campaign_won",
    minTreasuryGold: GOLD_HOARDER_MIN_TREASURY,
  },
  {
    id: ACHIEVEMENT_ID.arcaneCircleCampaignWin,
    title: "Arcane circle",
    description: "Win a campaign only using Sorcerers, Shamans and Warlocks.",
    category: "exploration",
    tier: "easy",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.arcaneCircleRecruitment,
  },
  {
    id: ACHIEVEMENT_ID.holyOrderCampaignWin,
    title: "Holy order",
    description: "Win a campaign only using Priestesses and Paladins.",
    category: "exploration",
    tier: "easy",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.holyOrderRecruitment,
  },
  {
    id: ACHIEVEMENT_ID.diverseCompanyCampaignWin,
    title: "Diverse company",
    description: "Win a campaign with warriors from 5 different classes.",
    category: "exploration",
    tier: "easy",
    isSecret: false,
    trigger: "campaign_won",
    minDistinctRecruitedWarriorClasses:
      DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES,
  },
  {
    id: ACHIEVEMENT_ID.ismoCampaignWin,
    title: "Legends of Ismo",
    description: "Win a campaign with a warrior whose name contains 'Ismo'.",
    category: "exploration",
    tier: "medium",
    isSecret: false,
    trigger: "campaign_won",
    requiredWarriorNameContains: ISMO_WARRIOR_NAME_SUBSTRING,
  },
  {
    id: ACHIEVEMENT_ID.arcaneMysteriesCampaignWin,
    title: "Arcane mysteries",
    description:
      "Win a campaign after buying 3 or more spells from the market.",
    category: "exploration",
    tier: "easy",
    isSecret: false,
    trigger: "campaign_won",
    minSpellPurchases: ARCANE_MYSTERIES_MIN_SPELL_PURCHASES,
  },
];

export const ACHIEVEMENT_DEFINITIONS_BY_ID: Record<
  AchievementId,
  AchievementDefinition
> = ACHIEVEMENT_DEFINITIONS.reduce(
  (map, definition) => {
    map[definition.id] = definition;
    return map;
  },
  {} as Record<AchievementId, AchievementDefinition>
);

export const CAMPAIGN_END_ACHIEVEMENT_DEFINITIONS =
  ACHIEVEMENT_DEFINITIONS.filter(
    (definition) => definition.trigger === "campaign_won"
  );
