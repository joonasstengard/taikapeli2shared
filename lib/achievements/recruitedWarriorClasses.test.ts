import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES } from "./achievementDefinitions";
import {
  addRecruitedWarriorClass,
  countDistinctRecruitedWarriorClasses,
  hasEnoughDistinctRecruitedWarriorClasses,
} from "./recruitedWarriorClasses";
import type { WarriorClass } from "../warriors/warriorPictureVariants";

const FIVE_DISTINCT_CLASSES = [
  "Knight",
  "Ranger",
  "Sorcerer",
  "Priestess",
  "Paladin",
] as const satisfies readonly WarriorClass[];

describe("addRecruitedWarriorClass", () => {
  it("adds the first recruited class to an empty list", () => {
    assert.deepEqual(addRecruitedWarriorClass([], "Knight"), ["Knight"]);
  });

  it("appends a new class without mutating the original list", () => {
    const existing = ["Knight"] as WarriorClass[];
    const updated = addRecruitedWarriorClass(existing, "Ranger");

    assert.deepEqual(updated, ["Knight", "Ranger"]);
    assert.deepEqual(existing, ["Knight"]);
  });

  it("does not duplicate classes when the same class is recruited again", () => {
    const existing = ["Knight", "Ranger"] as WarriorClass[];

    assert.deepEqual(addRecruitedWarriorClass(existing, "Knight"), existing);
    assert.deepEqual(addRecruitedWarriorClass(existing, "Ranger"), existing);
  });

  it("tracks distinct classes across many recruitments", () => {
    let recruitedClasses: WarriorClass[] = [];

    for (const warriorClass of [
      "Knight",
      "Knight",
      "Ranger",
      "Sorcerer",
      "Knight",
      "Priestess",
      "Paladin",
      "Ranger",
    ] as const) {
      recruitedClasses = addRecruitedWarriorClass(
        recruitedClasses,
        warriorClass
      );
    }

    assert.deepEqual(recruitedClasses, [
      "Knight",
      "Ranger",
      "Sorcerer",
      "Priestess",
      "Paladin",
    ]);
  });
});

describe("countDistinctRecruitedWarriorClasses", () => {
  it("returns zero for an empty list", () => {
    assert.equal(countDistinctRecruitedWarriorClasses([]), 0);
  });

  it("counts each class once even when duplicates are present", () => {
    assert.equal(
      countDistinctRecruitedWarriorClasses([
        "Knight",
        "Knight",
        "Ranger",
        "Ranger",
        "Sorcerer",
      ]),
      3
    );
  });

  it("counts five distinct classes for a diverse company roster", () => {
    assert.equal(
      countDistinctRecruitedWarriorClasses([...FIVE_DISTINCT_CLASSES]),
      DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES
    );
  });
});

describe("hasEnoughDistinctRecruitedWarriorClasses", () => {
  it("requires exactly five distinct classes for the diverse company goal", () => {
    const fourClasses = FIVE_DISTINCT_CLASSES.slice(0, 4);

    assert.equal(
      hasEnoughDistinctRecruitedWarriorClasses(
        fourClasses,
        DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES
      ),
      false
    );
    assert.equal(
      hasEnoughDistinctRecruitedWarriorClasses(
        [...FIVE_DISTINCT_CLASSES],
        DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES
      ),
      true
    );
  });

  it("still qualifies when duplicate recruits inflate the list length", () => {
    assert.equal(
      hasEnoughDistinctRecruitedWarriorClasses(
        [
          "Knight",
          "Ranger",
          "Sorcerer",
          "Priestess",
          "Paladin",
          "Knight",
          "Ranger",
        ],
        DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES
      ),
      true
    );
  });

  it("does not qualify when only four unique classes were ever recruited", () => {
    assert.equal(
      hasEnoughDistinctRecruitedWarriorClasses(
        ["Knight", "Knight", "Ranger", "Sorcerer", "Priestess", "Knight"],
        DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES
      ),
      false
    );
  });

  it("qualifies with more than five distinct classes", () => {
    assert.equal(
      hasEnoughDistinctRecruitedWarriorClasses(
        [...FIVE_DISTINCT_CLASSES, "Peasant"],
        DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES
      ),
      true
    );
  });
});

describe("diverse company campaign simulation", () => {
  it("unlocks after five distinct recruitments even with releases implied by later duplicates", () => {
    let recruitedClasses: WarriorClass[] = [];

    for (const warriorClass of [
      "Knight",
      "Ranger",
      "Sorcerer",
      "Priestess",
      "Paladin",
      "Knight",
    ] as const) {
      recruitedClasses = addRecruitedWarriorClass(
        recruitedClasses,
        warriorClass
      );
    }

    assert.equal(
      hasEnoughDistinctRecruitedWarriorClasses(
        recruitedClasses,
        DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES
      ),
      true
    );
    assert.equal(countDistinctRecruitedWarriorClasses(recruitedClasses), 5);
    assert.equal(recruitedClasses.length, 5);
  });

  it("stays locked when a campaign never recruits beyond four unique classes", () => {
    let recruitedClasses: WarriorClass[] = [];

    for (const warriorClass of [
      "Knight",
      "Ranger",
      "Sorcerer",
      "Priestess",
      "Knight",
      "Ranger",
    ] as const) {
      recruitedClasses = addRecruitedWarriorClass(
        recruitedClasses,
        warriorClass
      );
    }

    assert.equal(
      hasEnoughDistinctRecruitedWarriorClasses(
        recruitedClasses,
        DIVERSE_COMPANY_MIN_DISTINCT_WARRIOR_CLASSES
      ),
      false
    );
  });
});
