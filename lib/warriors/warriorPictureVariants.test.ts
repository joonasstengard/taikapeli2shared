import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAvailableWarriorGenders,
  getWarriorPictureCount,
  hasWarriorPictures,
  WARRIOR_CLASSES,
  WARRIOR_GENDERS,
  WARRIOR_PICTURE_COUNT_OVERRIDES,
  type WarriorClassGenderKey,
} from "./warriorPictureVariants";
function comboKey(
  warriorClass: (typeof WARRIOR_CLASSES)[number],
  gender: (typeof WARRIOR_GENDERS)[number]
): WarriorClassGenderKey {
  return `${warriorClass}${gender}`;
}

describe("getWarriorPictureCount", () => {
  it("returns 0 for combos with no sprites", () => {
    for (const warriorClass of WARRIOR_CLASSES) {
      for (const gender of WARRIOR_GENDERS) {
        if (WARRIOR_PICTURE_COUNT_OVERRIDES[comboKey(warriorClass, gender)] !== 0) {
          continue;
        }
        assert.equal(getWarriorPictureCount(warriorClass, gender), 0);
      }
    }
  });

  it("returns a positive count for combos with sprites", () => {
    for (const warriorClass of WARRIOR_CLASSES) {
      for (const gender of WARRIOR_GENDERS) {
        const override = WARRIOR_PICTURE_COUNT_OVERRIDES[comboKey(warriorClass, gender)];
        if (override === undefined || override <= 0) {
          continue;
        }
        assert.ok(getWarriorPictureCount(warriorClass, gender) > 0);
      }
    }
  });
});

describe("hasWarriorPictures", () => {
  it("is true exactly when picture count is positive", () => {
    for (const warriorClass of WARRIOR_CLASSES) {
      for (const gender of WARRIOR_GENDERS) {
        const count = getWarriorPictureCount(warriorClass, gender);
        assert.equal(hasWarriorPictures(warriorClass, gender), count > 0);
      }
    }
  });
});

describe("getAvailableWarriorGenders", () => {
  it("lists only genders with sprites", () => {
    for (const warriorClass of WARRIOR_CLASSES) {
      const expected = WARRIOR_GENDERS.filter((gender) =>
        hasWarriorPictures(warriorClass, gender)
      );
      assert.deepEqual(getAvailableWarriorGenders(warriorClass), expected);
    }
  });
});

describe("WARRIOR_PICTURE_COUNT_OVERRIDES", () => {
  it("only contains valid class+gender keys", () => {
    const validKeys = new Set(
      WARRIOR_CLASSES.flatMap((warriorClass) =>
        WARRIOR_GENDERS.map((gender) => comboKey(warriorClass, gender))
      )
    );

    for (const key of Object.keys(WARRIOR_PICTURE_COUNT_OVERRIDES)) {
      assert.ok(validKeys.has(key as WarriorClassGenderKey), `invalid override key: ${key}`);
    }
  });
});
