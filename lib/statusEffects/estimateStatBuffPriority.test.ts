import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_EFFECT_KEY } from "./statusEffectTypes";
import {
  canApplyStatBuffToTarget,
  estimateStatBuffPriority,
  getApplyStatusStatBuff,
  hasActiveTransformStatus,
} from "./estimateStatBuffPriority";

describe("getApplyStatusStatBuff", () => {
  it("detects stat-buff applyStatus effects", () => {
    assert.deepEqual(
      getApplyStatusStatBuff({
        effectType: "applyStatus",
        statusKey: STATUS_EFFECT_KEY.transformWolf,
        duration: 3,
      }),
      {
        statusKey: STATUS_EFFECT_KEY.transformWolf,
        duration: 3,
      }
    );
  });

  it("ignores debuff status effects", () => {
    assert.equal(
      getApplyStatusStatBuff({
        effectType: "applyStatus",
        statusKey: STATUS_EFFECT_KEY.frozen,
        duration: 1,
      }),
      null
    );
  });
});

describe("canApplyStatBuffToTarget", () => {
  it("blocks transform when the target is already transformed", () => {
    assert.equal(
      canApplyStatBuffToTarget(STATUS_EFFECT_KEY.transformWolf, 3, [
        {
          effectKey: STATUS_EFFECT_KEY.transformWolf,
          turnsRemaining: 2,
        },
      ]),
      false
    );

    assert.equal(hasActiveTransformStatus([
      {
        effectKey: STATUS_EFFECT_KEY.transformWolf,
        turnsRemaining: 1,
      },
    ]), true);
  });

  it("allows transform when no transform is active", () => {
    assert.equal(
      canApplyStatBuffToTarget(STATUS_EFFECT_KEY.transformWolf, 3, []),
      true
    );
  });
});

describe("estimateStatBuffPriority", () => {
  it("values wolf form highly over its duration", () => {
    const priority = estimateStatBuffPriority(
      STATUS_EFFECT_KEY.transformWolf,
      3,
      []
    );

    assert.equal(priority, 41);
  });

  it("returns null when the target is already transformed", () => {
    assert.equal(
      estimateStatBuffPriority(STATUS_EFFECT_KEY.transformWolf, 3, [
        {
          effectKey: STATUS_EFFECT_KEY.transformWolf,
          turnsRemaining: 1,
        },
      ]),
      null
    );
  });

  it("scales down offensive stats when combat multiplier is reduced", () => {
    const full = estimateStatBuffPriority(
      STATUS_EFFECT_KEY.transformWolf,
      3,
      [],
      { combatOffenseMultiplier: 1 }
    );
    const reduced = estimateStatBuffPriority(
      STATUS_EFFECT_KEY.transformWolf,
      3,
      [],
      { combatOffenseMultiplier: 0.4 }
    );

    assert.equal(full, 41);
    assert.equal(reduced, 27);
  });
});
