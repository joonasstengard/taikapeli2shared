/** Soft percentage defense curve: higher defense → less damage, never immunity. */
export const DEFENSE_CONSTANT = 40;

/** Chip damage floor after armor/resistance mitigation. */
export const MIN_DAMAGE_AFTER_MITIGATION = 1;

/**
 * Apply soft defense mitigation: floor(raw × C / (C + defense)), min 1 when raw > 0.
 * Used for both armor (physical) and resistance (magic).
 */
export function applyDefenseMitigation(
  rawDamage: number,
  defense: number
): number {
  if (rawDamage <= 0) {
    return 0;
  }

  const clampedDefense = Math.max(0, defense);
  if (clampedDefense <= 0) {
    return rawDamage;
  }

  return Math.max(
    MIN_DAMAGE_AFTER_MITIGATION,
    Math.floor(
      (rawDamage * DEFENSE_CONSTANT) / (DEFENSE_CONSTANT + clampedDefense)
    )
  );
}

/** Physical mitigation (basic attacks + skills). */
export function applyArmorMitigation(
  rawDamage: number,
  armor: number
): number {
  return applyDefenseMitigation(rawDamage, armor);
}

/** Magical mitigation (spells). */
export function applyResistanceMitigation(
  rawDamage: number,
  resistance: number
): number {
  return applyDefenseMitigation(rawDamage, resistance);
}
