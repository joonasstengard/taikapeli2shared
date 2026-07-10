import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SPELL_SPRITE_BY_ID } from "./spellSpriteConfig";
import { SPELL_ID } from "./spellIds";

describe("SPELL_SPRITE_BY_ID", () => {
  it("uses 1-based rows within the 9-row spell sheet layout", () => {
    for (const config of Object.values(SPELL_SPRITE_BY_ID)) {
      assert.ok(config.row >= 1 && config.row <= 9);
      assert.ok(config.frames >= 1);
    }
  });

  it("keeps a single frame count per spritesheet filename", () => {
    const framesByFileName = new Map<string, number>();

    for (const config of Object.values(SPELL_SPRITE_BY_ID)) {
      const existing = framesByFileName.get(config.fileName);
      if (existing === undefined) {
        framesByFileName.set(config.fileName, config.frames);
        continue;
      }

      assert.equal(
        existing,
        config.frames,
        `Conflicting frame counts for ${config.fileName}`
      );
    }
  });

  it("configures Chain Lightning with its dedicated spritesheet", () => {
    assert.deepEqual(SPELL_SPRITE_BY_ID[SPELL_ID.chainLightning], {
      fileName: "195.png",
      row: 6,
      frames: 14,
    });
  });
});
