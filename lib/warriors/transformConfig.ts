import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";

export interface TransformConfig {
  /** Spritesheet/sound file prefix, e.g. "Wolf" → Wolf7.png, WolfAttack1.wav */
  filePrefix: string;
  /** Number of sprite sheet variants (1..variantCount). */
  variantCount: number;
  /** Number of attack sound variants (1..attackSoundCount). */
  attackSoundCount: number;
  /** Visual scale applied around each sprite frame's center. */
  spriteScale?: number;
}

/**
 * Per-transform assets and metadata. Add a new entry here when introducing
 * a transform status effect (sprites + attack sounds live under the usual folders).
 */
export const TRANSFORM_CONFIG: Record<string, TransformConfig> = {
  [STATUS_EFFECT_KEY.transformSkarWolf]: {
    filePrefix: "Wolf",
    variantCount: 10,
    attackSoundCount: 2,
  },
  [STATUS_EFFECT_KEY.transformThalenStag]: {
    filePrefix: "Deer",
    variantCount: 6,
    attackSoundCount: 2,
  },
  [STATUS_EFFECT_KEY.transformAeronorBear]: {
    filePrefix: "Bear",
    variantCount: 6,
    attackSoundCount: 2,
    spriteScale: 1.5,
  },
};

export function getTransformConfig(
  statusEffectKey: string
): TransformConfig | undefined {
  return TRANSFORM_CONFIG[statusEffectKey];
}
