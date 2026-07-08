import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateTrainingCost,
  TRAINING_BASE_COST,
  TRAINING_LEVEL_MULTIPLIER,
  trainingCostForPoint,
} from "./trainingCost";

describe("trainingCostForPoint", () => {
  it("uses base cost at stat value zero", () => {
    assert.equal(trainingCostForPoint(0), TRAINING_BASE_COST);
  });

  it("adds level multiplier for higher stat values", () => {
    assert.equal(
      trainingCostForPoint(10),
      TRAINING_BASE_COST + 10 * TRAINING_LEVEL_MULTIPLIER
    );
    assert.equal(
      trainingCostForPoint(20),
      TRAINING_BASE_COST + 20 * TRAINING_LEVEL_MULTIPLIER
    );
  });
});

describe("calculateTrainingCost", () => {
  it("returns zero when target is not higher than current", () => {
    assert.equal(calculateTrainingCost(10, 10), 0);
    assert.equal(calculateTrainingCost(10, 8), 0);
  });

  it("sums per-point costs across the training range", () => {
    assert.equal(calculateTrainingCost(0, 1), TRAINING_BASE_COST);
    assert.equal(
      calculateTrainingCost(0, 3),
      trainingCostForPoint(0) + trainingCostForPoint(1) + trainingCostForPoint(2)
    );
    assert.equal(
      calculateTrainingCost(10, 12),
      trainingCostForPoint(10) + trainingCostForPoint(11)
    );
  });
});
