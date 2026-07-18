import type { AbilityEffect } from "./abilityEffects";

export function hasSwapTilesEffect(
  effect: AbilityEffect | null | undefined
): boolean {
  return effect?.effectType === "swapTiles";
}
