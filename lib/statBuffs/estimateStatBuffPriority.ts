import type { CombatStat } from "../statusEffects/statusEffectTypes";
import { isTransformStatusEffectKey } from "../statusEffects/statusEffectDefinitions";
import type { WarriorStatusEffect } from "../statusEffects/warriorStatusEffect";
import type { StatModifiers, WarriorStatBuffInstance } from "./statBuffTypes";
import {
  hasNegativeStatModifiers,
  hasPositiveStatModifiers,
} from "./sumStatBuffBonuses";

type ActiveStatusEffect = Pick<WarriorStatusEffect, "effectKey" | "turnsRemaining">;
type ActiveStatBuff = Pick<
  WarriorStatBuffInstance,
  "turnsRemaining" | "statModifiers"
>;

/** AI priority weight per stat point, per turn of buff duration. */
export const STAT_BUFF_PRIORITY_WEIGHT: Record<CombatStat, number> = {
  strength: 1.5,
  speed: 1.2,
  faith: 1.0,
  spellDamage: 1.0,
};

/**
 * Enemy debuffs are scored below ally buffs of the same magnitude so they tip
 * close damage decisions without overriding kill shots or strong strikes.
 */
export const STAT_DEBUFF_PRIORITY_SCALE = 0.35;

const COMBAT_OFFENSE_STATS: CombatStat[] = ["strength", "spellDamage"];

export interface StatBuffEffectSource {
  effectType: string;
  duration?: number;
  statModifiers?: StatModifiers;
  statusKey?: string;
}

export function getStatBuffFromEffect(
  effect: StatBuffEffectSource | null | undefined
): {
  statModifiers: StatModifiers;
  duration: number;
  linkedTransformKey?: string;
} | null {
  if (!effect) {
    return null;
  }

  if (effect.effectType === "applyStatBuff") {
    const duration = effect.duration;
    const statModifiers = effect.statModifiers;
    if (
      duration === undefined ||
      duration <= 0 ||
      !hasPositiveStatModifiers(statModifiers)
    ) {
      return null;
    }

    return { statModifiers: statModifiers!, duration };
  }

  if (effect.effectType === "applyTransform") {
    const duration = effect.duration;
    const statModifiers = effect.statModifiers;
    const statusKey = effect.statusKey;
    if (
      !statusKey ||
      duration === undefined ||
      duration <= 0 ||
      !hasPositiveStatModifiers(statModifiers)
    ) {
      return null;
    }

    return {
      statModifiers: statModifiers!,
      duration,
      linkedTransformKey: statusKey,
    };
  }

  return null;
}

export function getStatDebuffFromEffect(
  effect: StatBuffEffectSource | null | undefined
): {
  statModifiers: StatModifiers;
  duration: number;
} | null {
  if (!effect || effect.effectType !== "applyStatBuff") {
    return null;
  }

  const duration = effect.duration;
  const statModifiers = effect.statModifiers;
  if (
    duration === undefined ||
    duration <= 0 ||
    !hasNegativeStatModifiers(statModifiers)
  ) {
    return null;
  }

  return { statModifiers: statModifiers!, duration };
}

export function canApplyTransformToTarget(
  statusKey: string,
  targetStatusEffects: ActiveStatusEffect[] | undefined
): boolean {
  if (!isTransformStatusEffectKey(statusKey)) {
    return true;
  }

  return !(targetStatusEffects ?? []).some(
    (effect) =>
      effect.turnsRemaining > 0 &&
      isTransformStatusEffectKey(effect.effectKey)
  );
}

export function sumWeightedStatModifierPoints(
  statModifiers: StatModifiers,
  combatOffenseMultiplier = 1
): number {
  let total = 0;

  for (const stat of Object.keys(STAT_BUFF_PRIORITY_WEIGHT) as CombatStat[]) {
    const modifier = statModifiers[stat];
    if (modifier === undefined || modifier <= 0) {
      continue;
    }

    const multiplier = COMBAT_OFFENSE_STATS.includes(stat)
      ? combatOffenseMultiplier
      : 1;

    total += modifier * STAT_BUFF_PRIORITY_WEIGHT[stat] * multiplier;
  }

  return total;
}

export function sumWeightedStatDebuffPoints(
  statModifiers: StatModifiers
): number {
  let total = 0;

  for (const stat of Object.keys(STAT_BUFF_PRIORITY_WEIGHT) as CombatStat[]) {
    const modifier = statModifiers[stat];
    if (modifier === undefined || modifier >= 0) {
      continue;
    }

    total +=
      Math.abs(modifier) *
      STAT_BUFF_PRIORITY_WEIGHT[stat] *
      STAT_DEBUFF_PRIORITY_SCALE;
  }

  return total;
}

/**
 * Estimates how strongly the computer AI should value applying a temporary stat buff.
 * Returns null when the buff should not be applied (already transformed, etc.).
 */
export function estimateInlineStatBuffPriority(
  statModifiers: StatModifiers,
  duration: number,
  options: {
    combatOffenseMultiplier?: number;
    recipientMultiplier?: number;
    linkedTransformKey?: string;
    targetStatusEffects?: ActiveStatusEffect[] | undefined;
  } = {}
): number | null {
  if (!hasPositiveStatModifiers(statModifiers) || duration <= 0) {
    return null;
  }

  if (
    options.linkedTransformKey &&
    !canApplyTransformToTarget(
      options.linkedTransformKey,
      options.targetStatusEffects
    )
  ) {
    return null;
  }

  const combatOffenseMultiplier = options.combatOffenseMultiplier ?? 1;
  const recipientMultiplier = options.recipientMultiplier ?? 1;
  const pointsPerTurn = sumWeightedStatModifierPoints(
    statModifiers,
    combatOffenseMultiplier
  );

  if (pointsPerTurn <= 0) {
    return null;
  }

  return Math.round(pointsPerTurn * duration * recipientMultiplier);
}

/**
 * Estimates how strongly the computer AI should value applying a temporary
 * enemy-targeted stat debuff. Returns null when the debuff should not be valued.
 */
export function estimateInlineStatDebuffPriority(
  statModifiers: StatModifiers,
  duration: number
): number | null {
  if (!hasNegativeStatModifiers(statModifiers) || duration <= 0) {
    return null;
  }

  const pointsPerTurn = sumWeightedStatDebuffPoints(statModifiers);
  if (pointsPerTurn <= 0) {
    return null;
  }

  return Math.round(pointsPerTurn * duration);
}

export function estimateStatDebuffInstancePriority(
  statModifiers: StatModifiers,
  duration: number,
  existingBuffs: ActiveStatBuff[] | undefined
): number | null {
  if (hasMatchingActiveStatBuff(statModifiers, existingBuffs)) {
    return null;
  }

  return estimateInlineStatDebuffPriority(statModifiers, duration);
}

/**
 * Priority bonus for applyStatBuff debuffs on enemies.
 * Returns 0 when there is no valued debuff (missing, already active, etc.).
 */
export function estimateEnemyStatDebuffPriorityBonus(
  effect: StatBuffEffectSource | null | undefined,
  existingBuffs: ActiveStatBuff[] | undefined
): number {
  const debuff = getStatDebuffFromEffect(effect);
  if (!debuff) {
    return 0;
  }

  return (
    estimateStatDebuffInstancePriority(
      debuff.statModifiers,
      debuff.duration,
      existingBuffs
    ) ?? 0
  );
}

export function statModifiersMatch(
  proposed: StatModifiers,
  existing: StatModifiers
): boolean {
  const keys = new Set([
    ...(Object.keys(proposed) as CombatStat[]),
    ...(Object.keys(existing) as CombatStat[]),
  ]);

  for (const key of Array.from(keys)) {
    if ((proposed[key] ?? 0) !== (existing[key] ?? 0)) {
      return false;
    }
  }

  return true;
}

export function hasMatchingActiveStatBuff(
  statModifiers: StatModifiers,
  existingBuffs: ActiveStatBuff[] | undefined
): boolean {
  if (!existingBuffs?.length) {
    return false;
  }

  return existingBuffs.some(
    (buff) =>
      buff.turnsRemaining > 0 &&
      statModifiersMatch(statModifiers, buff.statModifiers)
  );
}

export function estimateStatBuffInstancePriority(
  statModifiers: StatModifiers,
  duration: number,
  existingBuffs: ActiveStatBuff[] | undefined,
  options: {
    combatOffenseMultiplier?: number;
    recipientMultiplier?: number;
    linkedTransformKey?: string;
    targetStatusEffects?: ActiveStatusEffect[] | undefined;
  } = {}
): number | null {
  if (
    !options.linkedTransformKey &&
    hasMatchingActiveStatBuff(statModifiers, existingBuffs)
  ) {
    return null;
  }

  return estimateInlineStatBuffPriority(statModifiers, duration, options);
}
