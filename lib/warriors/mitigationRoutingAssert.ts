import assert from "node:assert/strict";

/**
 * Layer 1 — mitigation routing contracts.
 *
 * Purpose: catch “wrong defense stat” bugs (skill using resistance, spell using
 * armor) without depending on exact raw damage. Callers run the same attack /
 * ability three times with swapped armor/resistance and pass the measured
 * `damageDealt` values here.
 *
 * Fixture convention used across the suite:
 * - HIGH_DEFENSE = 50 (heavy mitigation)
 * - LOW_DEFENSE = 1 (near passthrough)
 */

export const ROUTING_HIGH_DEFENSE = 50;
export const ROUTING_LOW_DEFENSE = 1;

export interface PhysicalMitigationRoutingSamples {
  /** armor=HIGH, resistance=LOW */
  damageHighArmorLowResistance: number;
  /** armor=HIGH, resistance=HIGH — must match high-armor/low-res if resistance is ignored */
  damageHighArmorHighResistance: number;
  /** armor=LOW, resistance=HIGH — must deal more than high-armor if armor is applied */
  damageLowArmorHighResistance: number;
}

export interface MagicMitigationRoutingSamples {
  /** armor=LOW, resistance=HIGH */
  damageLowArmorHighResistance: number;
  /** armor=HIGH, resistance=HIGH — must match low-armor/high-res if armor is ignored */
  damageHighArmorHighResistance: number;
  /** armor=HIGH, resistance=LOW — must deal more than high-res if resistance is applied */
  damageHighArmorLowResistance: number;
}

/**
 * Assert a physical damage path (basic attack / skill / AoE skill / cleave / …)
 * uses armor and ignores resistance.
 */
export function assertPhysicalMitigationRouting(
  samples: PhysicalMitigationRoutingSamples,
  label = "physical path"
): void {
  assert.equal(
    samples.damageHighArmorLowResistance,
    samples.damageHighArmorHighResistance,
    `${label}: must ignore resistance when armor is held constant`
  );
  assert.ok(
    samples.damageLowArmorHighResistance >
      samples.damageHighArmorLowResistance,
    `${label}: must deal less damage when armor is high (got low-armor=${samples.damageLowArmorHighResistance}, high-armor=${samples.damageHighArmorLowResistance})`
  );
}

/**
 * Assert a magical damage path (spell / AoE spell / spell chain / …)
 * uses resistance and ignores armor.
 */
export function assertMagicMitigationRouting(
  samples: MagicMitigationRoutingSamples,
  label = "magic path"
): void {
  assert.equal(
    samples.damageLowArmorHighResistance,
    samples.damageHighArmorHighResistance,
    `${label}: must ignore armor when resistance is held constant`
  );
  assert.ok(
    samples.damageHighArmorLowResistance >
      samples.damageLowArmorHighResistance,
    `${label}: must deal less damage when resistance is high (got low-res=${samples.damageHighArmorLowResistance}, high-res=${samples.damageLowArmorHighResistance})`
  );
}
