import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { WARRIOR_CLASSES } from "./warriorPictureVariants";
import { getWarriorStageTheme } from "./warriorStageThemes";

describe("getWarriorStageTheme", () => {
  it("returns race-specific backgrounds for distinct races", () => {
    const humanKnight = getWarriorStageTheme({
      warriorClass: "Knight",
      gender: "Male",
      picture: 1,
    });
    const orcBerserker = getWarriorStageTheme({
      warriorClass: "Berserker",
      gender: "Male",
      picture: 8,
    });
    const elfMoonblade = getWarriorStageTheme({
      warriorClass: "Moonblade",
      gender: "Male",
      picture: 1,
    });

    assert.notEqual(humanKnight.background, orcBerserker.background);
    assert.notEqual(humanKnight.background, elfMoonblade.background);
  });

  it("returns class-specific spotlight accents", () => {
    const sorcerer = getWarriorStageTheme({
      warriorClass: "Sorcerer",
      gender: "Male",
      picture: 1,
    });
    const knight = getWarriorStageTheme({
      warriorClass: "Knight",
      gender: "Male",
      picture: 1,
    });

    assert.notEqual(sorcerer.spotlight, knight.spotlight);
    assert.match(sorcerer.spotlight, /168,\s*132,\s*220/);
  });

  it("covers every warrior class with a theme", () => {
    for (const warriorClass of WARRIOR_CLASSES) {
      const theme = getWarriorStageTheme({
        warriorClass,
        gender: "Male",
        picture: 1,
      });

      assert.match(theme.background, /linear-gradient/);
      assert.match(theme.spotlight, /radial-gradient/);
      assert.ok(theme.groundShadow.length > 0);
      assert.ok(theme.spriteGlow.length > 0);
      assert.ok(theme.borderInset.length > 0);
    }
  });
});
