import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hasSwapTilesEffect } from "./swapTiles";

describe("hasSwapTilesEffect", () => {
  it("returns true for swapTiles effects", () => {
    assert.equal(hasSwapTilesEffect({ effectType: "swapTiles" }), true);
  });

  it("returns false for other effects", () => {
    assert.equal(hasSwapTilesEffect({ effectType: "leap" }), false);
    assert.equal(hasSwapTilesEffect(null), false);
    assert.equal(hasSwapTilesEffect(undefined), false);
  });
});
