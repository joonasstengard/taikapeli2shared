import type { CombatStat } from "../statusEffects/statusEffectTypes";

export type StatModifiers = Partial<Record<CombatStat, number>>;

/** Active temporary stat buff on a warrior (API / battle UI shape). */
export interface WarriorStatBuff {
  id: number;
  turnsRemaining: number;
  statModifiers: StatModifiers;
  label?: string;
  linkedTransformKey?: string;
}

/** Stored row shape during battle (matches DB). */
export interface WarriorStatBuffInstance {
  id: number;
  warriorId: number;
  turnsRemaining: number;
  statModifiers: StatModifiers;
  label?: string | null;
  linkedTransformKey?: string | null;
}

/** Active buff rows keyed by warrior id (battle AI / turn order). */
export type StatBuffsByWarriorId = Record<
  number,
  Pick<WarriorStatBuffInstance, "turnsRemaining" | "statModifiers">[]
>;
