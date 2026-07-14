/**
 * Battle map dimensions scale with the combined warrior count when a battle row
 * is created. Adjust these constants to tune breakpoints and resulting sizes.
 */
export const BATTLE_MAP_SMALL_MAX_WARRIORS = 4;
export const BATTLE_MAP_SMALL_WIDTH = 4;
export const BATTLE_MAP_SMALL_HEIGHT = 3;

export const BATTLE_MAP_MEDIUM_MAX_WARRIORS = 9;
export const BATTLE_MAP_MEDIUM_WIDTH = 5;
export const BATTLE_MAP_MEDIUM_HEIGHT = 4;

export const BATTLE_MAP_LARGE_WIDTH = 5;
export const BATTLE_MAP_LARGE_HEIGHT = 5;

/** Fallback size for legacy battles without stored dimensions. */
export const BATTLE_MAP_DEFAULT_WIDTH = BATTLE_MAP_LARGE_WIDTH;
export const BATTLE_MAP_DEFAULT_HEIGHT = BATTLE_MAP_LARGE_HEIGHT;

export interface BattleMapDimensions {
  width: number;
  height: number;
}

export function getBattleMapDimensionsForWarriorCount(
  totalWarriors: number
): BattleMapDimensions {
  if (totalWarriors <= BATTLE_MAP_SMALL_MAX_WARRIORS) {
    return {
      width: BATTLE_MAP_SMALL_WIDTH,
      height: BATTLE_MAP_SMALL_HEIGHT,
    };
  }

  if (totalWarriors <= BATTLE_MAP_MEDIUM_MAX_WARRIORS) {
    return {
      width: BATTLE_MAP_MEDIUM_WIDTH,
      height: BATTLE_MAP_MEDIUM_HEIGHT,
    };
  }

  return {
    width: BATTLE_MAP_LARGE_WIDTH,
    height: BATTLE_MAP_LARGE_HEIGHT,
  };
}
