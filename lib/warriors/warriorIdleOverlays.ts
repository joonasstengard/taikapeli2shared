import { getActiveTransformStatusEffectKey } from "../statusEffects/resolveCombatStats";
import type { WarriorStatusEffect } from "../statusEffects/warriorStatusEffect";
import type { WarriorClassGenderKey } from "./warriorPictureVariants";
import { WARRIOR_SPRITE_SHEET_BASE_PATH } from "./transformSprites";

export const WARRIOR_IDLE_OVERLAY_COLUMNS = 6;
export const WARRIOR_IDLE_OVERLAY_ROWS = 1;

/** Chance to start an idle overlay when an idle loop wraps back to frame 1. */
// 0.01 = 1%
export const WARRIOR_IDLE_OVERLAY_CHANCE = 0.01;

/** How many idle frames the overlay stays visible once triggered. */
export const WARRIOR_IDLE_OVERLAY_DURATION_FRAMES = 9;

/**
 * Max picture index (1..N) that has an IdleOverlay1 sheet for that class+gender.
 * Overlay files live at:
 * `/WarriorPictures/.../IdleOverlays/{Class}{Gender}{picture}IdleOverlay1.png`
 */
export const WARRIOR_IDLE_OVERLAY_PICTURE_COUNTS: Partial<
  Record<WarriorClassGenderKey, number>
> = {
  SorcererMale: 10,
};

export function getWarriorIdleOverlaySheetPath(
  warrior: {
    warriorClass: string;
    gender: string;
    picture: number;
  },
  statusEffects?: WarriorStatusEffect[]
): string | null {
  if (getActiveTransformStatusEffectKey(statusEffects)) {
    return null;
  }

  const key = `${warrior.warriorClass}${warrior.gender}` as WarriorClassGenderKey;
  const maxPicture = WARRIOR_IDLE_OVERLAY_PICTURE_COUNTS[key];
  if (
    maxPicture === undefined ||
    warrior.picture < 1 ||
    warrior.picture > maxPicture
  ) {
    return null;
  }

  return `${WARRIOR_SPRITE_SHEET_BASE_PATH}/IdleOverlays/${warrior.warriorClass}${warrior.gender}${warrior.picture}IdleOverlay1.png`;
}
