import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hasTeleportEffect } from "./teleport";

describe("hasTeleportEffect", () => {
  it("detects teleport effects", () => {
    assert.equal(hasTeleportEffect({ effectType: "teleport" }), true);
    assert.equal(hasTeleportEffect({ effectType: "leap" }), false);
    assert.equal(hasTeleportEffect(null), false);
    assert.equal(hasTeleportEffect(undefined), false);
  });
});
