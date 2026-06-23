import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { BattleMapConfig } from "./battleMaps";
import { resolveRetreatDestination } from "./resolveRetreatDestination";

const testMap: BattleMapConfig = {
  width: 6,
  height: 6,
};

describe("resolveRetreatDestination", () => {
  it("returns the tile one step away from the target", () => {
    const destination = resolveRetreatDestination({
      casterTile: "C3",
      targetTile: "D4",
      occupiedTiles: ["C3", "D4"],
      battleMap: testMap,
    });

    assert.equal(destination, "B2");
  });

  it("moves directly away on a straight line", () => {
    const destination = resolveRetreatDestination({
      casterTile: "B3",
      targetTile: "B4",
      occupiedTiles: ["B3", "B4"],
      battleMap: testMap,
    });

    assert.equal(destination, "B2");
  });

  it("returns null when the preferred retreat tile is blocked", () => {
    const destination = resolveRetreatDestination({
      casterTile: "C4",
      targetTile: "D4",
      occupiedTiles: ["C4", "D4"],
      battleMap: {
        ...testMap,
        blockedTiles: ["B4"],
      },
    });

    assert.equal(destination, null);
  });

  it("returns null when the preferred retreat tile is occupied", () => {
    const destination = resolveRetreatDestination({
      casterTile: "C4",
      targetTile: "D4",
      occupiedTiles: ["C4", "D4", "B4"],
      battleMap: testMap,
    });

    assert.equal(destination, null);
  });

  it("returns null when the preferred retreat tile is off the map", () => {
    const destination = resolveRetreatDestination({
      casterTile: "A1",
      targetTile: "B2",
      occupiedTiles: ["A1", "B2"],
      battleMap: testMap,
    });

    assert.equal(destination, null);
  });

  it("handles targets near map corners", () => {
    const destination = resolveRetreatDestination({
      casterTile: "B2",
      targetTile: "A1",
      occupiedTiles: ["B2", "A1"],
      battleMap: testMap,
    });

    assert.equal(destination, "C3");
  });
});
