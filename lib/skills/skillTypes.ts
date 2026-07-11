import type { SpellEffect, SpellTargetingType } from "../spells/spellTypes";
import type { CombatStat } from "../statusEffects/statusEffectTypes";

export type SkillTargetingType = SpellTargetingType;
export type SkillEffect = SpellEffect;

/** Combat stat used to scale skill damage via scalingFactor. Defaults to strength. */
export type SkillDamageScalingStat = CombatStat;

/** Core skill fields shared by definitions and warrior-owned skills. */
export interface SkillDefinition {
  id: number;
  name: string;
  description: string;
  staminaCost: number;
  baseDamageTarget: number;
  baseHealTarget: number;
  baseStaminaRestore: number;
  scalingFactor: number;
  /** When set, skill damage scales from this stat instead of strength. */
  damageScalingStat?: SkillDamageScalingStat;
  /** When true, battle visuals walk the caster to the target instead of an attack pose. */
  casterWalkToTargetVisual?: boolean;
  type: string | null;
  range: number;
  targetingType: SkillTargetingType;
  effect: SkillEffect | null;
}

/** Skill known by a warrior, including unlock level. */
export interface OwnedSkill extends SkillDefinition {
  requiredLevel: number;
}

/** API skill shape; requiredLevel is present on warrior-owned skills only. */
export type Skill = SkillDefinition & {
  requiredLevel?: number;
};
