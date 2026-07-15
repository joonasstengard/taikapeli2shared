import { CAMPAIGN_PERK_ID, type CampaignPerkId } from "./campaignPerkIds";
import {
  DURN_KHARAD_DRILL_TRAINING_COST_MULTIPLIER,
  EXPANDED_GRIMOIRE_MARKET_SPELLS_PER_WEEK,
  EXPANDED_GRIMOIRE_MARKET_SPELL_PRICE_MULTIPLIER,
  LIGHT_IN_THE_DARKNESS_RECRUIT_FAITH_BONUS,
  RESILIENT_NATION_HEALTH_LOSS_REDUCTION,
  RUNIC_WISDOM_XP_MULTIPLIER,
  UMBRAL_GRACE_RECRUIT_SPEED_BONUS,
  HEREGELD_WEEKLY_GOLD_BONUS,
  WAR_CHEST_STARTING_GOLD_BONUS,
} from "./campaignPerkConstants";

export type RecruitStatBonusStat = "faith" | "speed";

export type CampaignPerkEffect =
  | { type: "starting_gold"; bonus: number }
  | { type: "weekly_gold"; bonus: number }
  | { type: "market_spell_options"; count: number; priceMultiplier?: number }
  | { type: "warrior_xp_multiplier"; multiplier: number }
  | { type: "nation_health_loss_reduction"; reduction: number }
  | { type: "recruit_stat_bonus"; stat: RecruitStatBonusStat; bonus: number }
  | { type: "training_cost_multiplier"; multiplier: number };

export interface CampaignPerkDefinition {
  id: CampaignPerkId;
  name: string;
  description: string;
  iconFileName: string;
  effect: CampaignPerkEffect;
}

export const CAMPAIGN_PERK_DEFINITIONS: CampaignPerkDefinition[] = [
  {
    id: CAMPAIGN_PERK_ID.warChest,
    name: "War Chest",
    description: "Start the campaign with 20 extra gold.",
    iconFileName: "war_chest.png",
    effect: { type: "starting_gold", bonus: WAR_CHEST_STARTING_GOLD_BONUS },
  },
  {
    id: CAMPAIGN_PERK_ID.runicWisdom,
    name: "Runic Wisdom",
    description: "Warriors earn 10% more experience.",
    iconFileName: "runic_wisdom.png",
    effect: {
      type: "warrior_xp_multiplier",
      multiplier: RUNIC_WISDOM_XP_MULTIPLIER,
    },
  },
  {
    id: CAMPAIGN_PERK_ID.resilientNation,
    name: "Resilient Nation",
    description: "Defeats cost 10 less nation health.",
    iconFileName: "resilient_nation.png",
    effect: {
      type: "nation_health_loss_reduction",
      reduction: RESILIENT_NATION_HEALTH_LOSS_REDUCTION,
    },
  },
  {
    id: CAMPAIGN_PERK_ID.lightInTheDarkness,
    name: "Light In The Darkness",
    description: "Warriors gain +3 Faith when recruited.",
    iconFileName: "light_in_the_darkness.png",
    effect: {
      type: "recruit_stat_bonus",
      stat: "faith",
      bonus: LIGHT_IN_THE_DARKNESS_RECRUIT_FAITH_BONUS,
    },
  },
  {
    id: CAMPAIGN_PERK_ID.umbralGrace,
    name: "Umbral Grace",
    description: "Warriors gain +3 Speed when recruited.",
    iconFileName: "umbral_grace.png",
    effect: {
      type: "recruit_stat_bonus",
      stat: "speed",
      bonus: UMBRAL_GRACE_RECRUIT_SPEED_BONUS,
    },
  },
  {
    id: CAMPAIGN_PERK_ID.heregeld,
    name: "Heregeld",
    description: "Earn 5 extra gold every week.",
    iconFileName: "heregeld.png",
    effect: { type: "weekly_gold", bonus: HEREGELD_WEEKLY_GOLD_BONUS },
  },
  {
    id: CAMPAIGN_PERK_ID.expandedGrimoire,
    name: "Expanded Grimoire",
    description:
      "The weekly spell market offers 8 spells instead of 4, and spells cost 20% less gold.",
    iconFileName: "expanded_grimoire.png",
    effect: {
      type: "market_spell_options",
      count: EXPANDED_GRIMOIRE_MARKET_SPELLS_PER_WEEK,
      priceMultiplier: EXPANDED_GRIMOIRE_MARKET_SPELL_PRICE_MULTIPLIER,
    },
  },
  {
    id: CAMPAIGN_PERK_ID.durnKharadDrill,
    name: "Durn Kharad Drill",
    description: "Warrior training costs 20% less gold.",
    iconFileName: "durn_kharad_drill.png",
    effect: {
      type: "training_cost_multiplier",
      multiplier: DURN_KHARAD_DRILL_TRAINING_COST_MULTIPLIER,
    },
  },
];

export const CAMPAIGN_PERK_DEFINITIONS_BY_ID: Record<
  CampaignPerkId,
  CampaignPerkDefinition
> = CAMPAIGN_PERK_DEFINITIONS.reduce(
  (map, definition) => {
    map[definition.id] = definition;
    return map;
  },
  {} as Record<CampaignPerkId, CampaignPerkDefinition>
);

export function getCampaignPerkDefinition(
  perkId: CampaignPerkId
): CampaignPerkDefinition {
  const definition = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId];
  if (!definition) {
    throw new Error(`Unknown campaign perk: ${perkId}`);
  }
  return definition;
}
