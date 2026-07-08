import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateRecruitStatCost,
  calculateWarriorRecruitPrice,
  calculateWarriorReleaseGold,
  calculateWarriorStatRecruitValue,
  HIGH_VALUE_STAT_MULTIPLIER,
  RECRUIT_BASE_PRICE,
  RECRUIT_MIN_PRICE,
  RECRUIT_PRICE_MULTIPLIER,
  RECRUIT_SKILL_COST_PER_SKILL,
  RECRUIT_SPELL_COST_PER_SPELL,
  RECRUIT_STAT_BASE_COST,
  RECRUIT_STAT_LEVEL_MULTIPLIER,
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
  spellDamage: 1,
  attackRange: 1,
};

describe("recruitCostForPoint", () => {
  it("uses base cost at stat value zero", () => {
    assert.equal(recruitCostForPoint(0), RECRUIT_STAT_BASE_COST);
  });

  it("adds level multiplier for higher stat values", () => {
    assert.equal(
      recruitCostForPoint(1),
      RECRUIT_STAT_BASE_COST + RECRUIT_STAT_LEVEL_MULTIPLIER
    );
    assert.equal(
      recruitCostForPoint(10),
      RECRUIT_STAT_BASE_COST + 10 * RECRUIT_STAT_LEVEL_MULTIPLIER
    );
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

});

describe("calculateWarriorRecruitPrice", () => {
  function expectedRecruitPrice(
    warrior: typeof BASELINE_WARRIOR,
    spellCount = 0,
    skillCount = 0
  ): number {
    return Math.max(
      RECRUIT_MIN_PRICE,
      Math.round(
        (RECRUIT_BASE_PRICE +
          calculateWarriorStatRecruitValue(warrior) +
          spellCount * RECRUIT_SPELL_COST_PER_SPELL +
          skillCount * RECRUIT_SKILL_COST_PER_SKILL) *
          RECRUIT_PRICE_MULTIPLIER
      )
    );
  }

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

  it("adds spell and skill premiums before applying the global multiplier", () => {
    const warrior = {
      ...BASELINE_WARRIOR,
      health: 8,
    };

    assert.equal(
      calculateWarriorRecruitPrice(warrior, 2, 0),
      expectedRecruitPrice(warrior, 2, 0)
    );
    assert.equal(
      calculateWarriorRecruitPrice(warrior, 0, 2),
      expectedRecruitPrice(warrior, 0, 2)
    );
    assert.ok(
      calculateWarriorRecruitPrice(warrior, 2, 2) >
        calculateWarriorRecruitPrice(warrior, 0, 0)
    );
  });

  it("matches the recruit price formula for representative warriors", () => {
    const representativeWarriors = [
      { ...BASELINE_WARRIOR, health: 5 },
      {
        ...BASELINE_WARRIOR,
        health: 14,
        stamina: 12,
        strength: 8,
        speed: 5,
      },
      {
        ...BASELINE_WARRIOR,
        health: 18,
        stamina: 15,
        strength: 12,
        speed: 8,
      },
      {
        ...BASELINE_WARRIOR,
        health: 8,
        strength: 6,
        speed: 3,
        attackRange: 2,
      },
    ];

    for (const warrior of representativeWarriors) {
      assert.equal(calculateWarriorRecruitPrice(warrior), expectedRecruitPrice(warrior));
    }
  });
});

describe("calculateWarriorReleaseGold", () => {
  it("grants half the recruit price rounded to the nearest integer", () => {
    const warrior = {
      ...BASELINE_WARRIOR,
      health: 14,
      stamina: 12,
      strength: 8,
      speed: 5,
    };

    assert.equal(
      calculateWarriorReleaseGold(warrior),
      Math.round(calculateWarriorRecruitPrice(warrior) / 2)
    );
  });
});
