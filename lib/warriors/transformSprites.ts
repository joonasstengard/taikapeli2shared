import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";

export interface TransformSpriteConfig {
  /** Spritesheet file prefix, e.g. "Wolf" → Wolf7.png */
  filePrefix: string;
  /** Number of available variants (1..variantCount). */
  variantCount: number;
}

/** Transform spritesheet config per status effect key (same folder/layout as warrior sheets). */
export const TRANSFORM_SPRITE_CONFIG: Record<string, TransformSpriteConfig> = {
  [STATUS_EFFECT_KEY.transformWolf]: {
    filePrefix: "Wolf",
    variantCount: 10,
  },
};

export const WARRIOR_SPRITE_SHEET_BASE_PATH =
  "/WarriorPictures/PixelStyle/SpriteSheets";

/**
 * Maps a warrior picture index to a transform variant (1..variantCount).
 * In-range pictures map directly; overflow wraps with modulo so the choice
 * stays deterministic across refreshes.
 */
export function resolveTransformVariantIndex(
  picture: number,
  variantCount: number
): number {
  if (variantCount <= 0) {
    return 1;
  }

  if (picture < 1) {
    return 1;
  }

  if (picture <= variantCount) {
    return picture;
  }

  return ((picture - 1) % variantCount) + 1;
}

export function getTransformSpriteSheetPath(
  statusEffectKey: string,
  picture: number
): string | undefined {
  const config = TRANSFORM_SPRITE_CONFIG[statusEffectKey];
  if (!config) {
    return undefined;
  }

  const variantIndex = resolveTransformVariantIndex(
    picture,
    config.variantCount
  );
  const fileName = `${config.filePrefix}${variantIndex}.png`;

  return `${WARRIOR_SPRITE_SHEET_BASE_PATH}/${fileName}`;
}
