import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAvailableWarriorGenders,
  getWarriorPictureCount,
  hasWarriorPictures,
} from "./warriorPictureVariants";

describe("getWarriorPictureCount", () => {
  it("returns 0 for combos explicitly set to no sprites", () => {
    assert.equal(getWarriorPictureCount("Knight", "Female"), 0);
    assert.equal(getWarriorPictureCount("Monk", "Male"), 0);
    assert.equal(getWarriorPictureCount("Sorcerer", "Female"), 0);
    assert.equal(getWarriorPictureCount("Necromancer", "Female"), 0);
  });

  it("returns override counts for specific combos", () => {
    assert.equal(getWarriorPictureCount("Knight", "Male"), 4);
    assert.equal(getWarriorPictureCount("Horseman", "Male"), 9);
    assert.equal(getWarriorPictureCount("Marksman", "Male"), 9);
    assert.equal(getWarriorPictureCount("Monk", "Female"), 6);
    assert.equal(getWarriorPictureCount("Paladin", "Male"), 9);
    assert.equal(getWarriorPictureCount("Sorcerer", "Male"), 10);
    assert.equal(getWarriorPictureCount("Necromancer", "Male"), 6);
  });
});

describe("hasWarriorPictures", () => {
  it("returns false when picture count is 0", () => {
    assert.equal(hasWarriorPictures("Knight", "Female"), false);
    assert.equal(hasWarriorPictures("Monk", "Male"), false);
  });

  it("returns true when picture count is positive", () => {
    assert.equal(hasWarriorPictures("Knight", "Male"), true);
    assert.equal(hasWarriorPictures("Horseman", "Male"), true);
    assert.equal(hasWarriorPictures("Marksman", "Male"), true);
    assert.equal(hasWarriorPictures("Monk", "Female"), true);
    assert.equal(hasWarriorPictures("Paladin", "Male"), true);
    assert.equal(hasWarriorPictures("Necromancer", "Male"), true);
  });
});

describe("getAvailableWarriorGenders", () => {
  it("excludes genders with no sprites", () => {
    assert.deepEqual(getAvailableWarriorGenders("Knight"), ["Male"]);
    assert.deepEqual(getAvailableWarriorGenders("Horseman"), ["Male"]);
    assert.deepEqual(getAvailableWarriorGenders("Marksman"), ["Male"]);
    assert.deepEqual(getAvailableWarriorGenders("Monk"), ["Female"]);
    assert.deepEqual(getAvailableWarriorGenders("Paladin"), ["Male"]);
    assert.deepEqual(getAvailableWarriorGenders("Sorcerer"), ["Male"]);
    assert.deepEqual(getAvailableWarriorGenders("Ranger"), ["Male"]);
    assert.deepEqual(getAvailableWarriorGenders("Necromancer"), ["Male"]);
  });
});
