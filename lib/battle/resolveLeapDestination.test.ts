import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { BattleMapConfig } from "./battleMaps";
import { resolveLeapDestination } from "./resolveLeapDestination";

const testMap: BattleMapConfig = {
  width: 6,
  height: 6,
};

describe("resolveLeapDestination", () => {
  it("returns the adjacent tile between caster and target", () => {
    const destination = resolveLeapDestination({
      casterTile: "A1",
      targetTile: "D4",
      occupiedTiles: ["A1", "D4"],
      battleMap: testMap,
    });

    assert.equal(destination, "C3");
  });

  it("prefers the tile on the line between caster and target", () => {
    const destination = resolveLeapDestination({
      casterTile: "B2",
      targetTile: "B4",
      occupiedTiles: ["B2", "B4"],
      battleMap: testMap,
    });

    assert.equal(destination, "B3");
  });

  it("returns null when the preferred landing tile is blocked", () => {
    const destination = resolveLeapDestination({
      casterTile: "A4",
      targetTile: "D4",
      occupiedTiles: ["A4", "D4"],
      battleMap: {
        ...testMap,
        blockedTiles: ["C4"],
      },
    });

    assert.equal(destination, null);
  });

  it("returns null when the preferred landing tile is occupied", () => {
    const destination = resolveLeapDestination({
      casterTile: "A4",
      targetTile: "D4",
      occupiedTiles: ["A4", "D4", "C4"],
      battleMap: testMap,
    });

    assert.equal(destination, null);
  });

  it("returns null when the preferred landing tile is unavailable", () => {
    const destination = resolveLeapDestination({
      casterTile: "A1",
      targetTile: "C3",
      occupiedTiles: ["A1", "B2", "C3"],
      battleMap: testMap,
    });

    assert.equal(destination, null);
  });

  it("returns null when caster is already adjacent to target", () => {
    const destination = resolveLeapDestination({
      casterTile: "C3",
      targetTile: "D4",
      occupiedTiles: ["C3", "D4"],
      battleMap: testMap,
    });

    assert.equal(destination, null);
  });

  it("handles targets near map corners", () => {
    const destination = resolveLeapDestination({
      casterTile: "D4",
      targetTile: "A1",
      occupiedTiles: ["D4", "A1"],
      battleMap: testMap,
    });

    assert.equal(destination, "B2");
  });
});
