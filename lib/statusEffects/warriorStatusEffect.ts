import type { StatusEffectTag } from "./statusEffectTypes";

/** Active status effect on a warrior (API / battle UI shape). */
export interface WarriorStatusEffect {
  effectKey: string;
  name: string;
  turnsRemaining: number;
  tags: StatusEffectTag[];
}
