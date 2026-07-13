import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ARCANE_MYSTERIES_MIN_SPELL_PURCHASES } from "./achievementDefinitions";
import { hasEnoughSpellPurchases } from "./spellPurchaseCount";

describe("hasEnoughSpellPurchases", () => {
  it("returns true when the purchase count meets the minimum", () => {
    assert.equal(hasEnoughSpellPurchases(3, 3), true);
    assert.equal(hasEnoughSpellPurchases(4, 3), true);
    assert.equal(hasEnoughSpellPurchases(10, 3), true);
  });

  it("returns false when the purchase count is below the minimum", () => {
    assert.equal(hasEnoughSpellPurchases(0, 3), false);
    assert.equal(hasEnoughSpellPurchases(1, 3), false);
    assert.equal(hasEnoughSpellPurchases(2, 3), false);
  });

  it("counts total purchases, not distinct spells", () => {
    assert.equal(hasEnoughSpellPurchases(2, 3), false);
    assert.equal(hasEnoughSpellPurchases(3, 3), true);
  });

  it("uses the arcane mysteries threshold constant", () => {
    assert.equal(
      hasEnoughSpellPurchases(
        ARCANE_MYSTERIES_MIN_SPELL_PURCHASES,
        ARCANE_MYSTERIES_MIN_SPELL_PURCHASES
      ),
      true
    );
    assert.equal(
      hasEnoughSpellPurchases(
        ARCANE_MYSTERIES_MIN_SPELL_PURCHASES - 1,
        ARCANE_MYSTERIES_MIN_SPELL_PURCHASES
      ),
      false
    );
  });
});
