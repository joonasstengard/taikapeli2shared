import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getWarriorPictureCount,
  hasWarriorPictures,
  WARRIOR_CLASSES,
  WARRIOR_GENDERS,
} from "./warriorPictureVariants";
import {
  formatWarriorClassLabel,
  getWarriorRace,
  WARRIOR_RACES,
} from "./warriorRaces";
import {
  getShiningWarriorSpritesForClass,
  getWarriorShiningSprite,
  isShiningWarriorSprite,
  SHINING_WARRIOR_ROLL_CHANCE,
  WARRIOR_SHINING_SPRITES,
  type WarriorShiningSprite,
} from "./warriorShiningSprites";

const SHINING_PICTURE = 999;

function shiningSpriteKey(sprite: WarriorShiningSprite): string {
  return `${sprite.warriorClass}${sprite.gender}${sprite.picture}`;
}

function expectedSpriteSheetPath(sprite: WarriorShiningSprite): string {
  return `/WarriorPictures/PixelStyle/SpriteSheets/${sprite.warriorClass}${sprite.gender}${sprite.picture}.png`;
}

describe("SHINING_WARRIOR_ROLL_CHANCE", () => {
  it("uses a one-in-one-thousand shining roll chance", () => {
    assert.equal(SHINING_WARRIOR_ROLL_CHANCE, 0.001);
  });
});

describe("WARRIOR_SHINING_SPRITES configuration", () => {
  it("defines exactly one shining variant per warrior class", () => {
    assert.equal(WARRIOR_SHINING_SPRITES.length, WARRIOR_CLASSES.length);

    for (const warriorClass of WARRIOR_CLASSES) {
      assert.deepEqual(
        getShiningWarriorSpritesForClass(warriorClass).map((sprite) => ({
          warriorClass: sprite.warriorClass,
          race: sprite.race,
          gender: sprite.gender,
          picture: sprite.picture,
        })),
        WARRIOR_SHINING_SPRITES.filter(
          (sprite) => sprite.warriorClass === warriorClass
        ),
        warriorClass
      );
    }
  });

  it("only contains valid class, gender, and race values", () => {
    for (const sprite of WARRIOR_SHINING_SPRITES) {
      assert.ok(WARRIOR_CLASSES.includes(sprite.warriorClass));
      assert.ok(WARRIOR_GENDERS.includes(sprite.gender));
      assert.ok(WARRIOR_RACES.includes(sprite.race));
    }
  });

  it("uses picture 999 for every shining spritesheet", () => {
    for (const sprite of WARRIOR_SHINING_SPRITES) {
      assert.equal(sprite.picture, SHINING_PICTURE, shiningSpriteKey(sprite));
    }
  });

  it("has unique class+gender+picture combinations", () => {
    const seen = new Set<string>();
    for (const sprite of WARRIOR_SHINING_SPRITES) {
      const key = shiningSpriteKey(sprite);
      assert.ok(!seen.has(key), `duplicate shining sprite key: ${key}`);
      seen.add(key);
    }
  });

  it("only references genders that have base warrior sprites", () => {
    for (const sprite of WARRIOR_SHINING_SPRITES) {
      assert.equal(
        hasWarriorPictures(sprite.warriorClass, sprite.gender),
        true,
        shiningSpriteKey(sprite)
      );
    }
  });

  it("uses a picture index outside the normal sprite range", () => {
    for (const sprite of WARRIOR_SHINING_SPRITES) {
      const normalPictureCount = getWarriorPictureCount(
        sprite.warriorClass,
        sprite.gender
      );
      assert.ok(
        sprite.picture > normalPictureCount,
        `${shiningSpriteKey(sprite)} should be outside 1..${normalPictureCount}`
      );
    }
  });
});

describe("shining sprite lookup helpers", () => {
  for (const sprite of WARRIOR_SHINING_SPRITES) {
    it(`recognizes ${sprite.warriorClass} ${sprite.gender} picture ${sprite.picture}`, () => {
      assert.deepEqual(getShiningWarriorSpritesForClass(sprite.warriorClass), [
        sprite,
      ]);
      assert.deepEqual(getWarriorShiningSprite(
        sprite.warriorClass,
        sprite.gender,
        sprite.picture
      ), sprite);
      assert.equal(
        isShiningWarriorSprite(
          sprite.warriorClass,
          sprite.gender,
          sprite.picture
        ),
        true
      );
      assert.equal(getWarriorRace(
        sprite.warriorClass,
        sprite.gender,
        sprite.picture
      ), sprite.race);
      assert.equal(
        formatWarriorClassLabel(
          sprite.warriorClass,
          sprite.gender,
          sprite.picture
        ),
        `${sprite.race} ${sprite.warriorClass}`
      );
    });
  }

  it("does not treat normal picture indices as shining", () => {
    for (const sprite of WARRIOR_SHINING_SPRITES) {
      assert.equal(
        isShiningWarriorSprite(sprite.warriorClass, sprite.gender, 1),
        false,
        shiningSpriteKey(sprite)
      );
    }
  });

  it("does not treat the wrong gender as shining", () => {
    for (const sprite of WARRIOR_SHINING_SPRITES) {
      const wrongGender = sprite.gender === "Male" ? "Female" : "Male";
      if (!hasWarriorPictures(sprite.warriorClass, wrongGender)) {
        assert.equal(
          isShiningWarriorSprite(
            sprite.warriorClass,
            wrongGender,
            sprite.picture
          ),
          false,
          shiningSpriteKey(sprite)
        );
      }
    }
  });

  it("maps each shining sprite to the expected spritesheet path", () => {
    for (const sprite of WARRIOR_SHINING_SPRITES) {
      assert.equal(
        expectedSpriteSheetPath(sprite),
        `/WarriorPictures/PixelStyle/SpriteSheets/${sprite.warriorClass}${sprite.gender}${SHINING_PICTURE}.png`
      );
    }
  });
});

describe("non-default shining races", () => {
  it("overrides normal race lookup for out-of-range shining pictures", () => {
    assert.equal(getWarriorRace("Marksman", "Male", 999), "Dwarf");
    assert.equal(getWarriorRace("Moonblade", "Male", 999), "Elf");
    assert.equal(getWarriorRace("Ranger", "Male", 999), "Orc");
    assert.equal(getWarriorRace("Shaman", "Male", 999), "Orc");
    assert.equal(getWarriorRace("Ranger", "Male", 99), "Human");
  });

  it("formats non-human shining warriors with the configured race label", () => {
    assert.equal(formatWarriorClassLabel("Marksman", "Male", 999), "Dwarf Marksman");
    assert.equal(formatWarriorClassLabel("Moonblade", "Male", 999), "Elf Moonblade");
    assert.equal(formatWarriorClassLabel("Ranger", "Male", 999), "Orc Ranger");
    assert.equal(formatWarriorClassLabel("Shaman", "Male", 999), "Orc Shaman");
    assert.equal(formatWarriorClassLabel("Priestess", "Female", 999), "Human Priestess");
  });
});
