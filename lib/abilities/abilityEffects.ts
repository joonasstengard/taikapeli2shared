export type AbilityEffect =
  | { effectType: "lastStand" }
  | { effectType: "leap" }
  | { effectType: "drain" }
  | {
      effectType: "applyStatus";
      statusKey: string;
      duration: number;
    };

export interface AbilityCasterHealth {
  health: number;
  currentHealth: number;
}
