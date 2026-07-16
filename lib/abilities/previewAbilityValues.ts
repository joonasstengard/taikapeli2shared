import type { AbilityEffect } from "./abilityEffects";
import { applyEffectToBaseDamage } from "./applyEffectToBaseDamage";
import { hasSacrificeEffect } from "./calculateSacrificePower";
import type { WarriorStatBuffInstance } from "../statBuffs/statBuffTypes";
import type { WarriorStatusEffect } from "../statusEffects/warriorStatusEffect";
import {
  calculateSkillDamageBonus,
  calculateSpellDamageBonus,
  calculateSpellHealBonus,
  calculateSpellManaRestoreBonus,
  type SkillScalingValues,
  type SpellCasterCombatStats,
  type SpellScalingValues,
  toSkillCasterCombatStats,
  toSpellCasterCombatStats,
} from "../spells/spellPower";
import {
  toEffectiveSkillCasterCombatStats,
  toEffectiveSpellCasterCombatStats,
} from "../statusEffects/resolveCombatStats";
import {
  getDevotionSpellHealBonus,
  getBloodFeudDamageBonusAgainstWarrior,
  getEldritchSpiteDamageBonusAgainstWarrior,
  type RaceBonusDefenderIdentity,
} from "../warriors/classPassiveTraits";

export interface AbilityPreviewCaster {
  warriorClass?: string;
  health: number;
  currentHealth: number;
  strength: number;
  speed?: number;
  faith: number;
  spellDamage: number;
  statusEffects?: Pick<WarriorStatusEffect, "effectKey" | "turnsRemaining">[];
  statBuffs?: Pick<WarriorStatBuffInstance, "turnsRemaining" | "statModifiers">[];
}

export interface AbilityPreviewValues {
  damage: number | null;
  heal: number | null;
  staminaRestore: number | null;
  manaRestore: number | null;
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
  if (caster.statusEffects || caster.statBuffs) {
    return toEffectiveSpellCasterCombatStats(
      caster,
      caster.statusEffects,
      caster.statBuffs
    );
  }

  return toSpellCasterCombatStats(caster);
}

function toPreviewSkillCasterStats(
  caster: AbilityPreviewCaster
) {
  if (caster.statusEffects || caster.statBuffs) {
    return toEffectiveSkillCasterCombatStats(
      caster,
      caster.statusEffects,
      caster.statBuffs
    );
  }

  return toSkillCasterCombatStats(caster);
}

export function previewSpellDamage(
  spell: AbilityPreviewInput,
  caster: AbilityPreviewCaster,
  defender?: RaceBonusDefenderIdentity
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
    calculateSpellDamageBonus(spell, toPreviewCasterStats(caster)) +
    getEldritchSpiteDamageBonusAgainstWarrior(caster.warriorClass, defender)
  );
}

export function previewSkillDamage(
  skill: AbilityPreviewInput,
  caster: AbilityPreviewCaster,
  defender?: RaceBonusDefenderIdentity
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
    adjustedBase +
    calculateSkillDamageBonus(skill, toPreviewSkillCasterStats(caster)) +
    getBloodFeudDamageBonusAgainstWarrior(caster.warriorClass, defender)
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
    getDevotionSpellHealBonus(caster.warriorClass)
  );
}

export function previewSpellManaRestore(
  spell: SpellScalingValues,
  caster: AbilityPreviewCaster
): number {
  const baseManaRestore = spell.baseManaRestore ?? 0;
  if (baseManaRestore <= 0) {
    return 0;
  }

  return (
    baseManaRestore + calculateSpellManaRestoreBonus(spell, toPreviewCasterStats(caster))
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
  const manaRestore = spell.baseManaRestore ?? 0;

  return {
    damage: spell.baseDamageTarget > 0 ? previewSpellDamage(spell, caster) : null,
    heal: spell.baseHealTarget > 0 ? previewSpellHeal(spell, caster) : null,
    staminaRestore: null,
    manaRestore:
      manaRestore > 0 ? previewSpellManaRestore(spell, caster) : null,
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
    manaRestore: null,
    hasLastStandEffect: skill.effect?.effectType === "lastStand",
    hasSacrificeEffect: hasSacrificeEffect(skill.effect),
  };
}
