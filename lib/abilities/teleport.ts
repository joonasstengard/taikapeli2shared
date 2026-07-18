import type { AbilityEffect } from "./abilityEffects";

export function hasTeleportEffect(
  effect: AbilityEffect | null | undefined
): boolean {
  return effect?.effectType === "teleport";
}
