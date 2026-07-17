import { ACHIEVEMENT_ID, type AchievementId } from "./achievementIds";
import {
  CAMPAIGN_CHALLENGE_KEY,
  type CampaignChallengeKey,
} from "./campaignChallengeKeys";
import { STAT_KEY, type StatKey } from "./statKeys";
import type { WarriorClass } from "../warriors/warriorPictureVariants";

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

/** Warrior class that must be recruited for the ghost warrior achievement. */
export const GHOST_WARRIOR_REQUIRED_CLASS: WarriorClass = "Infiltrator";

export type AchievementTrigger =
  | "campaign_won"
  | "warrior_recruited"
  | "battle_ended";

/** Minimum total enemy damage from one player action for action-damage achievements. */
export const ACTION_DAMAGE_10_THRESHOLD = 10;
export const ACTION_DAMAGE_15_THRESHOLD = 15;
export const ACTION_DAMAGE_20_THRESHOLD = 20;
export const ACTION_DAMAGE_25_THRESHOLD = 25;

export const ACTION_HEALING_10_THRESHOLD = 10;
export const ACTION_HEALING_15_THRESHOLD = 15;
export const ACTION_HEALING_20_THRESHOLD = 20;

export type AchievementCategory = "starter" | "challenge" | "exploration";

export type AchievementTiers = "easy" | "medium" | "hard";

export const ACHIEVEMENT_TIERS: AchievementTiers[] = ["easy", "medium", "hard"];

/** Display order for category subgroups within a difficulty tier. */
export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  "starter",
  "challenge",
  "exploration",
];

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> =
  {
    starter: "Starter",
    challenge: "Challenge",
    exploration: "Exploration",
  };

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTiers;
  isSecret: boolean;
  trigger: AchievementTrigger;
  counterStatKey?: StatKey;
  targetCount?: number;
  campaignChallengeKey?: CampaignChallengeKey;
  requiredLeaguePoints?: number;
  minTreasuryGold?: number;
  minDistinctRecruitedWarriorClasses?: number;
  requiredWarriorNameContains?: string;
  requiredRecruitedWarriorClass?: WarriorClass;
  requiresShiningWarrior?: boolean;
  minSpellPurchases?: number;
  minActionDamage?: number;
  minActionHealing?: number;
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
  {
    id: ACHIEVEMENT_ID.ghostWarriorRecruit,
    title: "Ghost warrior",
    description: "Recruit an Infiltrator.",
    category: "exploration",
    tier: "easy",
    isSecret: false,
    trigger: "warrior_recruited",
    requiredRecruitedWarriorClass: GHOST_WARRIOR_REQUIRED_CLASS,
  },
  {
    id: ACHIEVEMENT_ID.shiningWarriorRecruit,
    title: "Shining warrior",
    description: "Recruit a shining warrior.",
    category: "exploration",
    tier: "medium",
    isSecret: false,
    trigger: "warrior_recruited",
    requiresShiningWarrior: true,
  },
  {
    id: ACHIEVEMENT_ID.humanOnlyCampaignWin,
    title: "Human alliance",
    description: "Win a campaign only using Human warriors.",
    category: "exploration",
    tier: "easy",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.humanOnlyRecruitment,
  },
  {
    id: ACHIEVEMENT_ID.elfOnlyCampaignWin,
    title: "Elven might",
    description: "Win a campaign only using Elf warriors.",
    category: "exploration",
    tier: "easy",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.elfOnlyRecruitment,
  },
  {
    id: ACHIEVEMENT_ID.dwarfOnlyCampaignWin,
    title: "Dwarven ingenuity",
    description: "Win a campaign only using Dwarf warriors.",
    category: "exploration",
    tier: "easy",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.dwarfOnlyRecruitment,
  },
  {
    id: ACHIEVEMENT_ID.orcOnlyCampaignWin,
    title: "Orcish warband",
    description: "Win a campaign only using Orc warriors.",
    category: "exploration",
    tier: "easy",
    isSecret: false,
    trigger: "campaign_won",
    campaignChallengeKey: CAMPAIGN_CHALLENGE_KEY.orcOnlyRecruitment,
  },
  {
    id: ACHIEVEMENT_ID.actionDamage10,
    title: "Heavy blow",
    description: "Deal 10 or more damage with one action in battle.",
    category: "challenge",
    tier: "easy",
    isSecret: false,
    trigger: "battle_ended",
    minActionDamage: ACTION_DAMAGE_10_THRESHOLD,
  },
  {
    id: ACHIEVEMENT_ID.actionDamage15,
    title: "Crushing strike",
    description: "Deal 15 or more damage with one action in battle.",
    category: "challenge",
    tier: "medium",
    isSecret: false,
    trigger: "battle_ended",
    minActionDamage: ACTION_DAMAGE_15_THRESHOLD,
  },
  {
    id: ACHIEVEMENT_ID.actionDamage20,
    title: "Devastating assault",
    description: "Deal 20 or more damage with one action in battle.",
    category: "challenge",
    tier: "medium",
    isSecret: false,
    trigger: "battle_ended",
    minActionDamage: ACTION_DAMAGE_20_THRESHOLD,
  },
  {
    id: ACHIEVEMENT_ID.actionDamage25,
    title: "Annihilation",
    description: "Deal 25 or more damage with one action in battle.",
    category: "challenge",
    tier: "hard",
    isSecret: false,
    trigger: "battle_ended",
    minActionDamage: ACTION_DAMAGE_25_THRESHOLD,
  },
  {
    id: ACHIEVEMENT_ID.actionHealing10,
    title: "Mending touch",
    description: "Heal 10 or more health with one action in battle.",
    category: "challenge",
    tier: "easy",
    isSecret: false,
    trigger: "battle_ended",
    minActionHealing: ACTION_HEALING_10_THRESHOLD,
  },
  {
    id: ACHIEVEMENT_ID.actionHealing15,
    title: "Blessed hands",
    description: "Heal 15 or more health with one action in battle.",
    category: "challenge",
    tier: "medium",
    isSecret: false,
    trigger: "battle_ended",
    minActionHealing: ACTION_HEALING_15_THRESHOLD,
  },
  {
    id: ACHIEVEMENT_ID.actionHealing20,
    title: "Divine restoration",
    description: "Heal 20 or more health with one action in battle.",
    category: "challenge",
    tier: "hard",
    isSecret: false,
    trigger: "battle_ended",
    minActionHealing: ACTION_HEALING_20_THRESHOLD,
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

export const WARRIOR_RECRUITED_ACHIEVEMENT_DEFINITIONS =
  ACHIEVEMENT_DEFINITIONS.filter(
    (definition) => definition.trigger === "warrior_recruited"
  );

export const BATTLE_ENDED_ACHIEVEMENT_DEFINITIONS =
  ACHIEVEMENT_DEFINITIONS.filter(
    (definition) => definition.trigger === "battle_ended"
  );
