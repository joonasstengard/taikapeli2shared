import {
  STATUS_EFFECT_KEY,
  type StatusEffectDefinition,
  type StatusEffectKey,
  type StatusEffectTag,
} from "./statusEffectTypes";

export {
  STATUS_EFFECT_KEY,
  type StatusEffectKey,
  type StatusEffectTag,
};

export type StatusEffect = StatusEffectDefinition;

/**
 * Active on a warrior's next turn(s): movement is blocked while turnsRemaining > 0.
 * Duration ticks down at the end of that warrior's turn (see tickStatusEffectsForWarrior).
 */
export const STATUS_EFFECTS: StatusEffect[] = [
  {
    key: STATUS_EFFECT_KEY.frozen,
    name: "Frozen",
    tags: ["blocks_movement"],
  },
  {
    key: STATUS_EFFECT_KEY.invulnerable,
    name: "Invulnerable",
    tags: ["blocks_damage"],
  },
  {
    key: STATUS_EFFECT_KEY.bleeding,
    name: "Bleeding",
    tags: [],
    turnEndDamage: 1,
  },
  {
    key: STATUS_EFFECT_KEY.transformWolf,
    name: "Wolf Form",
    tags: ["transform"],
    hideBadge: true,
    statModifiers: { strength: 5, speed: 5 },
  },
];

export const STATUS_EFFECT_BY_KEY: Record<string, StatusEffect> =
  STATUS_EFFECTS.reduce<Record<string, StatusEffect>>((byKey, effect) => {
    byKey[effect.key] = effect;
    return byKey;
  }, {});

export function getStatusEffect(
  effectKey: string
): StatusEffect | undefined {
  return STATUS_EFFECT_BY_KEY[effectKey];
}

export function isStatusEffectKey(value: string): value is StatusEffectKey {
  return value in STATUS_EFFECT_BY_KEY;
}

export function hasStatusTag(
  effectKey: string,
  tag: StatusEffectTag
): boolean {
  const effect = getStatusEffect(effectKey);
  return effect?.tags.includes(tag) ?? false;
}

export function isTransformStatusEffectKey(effectKey: string): boolean {
  return hasStatusTag(effectKey, "transform");
}
