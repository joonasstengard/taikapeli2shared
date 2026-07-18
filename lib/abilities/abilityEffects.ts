import type { CombatStat } from "../statusEffects/statusEffectTypes";

export type StatModifiers = Partial<Record<CombatStat, number>>;

export type AbilityEffect =
  | { effectType: "lastStand" }
  | { effectType: "leap" }
  | { effectType: "teleport" }
  | { effectType: "retreat" }
  | { effectType: "knockback" }
  | { effectType: "swapTiles" }
  | { effectType: "drain" }
  | { effectType: "sacrifice" }
  | { effectType: "requiresBleeding" }
  | { effectType: "commandAttack" }
  | {
      effectType: "applyStatus";
      statusKey: string;
      duration: number;
    }
  | {
      effectType: "applyStatBuff";
      duration: number;
      statModifiers: StatModifiers;
      label?: string;
    }
  | {
      effectType: "applyTransform";
      statusKey: string;
      duration: number;
      statModifiers: StatModifiers;
      label?: string;
    };

export interface AbilityCasterHealth {
  health: number;
  currentHealth: number;
}
