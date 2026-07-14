import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BLOCKED_OBJECTS,
  getBlockedObjectSpriteSheetPath,
  isBlockedObjectSpriteSheet,
} from "./blockedObjectConfig";

describe("BLOCKED_OBJECTS", () => {
  it("configures Campfire as a single-row spritesheet", () => {
    const config = BLOCKED_OBJECTS.campfire;
    assert.equal(isBlockedObjectSpriteSheet(config), true);
    if (!isBlockedObjectSpriteSheet(config)) {
      return;
    }

    assert.equal(config.fileName, "Campfire.png");
    assert.equal(config.row, 1);
    assert.equal(config.frames, 6);
    assert.equal(config.columns, 6);
    assert.equal(config.sheetRows, 1);
  });

  it("resolves blocked object spritesheet paths under /objects/SpriteSheets", () => {
    assert.equal(
      getBlockedObjectSpriteSheetPath("Campfire.png"),
      "/objects/SpriteSheets/Campfire.png"
    );
  });
});
