import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_ELO_RATING,
  ELO_K_FACTOR,
  applyRatingDelta,
  expectedScore,
  ratingDelta,
} from "./elo";

describe("expectedScore", () => {
  it("is 0.5 for equal ratings", () => {
    assert.equal(expectedScore(1000, 1000), 0.5);
  });

  it("favors the higher-rated player", () => {
    assert.ok(expectedScore(1200, 1000) > 0.5);
    assert.ok(expectedScore(1000, 1200) < 0.5);
  });
});

describe("ratingDelta", () => {
  it("gives ±16 for equal ratings at K=32", () => {
    assert.equal(ratingDelta(1000, 1000, 1), 16);
    assert.equal(ratingDelta(1000, 1000, 0), -16);
  });

  it("rewards underdogs more for a win", () => {
    const upsetWin = ratingDelta(1000, 1200, 1);
    const favoriteWin = ratingDelta(1200, 1000, 1);
    assert.ok(upsetWin > favoriteWin);
    assert.equal(upsetWin, 24);
    assert.equal(favoriteWin, 8);
  });

  it("uses DEFAULT_ELO_RATING and ELO_K_FACTOR constants", () => {
    assert.equal(DEFAULT_ELO_RATING, 1000);
    assert.equal(ELO_K_FACTOR, 32);
    assert.equal(
      applyRatingDelta(DEFAULT_ELO_RATING, ratingDelta(1000, 1000, 1)),
      1016
    );
  });
});
