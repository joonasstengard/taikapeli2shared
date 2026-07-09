import { getTransformConfig } from "./transformConfig";

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
  const config = getTransformConfig(statusEffectKey);
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
