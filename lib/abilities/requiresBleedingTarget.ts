import type { AbilityEffect } from "./abilityEffects";
import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";

export function requiresBleedingTarget(
  effect: AbilityEffect | null | undefined
): boolean {
  return effect?.effectType === "requiresBleeding";
}

export interface StatusEffectLike {
  effectKey: string;
  turnsRemaining: number;
}

export function isWarriorBleeding(
  statusEffects: StatusEffectLike[] | undefined
): boolean {
  return (statusEffects ?? []).some(
    (effect) =>
      effect.effectKey === STATUS_EFFECT_KEY.bleeding &&
      effect.turnsRemaining > 0
  );
}

/** Whether an ability may be used on a target with the given active status effects. */
export function canUseBleedingRequiredAbilityOnTarget(
  effect: AbilityEffect | null | undefined,
  targetStatusEffects: StatusEffectLike[] | undefined
): boolean {
  if (!requiresBleedingTarget(effect)) {
    return true;
  }

  return isWarriorBleeding(targetStatusEffects);
}
