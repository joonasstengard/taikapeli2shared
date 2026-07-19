// Warrior XP and level constants. Kept here for easy tweaking (shared by frontend + backend).

export const WARRIOR_LEVEL_CAP = 10;

// it's a good idea to keep all of these at 10+, so that
// perks and traits that boost xp gains by 10% always do something
export const BATTLE_XP_PARTICIPATION = 30;
export const BATTLE_XP_TAKEDOWN = 20;
export const BATTLE_XP_SURVIVAL = 10;

/**
 * Cumulative XP required to reach each level (index = level - 1).
 * Level 1 starts at 0 XP; level 5 is reached at 320 XP.
 */
export const XP_FOR_LEVEL: readonly number[] = [
  0, // L1
  50, // L2
  120, // L3
  210, // L4
  320, // L5
  440, // L6
  570, // L7
  720, // L8
  900, // L9
  1100, // L10
];

export interface WarriorXpProgress {
  /** XP earned within the current level span. */
  xpIntoLevel: number;
  /** XP needed to cross the current level span (0 at max level). */
  xpForLevelSpan: number;
  /** 0–1 fill ratio toward the next level (1 at max level). */
  ratio: number;
  isMaxLevel: boolean;
}

/** Progress within the current level toward the next, for XP bars. */
export function getXpProgressTowardNextLevel(
  experience: number,
  level: number
): WarriorXpProgress {
  if (level >= WARRIOR_LEVEL_CAP) {
    return {
      xpIntoLevel: 0,
      xpForLevelSpan: 0,
      ratio: 1,
      isMaxLevel: true,
    };
  }

  const levelFloor = XP_FOR_LEVEL[level - 1] ?? 0;
  const levelCeiling = XP_FOR_LEVEL[level] ?? levelFloor;
  const xpForLevelSpan = Math.max(levelCeiling - levelFloor, 1);
  const xpIntoLevel = Math.max(
    0,
    Math.min(experience - levelFloor, xpForLevelSpan)
  );

  return {
    xpIntoLevel,
    xpForLevelSpan,
    ratio: xpIntoLevel / xpForLevelSpan,
    isMaxLevel: false,
  };
}
