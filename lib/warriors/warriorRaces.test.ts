import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  WARRIOR_CLASSES,
  WARRIOR_GENDERS,
  getWarriorPictureCount,
  type WarriorClassGenderKey,
} from "./warriorPictureVariants";
import {
  DEFAULT_WARRIOR_RACE,
  formatWarriorClassLabel,
  formatWarriorClassLabelForWarrior,
  getWarriorRace,
  getExpectedPictureRaceRanges,
  validatePictureRaceRanges,
  WARRIOR_PICTURE_RACE_RANGES,
} from "./warriorRaces";

function comboKey(
  warriorClass: (typeof WARRIOR_CLASSES)[number],
  gender: (typeof WARRIOR_GENDERS)[number]
): WarriorClassGenderKey {
  return `${warriorClass}${gender}`;
}

describe("getWarriorRace", () => {
  it("returns Human for unlisted class+gender combos", () => {
    assert.equal(getWarriorRace("Knight", "Male", 5), "Human");
    assert.equal(getWarriorRace("Paladin", "Male", 1), "Human");
  });

  it("maps ChargerMale picture ranges to Human and Orc", () => {
    assert.equal(getWarriorRace("Charger", "Male", 1), "Human");
    assert.equal(getWarriorRace("Charger", "Male", 9), "Human");
    assert.equal(getWarriorRace("Charger", "Male", 10), "Orc");
    assert.equal(getWarriorRace("Charger", "Male", 13), "Orc");
  });

  it("maps Elven classes to Elf", () => {
    assert.equal(getWarriorRace("Moonblade", "Male", 3), "Elf");
    assert.equal(getWarriorRace("Ranger", "Male", 5), "Elf");
  });

  it("maps BerserkerMale picture ranges to Orc", () => {
    assert.equal(getWarriorRace("Berserker", "Male", 1), "Orc");
    assert.equal(getWarriorRace("Berserker", "Male", 4), "Orc");
  });

  it("falls back to Human for out-of-range pictures on configured combos", () => {
    assert.equal(getWarriorRace("Charger", "Male", 0), DEFAULT_WARRIOR_RACE);
    assert.equal(getWarriorRace("Charger", "Male", 99), DEFAULT_WARRIOR_RACE);
  });
});

describe("formatWarriorClassLabel", () => {
  it("uses full race + class labels", () => {
    assert.equal(formatWarriorClassLabel("Knight", "Male", 1), "Human Knight");
    assert.equal(formatWarriorClassLabel("Charger", "Male", 10), "Orc Charger");
    assert.equal(formatWarriorClassLabel("Moonblade", "Male", 2), "Elven Moonblade");
  });

  it("formats from a warrior object", () => {
    assert.equal(
      formatWarriorClassLabelForWarrior({
        warriorClass: "Charger",
        gender: "Male",
        picture: 9,
      }),
      "Human Charger"
    );
  });
});

describe("WARRIOR_PICTURE_RACE_RANGES coverage", () => {
  it("only contains valid class+gender keys", () => {
    const validKeys = new Set(
      WARRIOR_CLASSES.flatMap((warriorClass) =>
        WARRIOR_GENDERS.map((gender) => comboKey(warriorClass, gender))
      )
    );

    for (const key of Object.keys(WARRIOR_PICTURE_RACE_RANGES)) {
      assert.ok(validKeys.has(key as WarriorClassGenderKey), `invalid key: ${key}`);
    }
  });

  it("covers every picture index 1..N for combos with sprites", () => {
    for (const warriorClass of WARRIOR_CLASSES) {
      for (const gender of WARRIOR_GENDERS) {
        const pictureCount = getWarriorPictureCount(warriorClass, gender);
        const ranges = getExpectedPictureRaceRanges(
          warriorClass,
          gender,
          pictureCount
        );

        assert.ok(
          validatePictureRaceRanges(ranges, pictureCount),
          `invalid race ranges for ${warriorClass}${gender} (count=${pictureCount})`
        );
      }
    }
  });

  it("assigns a race to every valid picture index", () => {
    for (const warriorClass of WARRIOR_CLASSES) {
      for (const gender of WARRIOR_GENDERS) {
        const pictureCount = getWarriorPictureCount(warriorClass, gender);
        for (let picture = 1; picture <= pictureCount; picture++) {
          const race = getWarriorRace(warriorClass, gender, picture);
          assert.ok(race, `${warriorClass}${gender} picture ${picture} has no race`);
        }
      }
    }
  });
});
