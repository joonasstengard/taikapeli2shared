/** Spell fields used when calculating scaled combat power from caster stats. */
export interface SpellScalingValues {
  baseDamageTarget: number;
  baseHealTarget: number;
  scalingFactor: number;
  type: string | null;
}

/** Caster stats that can scale spell damage or healing via a spell's scalingFactor. */
export interface SpellCasterCombatStats {
  faith: number;
  spellDamage: number;
}

export function toSpellCasterCombatStats(
  warrior: Partial<SpellCasterCombatStats>
): SpellCasterCombatStats {
  return {
    faith: warrior.faith ?? 0,
    spellDamage: warrior.spellDamage ?? 0,
  };
}

/** Floor of stat × scalingFactor — shared by faith, spellDamage, and future scaling stats. */
export function calculateStatScalingBonus(
  statValue: number,
  scalingFactor: number
): number {
  if (statValue <= 0 || scalingFactor <= 0) {
    return 0;
  }

  return Math.floor(statValue * scalingFactor);
}

export function calculateHolyFaithScalingBonus(
  spell: Pick<SpellScalingValues, "type" | "scalingFactor">,
  faith: number
): number {
  if (spell.type !== "Holy") {
    return 0;
  }

  return calculateStatScalingBonus(faith, spell.scalingFactor);
}

export function calculateSpellDamageScalingBonus(
  spell: Pick<SpellScalingValues, "scalingFactor">,
  spellDamage: number
): number {
  return calculateStatScalingBonus(spellDamage, spell.scalingFactor);
}

/** Extra healing from caster stats (e.g. faith on holy spells). */
export function calculateSpellHealBonus(
  spell: SpellScalingValues,
  caster: SpellCasterCombatStats
): number {
  if (spell.baseHealTarget <= 0) {
    return 0;
  }

  return calculateHolyFaithScalingBonus(spell, caster.faith);
}

/** Extra damage from caster stats (faith on holy spells plus spellDamage on all damage spells). */
export function calculateSpellDamageBonus(
  spell: SpellScalingValues,
  caster: SpellCasterCombatStats
): number {
  if (spell.baseDamageTarget <= 0) {
    return 0;
  }

  return (
    calculateHolyFaithScalingBonus(spell, caster.faith) +
    calculateSpellDamageScalingBonus(spell, caster.spellDamage)
  );
}

export function calculateSpellHealAmount(
  spell: SpellScalingValues,
  caster: SpellCasterCombatStats,
  targetCurrentHealth: number,
  targetMaxHealth: number
): number {
  if (
    spell.baseHealTarget <= 0 ||
    targetCurrentHealth <= 0 ||
    targetMaxHealth <= 0
  ) {
    return 0;
  }

  const missingHealth = targetMaxHealth - targetCurrentHealth;
  if (missingHealth <= 0) {
    return 0;
  }

  const healBonus = calculateSpellHealBonus(spell, caster);
  const rawHeal = spell.baseHealTarget + healBonus;

  return Math.min(rawHeal, missingHealth);
}

export function applyMagicResistance(
  rawDamage: number,
  magicResistance: number
): number {
  const damageReduction = (magicResistance / 100) * rawDamage;
  return Math.max(0, Math.round(rawDamage - damageReduction));
}
