import type { AbilityCasterHealth, AbilityEffect } from "./abilityEffects";
import { calculateLastStandDamage } from "./calculateLastStandDamage";

export function applyEffectToBaseDamage(
  baseDamageTarget: number,
  effect: AbilityEffect | null | undefined,
  caster: AbilityCasterHealth
): number {
  if (effect?.effectType === "lastStand") {
    return calculateLastStandDamage(caster, baseDamageTarget);
  }

  return baseDamageTarget;
}
