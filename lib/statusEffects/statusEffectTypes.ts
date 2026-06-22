export const STATUS_EFFECT_KEY = {
  frozen: "frozen",
  invulnerable: "invulnerable",
  bleeding: "bleeding",
} as const;

export type StatusEffectKey =
  (typeof STATUS_EFFECT_KEY)[keyof typeof STATUS_EFFECT_KEY];

export type StatusEffectTag =
  | "blocks_movement"
  | "blocks_actions"
  | "blocks_damage";

/** Static status effect definition (game data, not a DB row). */
export interface StatusEffectDefinition {
  key: StatusEffectKey;
  name: string;
  tags: StatusEffectTag[];
  /** Damage dealt at the end of the affected warrior's turn, before duration ticks down. */
  turnEndDamage?: number;
}
