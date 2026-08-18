import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NATION_NAMES, pickUniqueNationNames } from "./nations";

describe("pickUniqueNationNames", () => {
  it("returns the requested number of unique names", () => {
    const names = pickUniqueNationNames(7, () => 0.99);
    assert.equal(names.length, 7);
    assert.equal(new Set(names).size, 7);
    for (const name of names) {
      assert.ok((NATION_NAMES as readonly string[]).includes(name));
    }
  });

  it("rejects a count larger than the name bank", () => {
    assert.throws(() => pickUniqueNationNames(NATION_NAMES.length + 1));
  });
});
