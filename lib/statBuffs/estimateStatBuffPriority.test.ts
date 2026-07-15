import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";
import {
  canApplyTransformToTarget,
  estimateEnemyStatDebuffPriorityBonus,
  estimateInlineStatBuffPriority,
  estimateInlineStatDebuffPriority,
  estimateStatBuffInstancePriority,
  estimateStatDebuffInstancePriority,
  getStatBuffFromEffect,
  getStatDebuffFromEffect,
  hasMatchingActiveStatBuff,
  STAT_DEBUFF_PRIORITY_SCALE,
  sumWeightedStatDebuffPoints,
  statModifiersMatch,
} from "./estimateStatBuffPriority";
import {
  hasNegativeStatModifiers,
  sumStatBuffBonuses,
} from "./sumStatBuffBonuses";
import { resolveCombatStats } from "../statusEffects/resolveCombatStats";

describe("getStatBuffFromEffect", () => {
  it("detects inline applyStatBuff effects", () => {
    assert.deepEqual(
      getStatBuffFromEffect({
        effectType: "applyStatBuff",
        duration: 2,
        statModifiers: { strength: 3 },
      }),
      {
        statModifiers: { strength: 3 },
        duration: 2,
      }
    );
  });

  it("detects applyTransform with linked transform key", () => {
    assert.deepEqual(
      getStatBuffFromEffect({
        effectType: "applyTransform",
        statusKey: STATUS_EFFECT_KEY.transformWolf,
        duration: 3,
        statModifiers: { strength: 5, speed: 5 },
      }),
      {
        statModifiers: { strength: 5, speed: 5 },
        duration: 3,
        linkedTransformKey: STATUS_EFFECT_KEY.transformWolf,
      }
    );
  });

  it("ignores non-stat effects", () => {
    assert.equal(
      getStatBuffFromEffect({
        effectType: "applyStatus",
        statusKey: STATUS_EFFECT_KEY.frozen,
        duration: 1,
      }),
      null
    );
  });

  it("ignores negative-only applyStatBuff effects", () => {
    assert.equal(
      getStatBuffFromEffect({
        effectType: "applyStatBuff",
        duration: 1,
        statModifiers: { speed: -8 },
      }),
      null
    );
  });
});

describe("getStatDebuffFromEffect", () => {
  it("detects negative applyStatBuff effects", () => {
    assert.deepEqual(
      getStatDebuffFromEffect({
        effectType: "applyStatBuff",
        duration: 1,
        statModifiers: { speed: -8 },
      }),
      {
        statModifiers: { speed: -8 },
        duration: 1,
      }
    );
  });

  it("ignores positive-only applyStatBuff effects", () => {
    assert.equal(
      getStatDebuffFromEffect({
        effectType: "applyStatBuff",
        duration: 2,
        statModifiers: { strength: 3 },
      }),
      null
    );
  });

  it("ignores non-stat effects and invalid durations", () => {
    assert.equal(
      getStatDebuffFromEffect({
        effectType: "applyStatus",
        statusKey: STATUS_EFFECT_KEY.frozen,
        duration: 1,
      }),
      null
    );
    assert.equal(
      getStatDebuffFromEffect({
        effectType: "applyStatBuff",
        duration: 0,
        statModifiers: { strength: -5 },
      }),
      null
    );
  });
});

describe("hasNegativeStatModifiers", () => {
  it("detects negative modifiers and ignores positive-only sets", () => {
    assert.equal(hasNegativeStatModifiers({ speed: -8 }), true);
    assert.equal(hasNegativeStatModifiers({ strength: 3 }), false);
    assert.equal(hasNegativeStatModifiers(undefined), false);
  });
});

describe("sumStatBuffBonuses", () => {
  it("stacks multiple active buff instances", () => {
    const bonuses = sumStatBuffBonuses([
      { turnsRemaining: 2, statModifiers: { strength: 3 } },
      { turnsRemaining: 1, statModifiers: { strength: 2, speed: 1 } },
    ]);

    assert.deepEqual(bonuses, { strength: 5, speed: 1 });
  });

  it("ignores expired buff instances", () => {
    const bonuses = sumStatBuffBonuses([
      { turnsRemaining: 0, statModifiers: { strength: 10 } },
      { turnsRemaining: 2, statModifiers: { strength: 3 } },
    ]);

    assert.deepEqual(bonuses, { strength: 3 });
  });
});

describe("resolveCombatStats with stat buffs", () => {
  const baseWarrior = {
    strength: 7,
    speed: 4,
    faith: 2,
    spellDamage: 3,
  };

  it("combines status and stat buff bonuses", () => {
    const result = resolveCombatStats(
      baseWarrior,
      [],
      [{ turnsRemaining: 2, statModifiers: { strength: 3, speed: 1 } }]
    );

    assert.equal(result.effective.strength, 10);
    assert.equal(result.effective.speed, 5);
    assert.equal(result.bonuses.strength, 3);
  });

  it("does not read transform stats from status definitions", () => {
    const result = resolveCombatStats(baseWarrior, [
      {
        effectKey: STATUS_EFFECT_KEY.transformWolf,
        turnsRemaining: 3,
      },
    ]);

    assert.deepEqual(result.effective, baseWarrior);
    assert.deepEqual(result.bonuses, {});
  });

  it("applies wolf combat stats when provided as stat buffs", () => {
    const result = resolveCombatStats(
      baseWarrior,
      [{ effectKey: STATUS_EFFECT_KEY.transformWolf, turnsRemaining: 3 }],
      [{ turnsRemaining: 3, statModifiers: { strength: 5, speed: 5 } }]
    );

    assert.equal(result.effective.strength, 12);
    assert.equal(result.effective.speed, 9);
  });
});

describe("estimateInlineStatBuffPriority", () => {
  it("values battle cry strength buff over its duration", () => {
    const priority = estimateInlineStatBuffPriority({ strength: 3 }, 2, {});
    assert.equal(priority, 9);
  });

  it("values wolf form over its duration", () => {
    const priority = estimateInlineStatBuffPriority(
      { strength: 5, speed: 5 },
      3,
      { linkedTransformKey: STATUS_EFFECT_KEY.transformWolf }
    );
    assert.equal(priority, 41);
  });

  it("returns null when target is already transformed", () => {
    assert.equal(
      estimateInlineStatBuffPriority(
        { strength: 5, speed: 5 },
        3,
        {
          linkedTransformKey: STATUS_EFFECT_KEY.transformWolf,
          targetStatusEffects: [
            {
              effectKey: STATUS_EFFECT_KEY.transformWolf,
              turnsRemaining: 1,
            },
          ],
        }
      ),
      null
    );
  });

  it("scales down offensive stats when combat multiplier is reduced", () => {
    const full = estimateInlineStatBuffPriority(
      { strength: 5, speed: 5 },
      3,
      { combatOffenseMultiplier: 1 }
    );
    const reduced = estimateInlineStatBuffPriority(
      { strength: 5, speed: 5 },
      3,
      { combatOffenseMultiplier: 0.4 }
    );

    assert.equal(full, 41);
    assert.equal(reduced, 27);
  });
});

describe("canApplyTransformToTarget", () => {
  it("blocks when any transform is active", () => {
    assert.equal(
      canApplyTransformToTarget(STATUS_EFFECT_KEY.transformWolf, [
        {
          effectKey: STATUS_EFFECT_KEY.transformWolf,
          turnsRemaining: 2,
        },
      ]),
      false
    );
  });

  it("allows when no transform is active", () => {
    assert.equal(canApplyTransformToTarget(STATUS_EFFECT_KEY.transformWolf, []), true);
  });
});

describe("statModifiersMatch", () => {
  it("matches identical stat modifier sets", () => {
    assert.equal(
      statModifiersMatch({ strength: 3 }, { strength: 3 }),
      true
    );
  });

  it("does not match different stat modifier sets", () => {
    assert.equal(
      statModifiersMatch({ strength: 3 }, { strength: 5 }),
      false
    );
  });
});

describe("hasMatchingActiveStatBuff", () => {
  it("detects an active buff with the same modifiers", () => {
    assert.equal(
      hasMatchingActiveStatBuff({ strength: 3 }, [
        { turnsRemaining: 2, statModifiers: { strength: 3 } },
      ]),
      true
    );
  });

  it("ignores expired buffs", () => {
    assert.equal(
      hasMatchingActiveStatBuff({ strength: 3 }, [
        { turnsRemaining: 0, statModifiers: { strength: 3 } },
      ]),
      false
    );
  });
});

describe("estimateStatBuffInstancePriority", () => {
  it("returns null when the same stat buff is already active", () => {
    assert.equal(
      estimateStatBuffInstancePriority(
        { strength: 3 },
        5,
        [{ turnsRemaining: 3, statModifiers: { strength: 3 } }]
      ),
      null
    );
  });

  it("still values a new buff when no matching buff is active", () => {
    assert.equal(
      estimateStatBuffInstancePriority({ strength: 3 }, 5, []),
      23
    );
  });

  it("still uses transform status checks for linked transforms", () => {
    assert.equal(
      estimateStatBuffInstancePriority(
        { strength: 5, speed: 5 },
        3,
        [],
        {
          linkedTransformKey: STATUS_EFFECT_KEY.transformWolf,
          targetStatusEffects: [
            {
              effectKey: STATUS_EFFECT_KEY.transformWolf,
              turnsRemaining: 1,
            },
          ],
        }
      ),
      null
    );
  });
});

describe("estimateInlineStatDebuffPriority", () => {
  it("values knee crack speed debuff modestly for its duration", () => {
    const priority = estimateInlineStatDebuffPriority({ speed: -8 }, 1);
    assert.equal(priority, Math.round(8 * 1.2 * STAT_DEBUFF_PRIORITY_SCALE));
    assert.equal(priority, 3);
  });

  it("values skull crack strength debuff modestly for its duration", () => {
    const priority = estimateInlineStatDebuffPriority({ strength: -5 }, 1);
    assert.equal(priority, Math.round(5 * 1.5 * STAT_DEBUFF_PRIORITY_SCALE));
    assert.equal(priority, 3);
  });

  it("scales with duration", () => {
    assert.equal(estimateInlineStatDebuffPriority({ strength: -5 }, 2), 5);
  });

  it("scores below an equivalent ally buff of the same magnitude", () => {
    const buffPriority = estimateInlineStatBuffPriority({ strength: 5 }, 1);
    const debuffPriority = estimateInlineStatDebuffPriority({ strength: -5 }, 1);

    assert.ok(buffPriority !== null && debuffPriority !== null);
    assert.ok(debuffPriority < buffPriority);
    assert.equal(buffPriority, 8);
    assert.equal(debuffPriority, 3);
  });

  it("returns null for positive-only modifiers or invalid duration", () => {
    assert.equal(estimateInlineStatDebuffPriority({ strength: 5 }, 1), null);
    assert.equal(estimateInlineStatDebuffPriority({ strength: -5 }, 0), null);
  });
});

describe("sumWeightedStatDebuffPoints", () => {
  it("only counts negative modifiers", () => {
    assert.equal(
      sumWeightedStatDebuffPoints({ strength: -5, speed: 4 }),
      5 * 1.5 * STAT_DEBUFF_PRIORITY_SCALE
    );
  });
});

describe("estimateStatDebuffInstancePriority", () => {
  it("returns null when the same debuff is already active", () => {
    assert.equal(
      estimateStatDebuffInstancePriority(
        { speed: -8 },
        1,
        [{ turnsRemaining: 1, statModifiers: { speed: -8 } }]
      ),
      null
    );
  });

  it("still values a new debuff when no matching debuff is active", () => {
    assert.equal(
      estimateStatDebuffInstancePriority({ speed: -8 }, 1, []),
      3
    );
  });

  it("ignores expired matching debuffs", () => {
    assert.equal(
      estimateStatDebuffInstancePriority(
        { strength: -5 },
        1,
        [{ turnsRemaining: 0, statModifiers: { strength: -5 } }]
      ),
      3
    );
  });
});

describe("estimateEnemyStatDebuffPriorityBonus", () => {
  it("returns the knee crack / skull crack bonuses from effects", () => {
    assert.equal(
      estimateEnemyStatDebuffPriorityBonus(
        {
          effectType: "applyStatBuff",
          duration: 1,
          statModifiers: { speed: -8 },
        },
        undefined
      ),
      3
    );
    assert.equal(
      estimateEnemyStatDebuffPriorityBonus(
        {
          effectType: "applyStatBuff",
          duration: 1,
          statModifiers: { strength: -5 },
        },
        undefined
      ),
      3
    );
  });

  it("returns 0 when the matching debuff is already active", () => {
    assert.equal(
      estimateEnemyStatDebuffPriorityBonus(
        {
          effectType: "applyStatBuff",
          duration: 1,
          statModifiers: { speed: -8 },
        },
        [{ turnsRemaining: 1, statModifiers: { speed: -8 } }]
      ),
      0
    );
  });

  it("returns 0 for positive buffs and non-stat effects", () => {
    assert.equal(
      estimateEnemyStatDebuffPriorityBonus(
        {
          effectType: "applyStatBuff",
          duration: 2,
          statModifiers: { strength: 3 },
        },
        undefined
      ),
      0
    );
    assert.equal(estimateEnemyStatDebuffPriorityBonus(null, undefined), 0);
  });
});
