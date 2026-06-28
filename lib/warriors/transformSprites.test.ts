import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";
import { getTransformSpriteSheetPath } from "./transformSprites";

describe("getTransformSpriteSheetPath", () => {
  it("returns the shared wolf spritesheet path", () => {
    assert.equal(
      getTransformSpriteSheetPath(STATUS_EFFECT_KEY.transformWolf),
      "/WarriorPictures/PixelStyle/SpriteSheets/Wolf1.png"
    );
  });

  it("returns undefined for unknown transforms", () => {
    assert.equal(getTransformSpriteSheetPath("unknown"), undefined);
  });
});
