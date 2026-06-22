import type { SpellEffect, SpellTargetingType } from "../spells/spellTypes";

export type SkillTargetingType = SpellTargetingType;
export type SkillEffect = SpellEffect;

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
