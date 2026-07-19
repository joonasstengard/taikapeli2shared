import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  WARRIOR_LEVEL_CAP,
  XP_FOR_LEVEL,
  getXpProgressTowardNextLevel,
} from "./xpConstants";

describe("getXpProgressTowardNextLevel", () => {
  it("starts empty at level 1 with zero XP", () => {
    const progress = getXpProgressTowardNextLevel(0, 1);
    assert.equal(progress.xpIntoLevel, 0);
    assert.equal(progress.xpForLevelSpan, XP_FOR_LEVEL[1]);
    assert.equal(progress.ratio, 0);
    assert.equal(progress.isMaxLevel, false);
  });

  it("fills within the current level span", () => {
    const progress = getXpProgressTowardNextLevel(XP_FOR_LEVEL[1] + 10, 2);
    assert.equal(progress.xpIntoLevel, 10);
    assert.equal(progress.xpForLevelSpan, XP_FOR_LEVEL[2] - XP_FOR_LEVEL[1]);
    assert.equal(progress.ratio, 10 / (XP_FOR_LEVEL[2] - XP_FOR_LEVEL[1]));
    assert.equal(progress.isMaxLevel, false);
  });

  it("is full at max level", () => {
    const progress = getXpProgressTowardNextLevel(
      XP_FOR_LEVEL[WARRIOR_LEVEL_CAP - 1],
      WARRIOR_LEVEL_CAP
    );
    assert.equal(progress.ratio, 1);
    assert.equal(progress.isMaxLevel, true);
  });
});
