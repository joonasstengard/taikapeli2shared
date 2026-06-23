import type { AbilityEffect } from "./abilityEffects";
import { applyEffectToBaseDamage } from "./applyEffectToBaseDamage";
import { hasSacrificeEffect } from "./calculateSacrificePower";
import {
  calculateSkillDamageBonus,
  calculateSpellDamageBonus,
  calculateSpellHealBonus,
  type SkillScalingValues,
  type SpellCasterCombatStats,
  type SpellScalingValues,
  toSkillCasterCombatStats,
  toSpellCasterCombatStats,
} from "../spells/spellPower";
import { getDevotionSpellHealBonus } from "../warriors/classPassiveTraits";

export interface AbilityPreviewCaster {
  class?: string;
  health: number;
  currentHealth: number;
  strength: number;
  faith: number;
  spellDamage: number;
}

export interface AbilityPreviewValues {
  damage: number | null;
  heal: number | null;
  staminaRestore: number | null;
  hasLastStandEffect: boolean;
  hasSacrificeEffect: boolean;
}

interface AbilityPreviewInput extends SpellScalingValues {
  effect: AbilityEffect | null | undefined;
}

export interface SkillPreviewInput extends AbilityPreviewInput {
  baseStaminaRestore?: number;
}

function toPreviewCasterStats(
  caster: AbilityPreviewCaster
): SpellCasterCombatStats {
  return toSpellCasterCombatStats(caster);
}

export function previewSpellDamage(
  spell: AbilityPreviewInput,
  caster: AbilityPreviewCaster
): number {
  if (spell.baseDamageTarget <= 0) {
    return 0;
  }

  const adjustedBase = applyEffectToBaseDamage(
    spell.baseDamageTarget,
    spell.effect,
    caster
  );

  return (
    adjustedBase +
    calculateSpellDamageBonus(spell, toPreviewCasterStats(caster))
  );
}

export function previewSkillDamage(
  skill: AbilityPreviewInput,
  caster: AbilityPreviewCaster
): number {
  if (skill.baseDamageTarget <= 0) {
    return 0;
  }

  const adjustedBase = applyEffectToBaseDamage(
    skill.baseDamageTarget,
    skill.effect,
    caster
  );

  return (
    adjustedBase + calculateSkillDamageBonus(skill, toSkillCasterCombatStats(caster))
  );
}

export function previewSpellHeal(
  spell: SpellScalingValues,
  caster: AbilityPreviewCaster
): number {
  if (spell.baseHealTarget <= 0) {
    return 0;
  }

  return (
    spell.baseHealTarget +
    calculateSpellHealBonus(spell, toPreviewCasterStats(caster)) +
    getDevotionSpellHealBonus(caster.class)
  );
}

export function previewSkillHeal(
  skill: Pick<SkillScalingValues, "baseHealTarget">
): number {
  return skill.baseHealTarget > 0 ? skill.baseHealTarget : 0;
}

export function previewSpellCombatValues(
  spell: AbilityPreviewInput,
  caster: AbilityPreviewCaster
): AbilityPreviewValues {
  return {
    damage: spell.baseDamageTarget > 0 ? previewSpellDamage(spell, caster) : null,
    heal: spell.baseHealTarget > 0 ? previewSpellHeal(spell, caster) : null,
    staminaRestore: null,
    hasLastStandEffect: spell.effect?.effectType === "lastStand",
    hasSacrificeEffect: hasSacrificeEffect(spell.effect),
  };
}

export function previewSkillCombatValues(
  skill: SkillPreviewInput,
  caster: AbilityPreviewCaster
): AbilityPreviewValues {
  const staminaRestore = skill.baseStaminaRestore ?? 0;

  return {
    damage: skill.baseDamageTarget > 0 ? previewSkillDamage(skill, caster) : null,
    heal: skill.baseHealTarget > 0 ? previewSkillHeal(skill) : null,
    staminaRestore: staminaRestore > 0 ? staminaRestore : null,
    hasLastStandEffect: skill.effect?.effectType === "lastStand",
    hasSacrificeEffect: hasSacrificeEffect(skill.effect),
  };
}
