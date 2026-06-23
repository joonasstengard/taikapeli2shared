import type { StatusEffectTag } from "./statusEffectTypes";
import { STATUS_EFFECT_KEY } from "./statusEffectTypes";

/** Active status effect on a warrior (API / battle UI shape). */
export interface WarriorStatusEffect {
  effectKey: string;
  name: string;
  turnsRemaining: number;
  tags: StatusEffectTag[];
}

export function isWarriorFrozen(
  statusEffects: Pick<WarriorStatusEffect, "effectKey" | "turnsRemaining">[] | undefined
): boolean {
  return (statusEffects ?? []).some(
    (effect) =>
      effect.effectKey === STATUS_EFFECT_KEY.frozen &&
      effect.turnsRemaining > 0
  );
}

/** Merges or extends a status effect on a warrior's active effect list. */
export function upsertWarriorStatusEffect(
  statusEffects: WarriorStatusEffect[] | undefined,
  effect: Pick<WarriorStatusEffect, "effectKey" | "name" | "tags">,
  duration: number
): WarriorStatusEffect[] {
  if (duration <= 0) {
    return [...(statusEffects ?? [])];
  }

  const effects = [...(statusEffects ?? [])];
  const existingIndex = effects.findIndex(
    (entry) => entry.effectKey === effect.effectKey
  );

  if (existingIndex >= 0) {
    const existing = effects[existingIndex];
    effects[existingIndex] = {
      ...existing,
      turnsRemaining: Math.max(existing.turnsRemaining, duration),
    };
    return effects;
  }

  return [
    ...effects,
    {
      effectKey: effect.effectKey,
      name: effect.name,
      tags: effect.tags,
      turnsRemaining: duration,
    },
  ];
}
