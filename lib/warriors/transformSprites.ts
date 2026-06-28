import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";

/** Shared transform spritesheet file names (same folder/layout as warrior sheets). */
export const TRANSFORM_SPRITE_FILE_BY_STATUS_KEY: Record<string, string> = {
  [STATUS_EFFECT_KEY.transformWolf]: "Wolf1.png",
};

export const WARRIOR_SPRITE_SHEET_BASE_PATH =
  "/WarriorPictures/PixelStyle/SpriteSheets";

export function getTransformSpriteSheetPath(statusEffectKey: string): string | undefined {
  const fileName = TRANSFORM_SPRITE_FILE_BY_STATUS_KEY[statusEffectKey];
  if (!fileName) {
    return undefined;
  }

  return `${WARRIOR_SPRITE_SHEET_BASE_PATH}/${fileName}`;
}
