import {
  getStatusEffect,
  isTransformStatusEffectKey,
} from "./statusEffectDefinitions";
import type { CombatStat } from "./statusEffectTypes";
import type { WarriorStatusEffect } from "./warriorStatusEffect";

type ActiveStatusEffect = Pick<
  WarriorStatusEffect,
  "effectKey" | "turnsRemaining"
>;

/** AI priority weight per stat point, per turn of buff duration. */
export const STAT_BUFF_PRIORITY_WEIGHT: Record<CombatStat, number> = {
  strength: 1.0,
  speed: 1.0,
  faith: 1.0,
  spellDamage: 1.0,
};

const COMBAT_OFFENSE_STATS: CombatStat[] = ["strength", "spellDamage"];

export function hasPositiveStatModifiers(
  statusKey: string
): boolean {
  const status = getStatusEffect(statusKey);
  if (!status?.statModifiers) {
    return false;
  }

  return Object.values(status.statModifiers).some(
    (value) => typeof value === "number" && value > 0
  );
}

export function isStatBuffStatusKey(statusKey: string): boolean {
  return hasPositiveStatModifiers(statusKey);
}

export function getApplyStatusStatBuff(
  effect:
    | {
        effectType: string;
        statusKey?: string;
        duration?: number;
      }
    | null
    | undefined
): { statusKey: string; duration: number } | null {
  if (effect?.effectType !== "applyStatus") {
    return null;
  }

  const statusKey = effect.statusKey;
  const duration = effect.duration;
  if (!statusKey || duration === undefined || duration <= 0) {
    return null;
  }

  if (!isStatBuffStatusKey(statusKey)) {
    return null;
  }

  return { statusKey, duration };
}

export function hasActiveTransformStatus(
  statusEffects: ActiveStatusEffect[] | undefined
): boolean {
  return (statusEffects ?? []).some(
    (effect) =>
      effect.turnsRemaining > 0 &&
      isTransformStatusEffectKey(effect.effectKey)
  );
}

export function getActiveStatusDuration(
  statusEffects: ActiveStatusEffect[] | undefined,
  statusKey: string
): number {
  return Math.max(
    0,
    ...(statusEffects ?? [])
      .filter((effect) => effect.effectKey === statusKey)
      .map((effect) => effect.turnsRemaining)
  );
}

export function canApplyStatBuffToTarget(
  statusKey: string,
  duration: number,
  targetStatusEffects: ActiveStatusEffect[] | undefined
): boolean {
  if (!isStatBuffStatusKey(statusKey) || duration <= 0) {
    return false;
  }

  if (isTransformStatusEffectKey(statusKey)) {
    return !hasActiveTransformStatus(targetStatusEffects);
  }

  return getActiveStatusDuration(targetStatusEffects, statusKey) < duration;
}

export function sumWeightedStatModifierPoints(
  statModifiers: Partial<Record<CombatStat, number>>,
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
 * Returns null when the buff should not be applied (already active, transformed, etc.).
 */
export function estimateStatBuffPriority(
  statusKey: string,
  duration: number,
  targetStatusEffects: ActiveStatusEffect[] | undefined,
  options: {
    /** Scales offensive stats (strength, spellDamage). Use <1 when target cannot attack. */
    combatOffenseMultiplier?: number;
    /** Additional multiplier for ally vs self tuning. */
    recipientMultiplier?: number;
  } = {}
): number | null {
  if (!canApplyStatBuffToTarget(statusKey, duration, targetStatusEffects)) {
    return null;
  }

  const status = getStatusEffect(statusKey);
  if (!status?.statModifiers) {
    return null;
  }

  const combatOffenseMultiplier = options.combatOffenseMultiplier ?? 1;
  const recipientMultiplier = options.recipientMultiplier ?? 1;
  const pointsPerTurn = sumWeightedStatModifierPoints(
    status.statModifiers,
    combatOffenseMultiplier
  );

  if (pointsPerTurn <= 0) {
    return null;
  }

  return Math.round(pointsPerTurn * duration * recipientMultiplier);
}
