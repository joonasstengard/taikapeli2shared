import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateTrainingCost,
  trainingCostForPoint,
} from "./trainingCost";

describe("trainingCostForPoint", () => {
  it("uses base cost at stat value zero", () => {
    assert.equal(trainingCostForPoint(0), 5);
  });

  it("adds level multiplier for higher stat values", () => {
    assert.equal(trainingCostForPoint(10), 15);
    assert.equal(trainingCostForPoint(20), 25);
  });
});

describe("calculateTrainingCost", () => {
  it("returns zero when target is not higher than current", () => {
    assert.equal(calculateTrainingCost(10, 10), 0);
    assert.equal(calculateTrainingCost(10, 8), 0);
  });

  it("sums per-point costs across the training range", () => {
    assert.equal(calculateTrainingCost(0, 1), 5);
    assert.equal(calculateTrainingCost(0, 3), 5 + 6 + 7);
    assert.equal(
      calculateTrainingCost(10, 12),
      trainingCostForPoint(10) + trainingCostForPoint(11)
    );
  });
});
