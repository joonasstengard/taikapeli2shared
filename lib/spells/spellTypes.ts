import type { AbilityTargetingType } from "../battle/abilityTargeting";
import type { StatusEffectKey } from "../statusEffects/statusEffectTypes";

export type SpellEffect =
  | { effectType: "lastStand" }
  | { effectType: "leap" }
  | { effectType: "drain" }
  | { effectType: "sacrifice" }
  | { effectType: "requiresBleeding" }
  | {
      effectType: "applyStatus";
      statusKey: StatusEffectKey;
      duration: number;
    };

export type SpellTargetingType = AbilityTargetingType;

/** Core spell fields shared by market listings and warrior-owned spells. */
export interface SpellDefinition {
  id: number;
  name: string;
  description: string;
  manaCost: number;
  goldCost: number;
  baseDamageTarget: number;
  baseHealTarget: number;
  scalingFactor: number;
  type: string | null;
  range: number;
  targetingType: SpellTargetingType;
  effect: SpellEffect | null;
}

/** Spell definition bundled with backend sprite sheet metadata. */
export interface SpellWithSpriteSheet extends SpellDefinition {
  SpriteSheetFileName: string;
  SpriteSheetRow: number;
  SpriteSheetFrames: number;
}

/** Spell known by a warrior, including unlock level. */
export interface OwnedSpell extends SpellDefinition {
  requiredLevel: number;
}

/** API spell shape; requiredLevel is present on warrior-owned spells only. */
export type Spell = SpellDefinition & {
  requiredLevel?: number;
};
