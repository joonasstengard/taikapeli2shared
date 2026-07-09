import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";
import {
  canApplyTransformToTarget,
  estimateInlineStatBuffPriority,
  estimateStatBuffInstancePriority,
  getStatBuffFromEffect,
  hasMatchingActiveStatBuff,
  statModifiersMatch,
} from "./estimateStatBuffPriority";
import { sumStatBuffBonuses } from "./sumStatBuffBonuses";
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
