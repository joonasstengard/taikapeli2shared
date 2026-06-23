import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getHorizontalAdjacentTileIds } from "./tileAdjacency";

describe("getHorizontalAdjacentTileIds", () => {
  it("returns left and right tiles on the same row", () => {
    assert.deepEqual(getHorizontalAdjacentTileIds("C3", 5), ["B3", "D3"]);
  });

  it("returns only the right tile on the left edge", () => {
    assert.deepEqual(getHorizontalAdjacentTileIds("A2", 5), ["B2"]);
  });

  it("returns only the left tile on the right edge", () => {
    assert.deepEqual(getHorizontalAdjacentTileIds("E4", 5), ["D4"]);
  });

  it("returns no tiles for invalid tile ids", () => {
    assert.deepEqual(getHorizontalAdjacentTileIds("Z9", 5), []);
    assert.deepEqual(getHorizontalAdjacentTileIds("", 5), []);
  });
});
