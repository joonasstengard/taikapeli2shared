import type { SkillDamageScalingStat } from "../skills/skillTypes";
import type { CombatStat } from "../statusEffects/statusEffectTypes";
import { getDevotionSpellHealBonus } from "../warriors/classPassiveTraits";

/** Spell fields used when calculating scaled combat power from caster stats. */
export interface SpellScalingValues {
  baseDamageTarget: number;
  baseHealTarget: number;
  baseManaRestore?: number;
  scalingFactor: number;
  type: string | null;
}

/** Skill fields used when calculating scaled combat power from caster stats. */
export interface SkillScalingValues {
  baseDamageTarget: number;
  baseHealTarget: number;
  baseStaminaRestore?: number;
  scalingFactor: number;
  damageScalingStat?: SkillDamageScalingStat;
}

export const DEFAULT_SKILL_DAMAGE_SCALING_STAT: SkillDamageScalingStat =
  "strength";

/** Caster stats that can scale spell damage or healing via a spell's scalingFactor. */
export interface SpellCasterCombatStats {
  faith: number;
  spellDamage: number;
}

/** Caster stats that can scale skill damage via a skill's scalingFactor. */
export type SkillCasterCombatStats = Record<CombatStat, number>;

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

export function toSkillCasterCombatStats(
  warrior: Partial<SkillCasterCombatStats>
): SkillCasterCombatStats {
  return {
    strength: warrior.strength ?? 0,
    speed: warrior.speed ?? 0,
    faith: warrior.faith ?? 0,
    spellDamage: warrior.spellDamage ?? 0,
  };
}

export function getSkillDamageScalingStat(
  skill: Pick<SkillScalingValues, "damageScalingStat">
): SkillDamageScalingStat {
  return skill.damageScalingStat ?? DEFAULT_SKILL_DAMAGE_SCALING_STAT;
}

export function getSkillScalingStatValue(
  caster: SkillCasterCombatStats,
  stat: SkillDamageScalingStat
): number {
  return caster[stat];
}

export function calculateSkillStatScalingBonus(
  skill: Pick<SkillScalingValues, "scalingFactor">,
  statValue: number
): number {
  return calculateStatScalingBonus(statValue, skill.scalingFactor);
}

export function calculateSkillStrengthScalingBonus(
  skill: Pick<SkillScalingValues, "scalingFactor">,
  strength: number
): number {
  return calculateSkillStatScalingBonus(skill, strength);
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

/** Extra mana restoration from caster stats (e.g. faith on holy spells). */
export function calculateSpellManaRestoreBonus(
  spell: SpellScalingValues,
  caster: SpellCasterCombatStats
): number {
  if ((spell.baseManaRestore ?? 0) <= 0) {
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

/** Extra damage from the skill's damageScalingStat (defaults to strength). Skill healing intentionally does not scale. */
export function calculateSkillDamageBonus(
  skill: SkillScalingValues,
  caster: SkillCasterCombatStats
): number {
  if (skill.baseDamageTarget <= 0) {
    return 0;
  }

  const scalingStat = getSkillDamageScalingStat(skill);
  return calculateSkillStatScalingBonus(
    skill,
    getSkillScalingStatValue(caster, scalingStat)
  );
}

export function calculateSpellHealAmount(
  spell: SpellScalingValues,
  caster: SpellCasterCombatStats,
  targetCurrentHealth: number,
  targetMaxHealth: number,
  casterClass?: string
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
  const traitHealBonus = getDevotionSpellHealBonus(casterClass);
  const rawHeal = spell.baseHealTarget + healBonus + traitHealBonus;

  return Math.min(rawHeal, missingHealth);
}

export function calculateSpellManaRestoreAmount(
  spell: SpellScalingValues,
  caster: SpellCasterCombatStats,
  targetCurrentMana: number,
  targetMaxMana: number,
  targetCurrentHealth: number
): number {
  const baseManaRestore = spell.baseManaRestore ?? 0;
  if (
    baseManaRestore <= 0 ||
    targetCurrentHealth <= 0 ||
    targetMaxMana <= 0
  ) {
    return 0;
  }

  const missingMana = targetMaxMana - Math.max(targetCurrentMana, 0);
  if (missingMana <= 0) {
    return 0;
  }

  const restoreBonus = calculateSpellManaRestoreBonus(spell, caster);
  const rawRestore = baseManaRestore + restoreBonus;

  return Math.min(rawRestore, missingMana);
}

export function calculateSkillHealAmount(
  skill: SkillScalingValues,
  targetCurrentHealth: number,
  targetMaxHealth: number
): number {
  if (
    skill.baseHealTarget <= 0 ||
    targetCurrentHealth <= 0 ||
    targetMaxHealth <= 0
  ) {
    return 0;
  }

  const missingHealth = targetMaxHealth - targetCurrentHealth;
  if (missingHealth <= 0) {
    return 0;
  }

  return Math.min(skill.baseHealTarget, missingHealth);
}

export interface StaminaRestoreValues {
  baseStaminaRestore?: number;
}

export interface ManaRestoreValues {
  baseManaRestore?: number;
}

export function hasManaRestoreEffect(ability: ManaRestoreValues): boolean {
  return (ability.baseManaRestore ?? 0) > 0;
}

export function hasStaminaRestoreEffect(
  ability: StaminaRestoreValues
): boolean {
  return (ability.baseStaminaRestore ?? 0) > 0;
}

/** Stamina restored to a target, capped at missing stamina. */
export function calculateStaminaRestoreAmount(
  baseStaminaRestore: number,
  targetCurrentStamina: number,
  targetMaxStamina: number
): number {
  if (baseStaminaRestore <= 0 || targetMaxStamina <= 0) {
    return 0;
  }

  const missingStamina = targetMaxStamina - Math.max(targetCurrentStamina, 0);
  if (missingStamina <= 0) {
    return 0;
  }

  return Math.min(baseStaminaRestore, missingStamina);
}

/** Heal amount when a drain effect converts damage dealt into caster HP. */
export function calculateDrainHealAmount(
  damageDealt: number,
  casterCurrentHealth: number,
  casterMaxHealth: number
): number {
  if (
    damageDealt <= 0 ||
    casterCurrentHealth <= 0 ||
    casterMaxHealth <= 0
  ) {
    return 0;
  }

  const missingHealth = casterMaxHealth - casterCurrentHealth;
  if (missingHealth <= 0) {
    return 0;
  }

  return Math.min(damageDealt, missingHealth);
}
