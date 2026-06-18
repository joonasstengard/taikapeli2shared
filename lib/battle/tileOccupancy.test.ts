import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAliveOccupiedBattleTiles,
  isWarriorAliveOnBattleMap,
} from "./tileOccupancy";

describe("tileOccupancy", () => {
  it("treats warriors with zero health as not occupying a tile", () => {
    assert.equal(
      isWarriorAliveOnBattleMap({
        currentHealth: 0,
        battleTileCurrent: "B2",
      }),
      false
    );
  });

  it("returns only alive warrior tiles", () => {
    assert.deepEqual(
      getAliveOccupiedBattleTiles([
        { currentHealth: 0, battleTileCurrent: "A1" },
        { currentHealth: 5, battleTileCurrent: "B2" },
        { currentHealth: 3, battleTileCurrent: null },
      ]),
      ["B2"]
    );
  });
});
