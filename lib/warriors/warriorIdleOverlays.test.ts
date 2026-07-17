import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getWarriorIdleOverlaySheetPath } from "./warriorIdleOverlays";

describe("getWarriorIdleOverlaySheetPath", () => {
  it("resolves SorcererMale overlay paths for pictures 1–10", () => {
    assert.equal(
      getWarriorIdleOverlaySheetPath({
        warriorClass: "Sorcerer",
        gender: "Male",
        picture: 1,
      }),
      "/WarriorPictures/PixelStyle/SpriteSheets/IdleOverlays/SorcererMale1IdleOverlay1.png"
    );
    assert.equal(
      getWarriorIdleOverlaySheetPath({
        warriorClass: "Sorcerer",
        gender: "Male",
        picture: 10,
      }),
      "/WarriorPictures/PixelStyle/SpriteSheets/IdleOverlays/SorcererMale10IdleOverlay1.png"
    );
  });

  it("returns null for classes or pictures without overlays", () => {
    assert.equal(
      getWarriorIdleOverlaySheetPath({
        warriorClass: "Knight",
        gender: "Male",
        picture: 1,
      }),
      null
    );
    assert.equal(
      getWarriorIdleOverlaySheetPath({
        warriorClass: "Sorcerer",
        gender: "Male",
        picture: 11,
      }),
      null
    );
    assert.equal(
      getWarriorIdleOverlaySheetPath({
        warriorClass: "Sorcerer",
        gender: "Male",
        picture: 999,
      }),
      null
    );
  });
});
