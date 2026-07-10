import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COMMON_WARRIOR_CLASSES } from "./warriorPictureVariants";
import {
  buildCommonWarriorSpritePool,
  getDailyHeaderWarriors,
  getUtcDateSeed,
  pickDailyHeaderWarriors,
} from "./dailyHeaderWarriors";

describe("buildCommonWarriorSpritePool", () => {
  it("includes only common warrior classes with valid sprites", () => {
    const pool = buildCommonWarriorSpritePool();
    const commonClasses = new Set<string>(COMMON_WARRIOR_CLASSES);

    assert.ok(pool.length > 0);
    assert.ok(
      pool.every(
        (sprite) => commonClasses.has(sprite.warriorClass) && sprite.picture >= 1
      )
    );
  });
});

describe("getUtcDateSeed", () => {
  it("returns YYYYMMDD in UTC", () => {
    const seed = getUtcDateSeed(new Date("2026-07-10T23:30:00+03:00"));

    assert.equal(seed, 20260710);
  });
});

describe("pickDailyHeaderWarriors", () => {
  it("returns two entries from different classes when possible", () => {
    const pool = buildCommonWarriorSpritePool();
    const [left, right] = pickDailyHeaderWarriors(pool, () => 0);

    assert.notEqual(left.warriorClass, right.warriorClass);
  });

  it("is deterministic for a fixed random source", () => {
    const pool = buildCommonWarriorSpritePool();
    const random = createDeterministicRandom([0.1, 0.2]);
    const firstPick = pickDailyHeaderWarriors(pool, random);
    const secondPick = pickDailyHeaderWarriors(
      pool,
      createDeterministicRandom([0.1, 0.2])
    );

    assert.deepEqual(firstPick, secondPick);
  });
});

describe("getDailyHeaderWarriors", () => {
  it("is stable for the same UTC date", () => {
    const date = new Date("2026-07-10T12:00:00Z");
    const firstPick = getDailyHeaderWarriors(date);
    const secondPick = getDailyHeaderWarriors(date);

    assert.deepEqual(firstPick, secondPick);
  });

  it("can change between UTC dates", () => {
    const july9 = getDailyHeaderWarriors(new Date("2026-07-09T12:00:00Z"));
    const july10 = getDailyHeaderWarriors(new Date("2026-07-10T12:00:00Z"));

    assert.notDeepEqual(july9, july10);
  });
});

function createDeterministicRandom(values: number[]) {
  let index = 0;
  return () => {
    const value = values[Math.min(index, values.length - 1)];
    index += 1;
    return value;
  };
}
