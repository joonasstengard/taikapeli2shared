import { trainingCostForPoint } from "../warriors/trainingCost";
import type { WarriorClass } from "../warriors/warriorPictureVariants";
import type { CampaignPerkId } from "./campaignPerkIds";
import { isCampaignPerkId } from "./campaignPerkIds";
import { MIN_NATION_HEALTH_LOSS_AFTER_PERK } from "./campaignPerkConstants";
import { CAMPAIGN_PERK_DEFINITIONS_BY_ID } from "./campaignPerkDefinitions";

export interface RecruitStatBonuses {
  faith: number;
  speed: number;
}

export interface StartingWarriorGrant {
  warriorClass: WarriorClass;
  count: number;
}

const NO_RECRUIT_STAT_BONUSES: RecruitStatBonuses = { faith: 0, speed: 0 };

export function getRecruitStatBonuses(
  perkId: CampaignPerkId | null | undefined
): RecruitStatBonuses {
  if (!perkId) {
    return NO_RECRUIT_STAT_BONUSES;
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "recruit_stat_bonus") {
    return NO_RECRUIT_STAT_BONUSES;
  }

  if (effect.stat === "faith") {
    return { faith: effect.bonus, speed: 0 };
  }

  return { faith: 0, speed: effect.bonus };
}

export function applyRecruitStatBonuses<T extends RecruitStatBonuses>(
  stats: T,
  bonuses: RecruitStatBonuses
): T {
  return {
    ...stats,
    faith: stats.faith + bonuses.faith,
    speed: stats.speed + bonuses.speed,
  };
}

export function applyCampaignPerkToStartingGold(
  baseGold: number,
  perkId: CampaignPerkId | null | undefined
): number {
  if (!perkId) {
    return baseGold;
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "starting_gold") {
    return baseGold;
  }

  return baseGold + effect.bonus;
}

/**
 * Returns warriors granted into the army at campaign start (in addition to
 * normal recruitment). Empty when the perk does not grant starting warriors.
 */
export function getCampaignPerkStartingWarriors(
  perkId: CampaignPerkId | null | undefined
): StartingWarriorGrant[] {
  if (!perkId) {
    return [];
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "starting_warrior" || effect.count <= 0) {
    return [];
  }

  return [
    {
      warriorClass: effect.warriorClass,
      count: effect.count,
    },
  ];
}

export function getCampaignPerkWeeklyGoldBonus(
  perkId: CampaignPerkId | null | undefined
): number {
  if (!perkId) {
    return 0;
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "weekly_gold") {
    return 0;
  }

  return effect.bonus;
}

export function getCampaignPerkMarketSpellCount(
  baseCount: number,
  perkId: CampaignPerkId | null | undefined
): number {
  if (!perkId) {
    return baseCount;
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "market_spell_options") {
    return baseCount;
  }

  return effect.count;
}

export function applyCampaignPerkToMarketSpellPrice(
  basePrice: number,
  perkId: CampaignPerkId | null | undefined
): number {
  if (!perkId) {
    return basePrice;
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "market_spell_options" || !effect.priceMultiplier) {
    return basePrice;
  }

  return Math.max(0, Math.round(basePrice * effect.priceMultiplier));
}

export function buildCampaignPerkWeeklyGoldDeltas(
  armies: Array<{
    id: number;
    isEliminated?: boolean | null;
    campaignPerkId: string | null;
  }>
): Array<{ armyId: number; goldDelta: number }> {
  return armies
    .filter((army) => !army.isEliminated)
    .flatMap((army) => {
      const perkId =
        army.campaignPerkId && isCampaignPerkId(army.campaignPerkId)
          ? army.campaignPerkId
          : null;
      const bonus = getCampaignPerkWeeklyGoldBonus(perkId);
      return bonus > 0 ? [{ armyId: army.id, goldDelta: bonus }] : [];
    });
}

export function applyCampaignPerkToExperienceGain(
  baseXp: number,
  perkId: CampaignPerkId | null | undefined
): number {
  if (baseXp <= 0 || !perkId) {
    return baseXp;
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "warrior_xp_multiplier") {
    return baseXp;
  }

  return Math.round(baseXp * effect.multiplier);
}

export function applyCampaignPerkToNationHealthLoss(
  baseLoss: number,
  perkId: CampaignPerkId | null | undefined
): number {
  if (!perkId) {
    return baseLoss;
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "nation_health_loss_reduction") {
    return baseLoss;
  }

  return Math.max(
    MIN_NATION_HEALTH_LOSS_AFTER_PERK,
    baseLoss - effect.reduction
  );
}

export function applyCampaignPerkToTrainingCost(
  baseCost: number,
  perkId: CampaignPerkId | null | undefined
): number {
  if (baseCost <= 0 || !perkId) {
    return baseCost;
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "training_cost_multiplier") {
    return baseCost;
  }

  return Math.max(0, Math.round(baseCost * effect.multiplier));
}

/**
 * Caps recruit market price for Muster Edict (and similar). Does not affect
 * release gold — call sites must keep using the uncapped recruit formula there.
 */
export function applyCampaignPerkToRecruitPrice(
  basePrice: number,
  perkId: CampaignPerkId | null | undefined
): number {
  if (basePrice <= 0 || !perkId) {
    return basePrice;
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "recruit_price_cap") {
    return basePrice;
  }

  return Math.min(basePrice, effect.maxPrice);
}

/**
 * Resolves an army's stored campaignPerkId and returns the recruit gold cost.
 * Used by player recruitment so army perk application matches AI.
 */
export function calculateRecruitPriceForArmyPerk(
  basePrice: number,
  campaignPerkId: string | null | undefined
): number {
  const perkId =
    campaignPerkId && isCampaignPerkId(campaignPerkId) ? campaignPerkId : null;
  return applyCampaignPerkToRecruitPrice(basePrice, perkId);
}

/**
 * Returns the required-level offset for ability unlocks (0 when the perk does
 * not affect unlock levels).
 */
export function getAbilityRequiredLevelOffset(
  perkId: CampaignPerkId | null | undefined
): number {
  if (!perkId) {
    return 0;
  }

  const effect = CAMPAIGN_PERK_DEFINITIONS_BY_ID[perkId]?.effect;
  if (effect?.type !== "ability_required_level_offset") {
    return 0;
  }

  return effect.offset;
}

/**
 * Lowers (or raises) a stored ability requiredLevel for the army's perk.
 * Never goes below level 1.
 */
export function applyCampaignPerkToAbilityRequiredLevel(
  requiredLevel: number,
  perkId: CampaignPerkId | null | undefined
): number {
  const offset = getAbilityRequiredLevelOffset(perkId);
  if (offset === 0) {
    return requiredLevel;
  }

  return Math.max(1, requiredLevel + offset);
}

/**
 * Applies Ability Mastery (or similar) to a list of skill/spell grants.
 * Returns the same array reference when the perk has no unlock-level effect.
 */
export function applyCampaignPerkToAbilityGrants<
  T extends { requiredLevel: number },
>(grants: T[], perkId: CampaignPerkId | null | undefined): T[] {
  const offset = getAbilityRequiredLevelOffset(perkId);
  if (offset === 0) {
    return grants;
  }

  return grants.map((grant) => ({
    ...grant,
    requiredLevel: Math.max(1, grant.requiredLevel + offset),
  }));
}

/** Total gold cost to train a stat range after applying the army's campaign perk. */
export function calculateTrainingCostForCampaignPerk(
  fromStat: number,
  toStat: number,
  perkId: CampaignPerkId | null | undefined
): number {
  if (toStat <= fromStat) {
    return 0;
  }

  let total = 0;

  for (let level = fromStat; level < toStat; level += 1) {
    total += applyCampaignPerkToTrainingCost(
      trainingCostForPoint(level),
      perkId
    );
  }

  return total;
}

/**
 * Resolves an army's stored campaignPerkId and returns the training gold cost.
 * Used by player training (`trainWarriorStat`) so army perk application matches AI.
 */
export function calculateTrainingCostForArmyPerk(
  fromStat: number,
  toStat: number,
  campaignPerkId: string | null | undefined
): number {
  const perkId =
    campaignPerkId && isCampaignPerkId(campaignPerkId) ? campaignPerkId : null;
  return calculateTrainingCostForCampaignPerk(fromStat, toStat, perkId);
}
