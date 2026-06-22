import type { AbilityCasterHealth, AbilityEffect } from "./abilityEffects";

export function hasSacrificeEffect(
  effect: AbilityEffect | null | undefined
): boolean {
  return effect?.effectType === "sacrifice";
}

/** AI penalty for sacrificing the caster — subtract from action priority. */
export function estimateSacrificeSelfCostPenalty(
  caster: AbilityCasterHealth
): number {
  return Math.max(caster.currentHealth, 0);
}
