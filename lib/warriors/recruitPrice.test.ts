import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateRecruitStatCost,
  calculateWarriorRecruitPrice,
  calculateWarriorStatRecruitValue,
  HIGH_VALUE_STAT_MULTIPLIER,
  RECRUIT_MIN_PRICE,
  recruitCostForPoint,
  recruitStatContribution,
} from "./recruitPrice";

const BASELINE_WARRIOR = {
  health: 1,
  mana: 1,
  strength: 1,
  stamina: 1,
  speed: 1,
  faith: 1,
  magicResistance: 1,
  attackRange: 1,
};

describe("recruitCostForPoint", () => {
  it("uses base cost at stat value zero", () => {
    assert.equal(recruitCostForPoint(0), 0.8);
  });

  it("adds level multiplier for higher stat values", () => {
    assert.equal(recruitCostForPoint(1), 1.1);
    assert.equal(recruitCostForPoint(10), 3.8);
  });
});

describe("recruitStatContribution", () => {
  it("returns zero at baseline stat value 1", () => {
    assert.equal(recruitStatContribution(1), 0);
  });

  it("sums per-point costs from baseline to target", () => {
    assert.equal(recruitStatContribution(2), recruitCostForPoint(1));
    assert.equal(
      recruitStatContribution(4),
      recruitCostForPoint(1) + recruitCostForPoint(2) + recruitCostForPoint(3)
    );
  });
});

describe("calculateRecruitStatCost", () => {
  it("returns zero when target is not higher than current", () => {
    assert.equal(calculateRecruitStatCost(5, 5), 0);
    assert.equal(calculateRecruitStatCost(5, 3), 0);
  });
});

describe("calculateWarriorStatRecruitValue", () => {
  it("ignores stats at baseline 1", () => {
    assert.equal(calculateWarriorStatRecruitValue(BASELINE_WARRIOR), 0);
  });

  it("values high stats progressively instead of averaging them down", () => {
    const specialist = {
      ...BASELINE_WARRIOR,
      health: 18,
      stamina: 15,
      strength: 12,
      speed: 8,
    };

    const dilutedAverageStyle = Math.round(
      (18 + 15 + 12 + 8 + 1 + 1 + 1 + 1) / 8
    );

    assert.ok(
      calculateWarriorStatRecruitValue(specialist) >
        dilutedAverageStyle * RECRUIT_MIN_PRICE
    );
  });

  it("applies the high-value multiplier to attackRange", () => {
    const rangeOne = calculateWarriorStatRecruitValue({
      ...BASELINE_WARRIOR,
      attackRange: 1,
    });
    const rangeTwo = calculateWarriorStatRecruitValue({
      ...BASELINE_WARRIOR,
      attackRange: 2,
    });

    assert.equal(rangeOne, 0);
    assert.equal(
      rangeTwo,
      recruitStatContribution(2) * HIGH_VALUE_STAT_MULTIPLIER
    );
  });

  it("includes magicResistance in pricing", () => {
    const withMagicResistance = calculateWarriorStatRecruitValue({
      ...BASELINE_WARRIOR,
      magicResistance: 15,
    });

    assert.equal(withMagicResistance, recruitStatContribution(15));
  });
});

describe("calculateWarriorRecruitPrice", () => {
  it("enforces the minimum recruit price", () => {
    assert.equal(
      calculateWarriorRecruitPrice(BASELINE_WARRIOR),
      RECRUIT_MIN_PRICE
    );
  });

  it("charges more for stronger warriors than weak ones", () => {
    const weakWarrior = {
      ...BASELINE_WARRIOR,
      health: 5,
    };
    const strongWarrior = {
      ...BASELINE_WARRIOR,
      health: 14,
      stamina: 12,
      strength: 8,
      speed: 5,
    };

    assert.ok(calculateWarriorRecruitPrice(weakWarrior) < 30);
    assert.ok(calculateWarriorRecruitPrice(strongWarrior) >= 45);
    assert.ok(
      calculateWarriorRecruitPrice(strongWarrior) >
        calculateWarriorRecruitPrice(weakWarrior)
    );
  });

  it("charges a premium for attackRange 2 over attackRange 1", () => {
    const archerRangeOne = {
      ...BASELINE_WARRIOR,
      health: 8,
      strength: 6,
      speed: 3,
      attackRange: 1,
    };
    const archerRangeTwo = {
      ...archerRangeOne,
      attackRange: 2,
    };

    assert.ok(
      calculateWarriorRecruitPrice(archerRangeTwo) >
        calculateWarriorRecruitPrice(archerRangeOne)
    );
  });

  it("adds spell premium before applying the global multiplier", () => {
    const warrior = {
      ...BASELINE_WARRIOR,
      health: 8,
    };

    assert.ok(
      calculateWarriorRecruitPrice(warrior, 1) >
        calculateWarriorRecruitPrice(warrior, 0)
    );
  });

  it("matches fixture prices for representative warriors", () => {
    assert.equal(
      calculateWarriorRecruitPrice({ ...BASELINE_WARRIOR, health: 5 }),
      12
    );
    assert.equal(
      calculateWarriorRecruitPrice({
        ...BASELINE_WARRIOR,
        health: 14,
        stamina: 12,
        strength: 8,
        speed: 5,
      }),
      55
    );
    assert.equal(
      calculateWarriorRecruitPrice({
        ...BASELINE_WARRIOR,
        health: 18,
        stamina: 15,
        strength: 12,
        speed: 8,
      }),
      90
    );
    assert.equal(
      calculateWarriorRecruitPrice({
        ...BASELINE_WARRIOR,
        health: 8,
        strength: 6,
        speed: 3,
        attackRange: 2,
      }),
      23
    );
  });
});
