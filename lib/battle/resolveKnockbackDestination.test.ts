import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { BattleMapConfig } from "./battleMaps";
import { resolveKnockbackDestination } from "./resolveKnockbackDestination";

const testMap: BattleMapConfig = {
  width: 6,
  height: 6,
};

describe("resolveKnockbackDestination", () => {
  it("returns the tile one step away from the caster beyond the target", () => {
    const destination = resolveKnockbackDestination({
      casterTile: "C3",
      targetTile: "D4",
      occupiedTiles: ["C3", "D4"],
      battleMap: testMap,
    });

    assert.equal(destination, "E5");
  });

  it("pushes directly away on a straight line", () => {
    const destination = resolveKnockbackDestination({
      casterTile: "B3",
      targetTile: "B4",
      occupiedTiles: ["B3", "B4"],
      battleMap: testMap,
    });

    assert.equal(destination, "B5");
  });

  it("returns null when the preferred knockback tile is blocked", () => {
    const destination = resolveKnockbackDestination({
      casterTile: "C4",
      targetTile: "D4",
      occupiedTiles: ["C4", "D4"],
      battleMap: {
        ...testMap,
        blockedTiles: ["E4"],
      },
    });

    assert.equal(destination, null);
  });

  it("returns null when the preferred knockback tile is occupied", () => {
    const destination = resolveKnockbackDestination({
      casterTile: "C4",
      targetTile: "D4",
      occupiedTiles: ["C4", "D4", "E4"],
      battleMap: testMap,
    });

    assert.equal(destination, null);
  });

  it("returns null when the preferred knockback tile is off the map", () => {
    const destination = resolveKnockbackDestination({
      casterTile: "B2",
      targetTile: "A1",
      occupiedTiles: ["B2", "A1"],
      battleMap: testMap,
    });

    assert.equal(destination, null);
  });

  it("handles targets with no room to be pushed", () => {
    const destination = resolveKnockbackDestination({
      casterTile: "A1",
      targetTile: "B2",
      occupiedTiles: ["A1", "B2", "C3"],
      battleMap: testMap,
    });

    assert.equal(destination, null);
  });
});
