import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSpriteBackgroundPosition } from "./spriteFrame";

describe("getSpriteBackgroundPosition", () => {
  it("uses 1-based top-left and bottom-right corners", () => {
    assert.equal(getSpriteBackgroundPosition(1, 1, 6, 4), "0% 0%");
    assert.equal(getSpriteBackgroundPosition(6, 4, 6, 4), "100% 100%");
  });

  it("centers intermediate spell frames on variable-width sheets", () => {
    assert.equal(getSpriteBackgroundPosition(8, 6, 8, 9), "100% 62.5%");
  });

  it("keeps a scaled frame centered", () => {
    assert.equal(
      getSpriteBackgroundPosition(1, 1, 6, 4, 1.5),
      "3.125% 5%"
    );
    assert.equal(
      getSpriteBackgroundPosition(6, 4, 6, 4, 1.5),
      "96.875% 95%"
    );
  });

  it("supports single-row spritesheets without invalid background positions", () => {
    assert.equal(getSpriteBackgroundPosition(1, 1, 6, 1), "0% 0%");
    assert.equal(getSpriteBackgroundPosition(6, 1, 6, 1), "100% 0%");
    assert.equal(getSpriteBackgroundPosition(3, 1, 6, 1), "40% 0%");
  });
});
