import type { CombatStat } from "../statusEffects/statusEffectTypes";
import { isTransformStatusEffectKey } from "../statusEffects/statusEffectDefinitions";
import type { WarriorStatusEffect } from "../statusEffects/warriorStatusEffect";
import type { StatModifiers, WarriorStatBuffInstance } from "./statBuffTypes";
import { hasPositiveStatModifiers } from "./sumStatBuffBonuses";

type ActiveStatusEffect = Pick<WarriorStatusEffect, "effectKey" | "turnsRemaining">;

/** AI priority weight per stat point, per turn of buff duration. */
export const STAT_BUFF_PRIORITY_WEIGHT: Record<CombatStat, number> = {
  strength: 1.5,
  speed: 1.2,
  faith: 1.0,
  spellDamage: 1.0,
};

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

export function estimateStatBuffInstancePriority(
  statModifiers: StatModifiers,
  duration: number,
  existingBuffs: WarriorStatBuffInstance[] | undefined,
  options: {
    combatOffenseMultiplier?: number;
    recipientMultiplier?: number;
    linkedTransformKey?: string;
    targetStatusEffects?: ActiveStatusEffect[] | undefined;
  } = {}
): number | null {
  if (options.linkedTransformKey) {
    return estimateInlineStatBuffPriority(statModifiers, duration, options);
  }

  return estimateInlineStatBuffPriority(statModifiers, duration, options);
}
