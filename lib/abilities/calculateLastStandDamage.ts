import type { AbilityCasterHealth } from "./abilityEffects";

/** Deals more damage the less health the caster has, up to 2x base. */
export function calculateLastStandDamage(
  caster: AbilityCasterHealth,
  baseDamageTarget: number
): number {
  const maxHealth = caster.health;
  const currentHealth = caster.currentHealth;

  if (maxHealth <= 0) {
    return baseDamageTarget;
  }

  const healthMissingFraction = (maxHealth - currentHealth) / maxHealth;
  const damage = baseDamageTarget + baseDamageTarget * healthMissingFraction;
  const finalDamage = Math.min(damage, 2 * baseDamageTarget);

  return Math.round(finalDamage);
}
