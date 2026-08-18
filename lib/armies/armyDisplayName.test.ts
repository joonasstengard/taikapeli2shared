import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PLAYER_ARMY_NATION_PLACEHOLDER,
  armyDisplayName,
  withArmyDisplayName,
} from "./armyDisplayName";

describe("armyDisplayName", () => {
  it("uses the username for human player armies", () => {
    assert.equal(
      armyDisplayName(
        { isPlayerArmy: true, nation: PLAYER_ARMY_NATION_PLACEHOLDER },
        "Joona"
      ),
      "Joona"
    );
  });

  it("keeps the flavor nation for computer armies", () => {
    assert.equal(
      armyDisplayName({ isPlayerArmy: false, nation: "Thornwall" }, "Joona"),
      "Thornwall"
    );
  });

  it("treats a missing isPlayerArmy flag as a computer army", () => {
    assert.equal(
      armyDisplayName({ nation: "Ashenwood" }, "Joona"),
      "Ashenwood"
    );
  });
});

describe("withArmyDisplayName", () => {
  it("replaces nation with the resolved display name", () => {
    assert.deepEqual(
      withArmyDisplayName(
        { id: 7, isPlayerArmy: true, nation: PLAYER_ARMY_NATION_PLACEHOLDER },
        "Joona"
      ),
      { id: 7, isPlayerArmy: true, nation: "Joona" }
    );
  });
});
