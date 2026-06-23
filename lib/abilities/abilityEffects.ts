export type AbilityEffect =
  | { effectType: "lastStand" }
  | { effectType: "leap" }
  | { effectType: "retreat" }
  | { effectType: "drain" }
  | { effectType: "sacrifice" }
  | { effectType: "requiresBleeding" }
  | {
      effectType: "applyStatus";
      statusKey: string;
      duration: number;
    };

export interface AbilityCasterHealth {
  health: number;
  currentHealth: number;
}
