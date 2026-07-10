import {
  COMMON_WARRIOR_CLASSES,
  getAvailableWarriorGenders,
  getWarriorPictureCount,
} from "./warriorPictureVariants";
import type { WarriorSpriteConfig } from "./warriorSpriteConfig";

/** UTC calendar date as YYYYMMDD for stable daily seeding. */
export function getUtcDateSeed(date: Date): number {
  return (
    date.getUTCFullYear() * 10000 +
    (date.getUTCMonth() + 1) * 100 +
    date.getUTCDate()
  );
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildCommonWarriorSpritePool(): WarriorSpriteConfig[] {
  const pool: WarriorSpriteConfig[] = [];

  for (const warriorClass of COMMON_WARRIOR_CLASSES) {
    for (const gender of getAvailableWarriorGenders(warriorClass)) {
      const pictureCount = getWarriorPictureCount(warriorClass, gender);
      for (let picture = 1; picture <= pictureCount; picture++) {
        pool.push({ warriorClass, gender, picture });
      }
    }
  }

  return pool;
}

export function pickDailyHeaderWarriors(
  pool: readonly WarriorSpriteConfig[],
  random: () => number
): [WarriorSpriteConfig, WarriorSpriteConfig] {
  if (pool.length < 2) {
    throw new Error("Warrior sprite pool must contain at least two entries");
  }

  const leftIndex = Math.floor(random() * pool.length);
  const left = pool[leftIndex];

  const rightCandidates = pool.filter(
    (sprite) => sprite.warriorClass !== left.warriorClass
  );
  const rightPool =
    rightCandidates.length > 0
      ? rightCandidates
      : pool.filter((_, index) => index !== leftIndex);

  const right = rightPool[Math.floor(random() * rightPool.length)];

  return [left, right];
}

export function getDailyHeaderWarriors(
  date: Date = new Date()
): [WarriorSpriteConfig, WarriorSpriteConfig] {
  const pool = buildCommonWarriorSpritePool();
  const random = createSeededRandom(getUtcDateSeed(date));
  return pickDailyHeaderWarriors(pool, random);
}
