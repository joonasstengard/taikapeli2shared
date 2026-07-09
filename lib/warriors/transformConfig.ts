import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";

export interface TransformConfig {
  /** Spritesheet/sound file prefix, e.g. "Wolf" → Wolf7.png, WolfAttack1.wav */
  filePrefix: string;
  /** Number of sprite sheet variants (1..variantCount). */
  variantCount: number;
  /** Number of attack sound variants (1..attackSoundCount). */
  attackSoundCount: number;
}

/**
 * Per-transform assets and metadata. Add a new entry here when introducing
 * a transform status effect (sprites + attack sounds live under the usual folders).
 */
export const TRANSFORM_CONFIG: Record<string, TransformConfig> = {
  [STATUS_EFFECT_KEY.transformWolf]: {
    filePrefix: "Wolf",
    variantCount: 10,
    attackSoundCount: 2,
  },
  [STATUS_EFFECT_KEY.transformDeer]: {
    filePrefix: "Deer",
    variantCount: 6,
    attackSoundCount: 2,
  },
  [STATUS_EFFECT_KEY.transformBear]: {
    filePrefix: "Bear",
    variantCount: 6,
    attackSoundCount: 2,
  },
};

export function getTransformConfig(
  statusEffectKey: string
): TransformConfig | undefined {
  return TRANSFORM_CONFIG[statusEffectKey];
}
