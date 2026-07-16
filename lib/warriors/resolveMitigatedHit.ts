import {
  applyArmorMitigation,
  applyResistanceMitigation,
} from "./damageMitigation";

/**
 * How outgoing damage should be softened before it hits currentHealth.
 *
 * - `"armor"` — physical hits (skills, basic-attack cleave splash, AoE skills, …)
 * - `"resistance"` — magical hits (spells, AoE spells, …)
 * - `"none"` — bypass mitigation: bleed, sacrifice/self-damage, or damage that was
 *   already mitigated upstream (e.g. basic attack via `calculateBasicAttackDamage`)
 */
export type DamageMitigationKind = "armor" | "resistance" | "none";

export interface ResolveMitigatedHitParams {
  /** Pre-mitigation damage. Must already include strength/bonuses/traits. */
  rawDamage: number;
  mitigation: DamageMitigationKind;
  /**
   * Effective armor or resistance for the chosen mitigation kind.
   * Ignored when `mitigation` is `"none"`. Callers resolve buffs/status first.
   */
  defense?: number;
  currentHealth: number;
  /** Invulnerable targets take no damage (still blocks everything). */
  invulnerable?: boolean;
}

export interface MitigatedHitResult {
  /** Damage actually subtracted from HP (after mitigation and HP clamp). */
  damageDealt: number;
  /** Health after the hit (never below 0). */
  newHealth: number;
}

/**
 * Single place for “raw damage → HP loss” so every combat path applies the same
 * invulnerability, armor/resistance, and currentHealth clamp rules.
 *
 * Purpose:
 * - Prevent drift when adding new damage paths (AoE splash, chain, cleave, …)
 * - Keep bleed / sacrifice / self-damage on `mitigation: "none"`
 * - Keep previews free to call `applyArmorMitigation` / `applyResistanceMitigation`
 *   directly when they only need the mitigated number (no HP mutation)
 *
 * Does not: mark warriors dirty, record takedowns, drain mana/stamina, or heal.
 * Callers own those side effects.
 */
export function resolveMitigatedHit(
  params: ResolveMitigatedHitParams
): MitigatedHitResult {
  const {
    rawDamage,
    mitigation,
    defense = 0,
    currentHealth,
    invulnerable = false,
  } = params;

  if (invulnerable || rawDamage <= 0 || currentHealth <= 0) {
    return { damageDealt: 0, newHealth: currentHealth };
  }

  let mitigated = rawDamage;
  if (mitigation === "armor") {
    mitigated = applyArmorMitigation(rawDamage, defense);
  } else if (mitigation === "resistance") {
    mitigated = applyResistanceMitigation(rawDamage, defense);
  }

  const damageDealt = Math.min(mitigated, currentHealth);
  return {
    damageDealt,
    newHealth: currentHealth - damageDealt,
  };
}
