import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getEmptyAbilityTilesInRange,
  isValidEmptyAbilityTile,
} from "./emptyAbilityTile";

const map = { width: 4, height: 4, blockedTiles: ["B2"] };

describe("emptyAbilityTile", () => {
  it("rejects caster tile, blocked tiles, occupied tiles, and out-of-range tiles", () => {
    assert.equal(
      isValidEmptyAbilityTile({
        casterTile: "A1",
        targetTile: "A1",
        range: 2,
        battleMap: map,
        occupiedTiles: ["A1"],
      }),
      false
    );

    assert.equal(
      isValidEmptyAbilityTile({
        casterTile: "A1",
        targetTile: "B2",
        range: 2,
        battleMap: map,
        occupiedTiles: ["A1"],
      }),
      false
    );

    assert.equal(
      isValidEmptyAbilityTile({
        casterTile: "A1",
        targetTile: "C1",
        range: 2,
        battleMap: map,
        occupiedTiles: ["A1", "C1"],
      }),
      false
    );

    assert.equal(
      isValidEmptyAbilityTile({
        casterTile: "A1",
        targetTile: "D4",
        range: 2,
        battleMap: map,
        occupiedTiles: ["A1"],
      }),
      false
    );
  });

  it("accepts empty unblocked tiles in range", () => {
    assert.equal(
      isValidEmptyAbilityTile({
        casterTile: "A1",
        targetTile: "A2",
        range: 2,
        battleMap: map,
        occupiedTiles: ["A1", "C3"],
      }),
      true
    );
  });

  it("lists empty tiles in range", () => {
    const tiles = getEmptyAbilityTilesInRange({
      casterTile: "A1",
      range: 1,
      battleMap: { width: 3, height: 3 },
      occupiedTiles: ["A1", "B1"],
    });

    assert.deepEqual(tiles.sort(), ["A2", "B2"].sort());
  });
});
