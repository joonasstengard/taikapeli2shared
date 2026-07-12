export const STATUS_EFFECT_KEY = {
  frozen: "frozen",
  stunned: "stunned",
  invulnerable: "invulnerable",
  bleeding: "bleeding",
  transformWolf: "transformWolf",
  transformDeer: "transformDeer",
  transformBear: "transformBear",
} as const;

export type StatusEffectKey =
  (typeof STATUS_EFFECT_KEY)[keyof typeof STATUS_EFFECT_KEY];

export type StatusEffectTag =
  | "blocks_movement"
  | "blocks_actions"
  | "blocks_damage"
  | "transform";

export type CombatStat = "strength" | "speed" | "faith" | "spellDamage";

/** Static status effect definition (game data, not a DB row). */
export interface StatusEffectDefinition {
  key: StatusEffectKey;
  name: string;
  tags: StatusEffectTag[];
  /** Damage dealt at the end of the affected warrior's turn, before duration ticks down. */
  turnEndDamage?: number;
  /** Temporary combat stat bonuses while the effect is active. */
  statModifiers?: Partial<Record<CombatStat, number>>;
  /** When true, no status badge is shown in battle UI. */
  hideBadge?: true;
}
