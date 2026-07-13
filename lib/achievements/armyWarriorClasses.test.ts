import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GHOST_WARRIOR_REQUIRED_CLASS } from "./achievementDefinitions";
import {
  extractWarriorClasses,
  hasWarriorClassInArmy,
  resolvePlayerWarriorClassesForAchievements,
} from "./armyWarriorClasses";

describe("extractWarriorClasses", () => {
  it("returns an empty array when the army has no warriors", () => {
    assert.deepEqual(extractWarriorClasses([]), []);
  });

  it("maps warrior rows to their classes in roster order", () => {
    assert.deepEqual(
      extractWarriorClasses([
        { warriorClass: "Knight" },
        { warriorClass: "Infiltrator" },
        { warriorClass: "Ranger" },
      ]),
      ["Knight", "Infiltrator", "Ranger"]
    );
  });

  it("does not mutate the source warrior list", () => {
    const warriors = [{ warriorClass: "Infiltrator" }];
    const classes = extractWarriorClasses(warriors);

    assert.deepEqual(classes, ["Infiltrator"]);
    assert.deepEqual(warriors, [{ warriorClass: "Infiltrator" }]);
  });
});

describe("resolvePlayerWarriorClassesForAchievements", () => {
  it("returns undefined when there is no active player army", () => {
    assert.equal(
      resolvePlayerWarriorClassesForAchievements(false, [
        { warriorClass: "Infiltrator" },
      ]),
      undefined
    );
  });

  it("returns an empty array when the player army exists but has no warriors", () => {
    assert.deepEqual(
      resolvePlayerWarriorClassesForAchievements(true, []),
      []
    );
  });

  it("returns warrior classes when the player army exists", () => {
    assert.deepEqual(
      resolvePlayerWarriorClassesForAchievements(true, [
        { warriorClass: "Infiltrator" },
        { warriorClass: "Knight" },
      ]),
      ["Infiltrator", "Knight"]
    );
  });
});

describe("hasWarriorClassInArmy", () => {
  it("returns false for an empty roster", () => {
    assert.equal(
      hasWarriorClassInArmy([], GHOST_WARRIOR_REQUIRED_CLASS),
      false
    );
  });

  it("returns true when the required class is present", () => {
    assert.equal(
      hasWarriorClassInArmy(["Knight", "Infiltrator"], GHOST_WARRIOR_REQUIRED_CLASS),
      true
    );
  });

  it("returns true when only an Infiltrator is on the roster", () => {
    assert.equal(
      hasWarriorClassInArmy(["Infiltrator"], GHOST_WARRIOR_REQUIRED_CLASS),
      true
    );
  });

  it("returns false when the roster has other classes but not the required one", () => {
    assert.equal(
      hasWarriorClassInArmy(
        ["Knight", "Ranger", "Sorcerer"],
        GHOST_WARRIOR_REQUIRED_CLASS
      ),
      false
    );
  });
});
