import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";
import {
  getTransformSpriteSheetPath,
  resolveTransformVariantIndex,
} from "./transformSprites";

const WOLF_BASE = "/WarriorPictures/PixelStyle/SpriteSheets";

describe("resolveTransformVariantIndex", () => {
  it("returns 1 for invalid or zero picture", () => {
    assert.equal(resolveTransformVariantIndex(0, 10), 1);
    assert.equal(resolveTransformVariantIndex(-3, 10), 1);
  });

  it("maps in-range pictures directly", () => {
    assert.equal(resolveTransformVariantIndex(1, 10), 1);
    assert.equal(resolveTransformVariantIndex(7, 10), 7);
    assert.equal(resolveTransformVariantIndex(10, 10), 10);
  });

  it("wraps overflow pictures with modulo", () => {
    assert.equal(resolveTransformVariantIndex(11, 10), 1);
    assert.equal(resolveTransformVariantIndex(15, 10), 5);
    assert.equal(resolveTransformVariantIndex(26, 10), 6);
  });
});

describe("getTransformSpriteSheetPath", () => {
  it("returns the wolf spritesheet matching warrior picture", () => {
    assert.equal(
      getTransformSpriteSheetPath(STATUS_EFFECT_KEY.transformWolf, 7),
      `${WOLF_BASE}/Wolf7.png`
    );
  });

  it("wraps to a valid wolf variant when picture exceeds variant count", () => {
    assert.equal(
      getTransformSpriteSheetPath(STATUS_EFFECT_KEY.transformWolf, 15),
      `${WOLF_BASE}/Wolf5.png`
    );
  });

  it("defaults to variant 1 for invalid picture", () => {
    assert.equal(
      getTransformSpriteSheetPath(STATUS_EFFECT_KEY.transformWolf, 0),
      `${WOLF_BASE}/Wolf1.png`
    );
  });

  it("returns the deer spritesheet matching warrior picture", () => {
    assert.equal(
      getTransformSpriteSheetPath(STATUS_EFFECT_KEY.transformDeer, 4),
      `${WOLF_BASE}/Deer4.png`
    );
  });

  it("wraps to a valid deer variant when picture exceeds variant count", () => {
    assert.equal(
      getTransformSpriteSheetPath(STATUS_EFFECT_KEY.transformDeer, 8),
      `${WOLF_BASE}/Deer2.png`
    );
  });

  it("returns undefined for unknown transforms", () => {
    assert.equal(getTransformSpriteSheetPath("unknown", 1), undefined);
  });
});
