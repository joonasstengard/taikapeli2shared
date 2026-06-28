import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_EFFECT_KEY } from "./statusEffectTypes";
import {
  getEffectiveSpeed,
  getEffectiveStrength,
  resolveCombatStats,
} from "./resolveCombatStats";

describe("resolveCombatStats", () => {
  const baseWarrior = {
    strength: 7,
    speed: 4,
    faith: 2,
    spellDamage: 3,
  };

  it("returns base stats when there are no active effects", () => {
    const result = resolveCombatStats(baseWarrior, []);

    assert.deepEqual(result.base, baseWarrior);
    assert.deepEqual(result.effective, baseWarrior);
    assert.deepEqual(result.bonuses, {});
  });

  it("applies wolf form stat bonuses", () => {
    const result = resolveCombatStats(baseWarrior, [
      {
        effectKey: STATUS_EFFECT_KEY.transformWolf,
        turnsRemaining: 3,
      },
    ]);

    assert.equal(result.effective.strength, 12);
    assert.equal(result.effective.speed, 9);
    assert.equal(result.bonuses.strength, 5);
    assert.equal(result.bonuses.speed, 5);
  });

  it("ignores expired effects", () => {
    assert.equal(
      getEffectiveStrength(baseWarrior, [
        {
          effectKey: STATUS_EFFECT_KEY.transformWolf,
          turnsRemaining: 0,
        },
      ]),
      7
    );
  });

  it("uses effective speed for turn order helpers", () => {
    assert.equal(
      getEffectiveSpeed(baseWarrior, [
        {
          effectKey: STATUS_EFFECT_KEY.transformWolf,
          turnsRemaining: 2,
        },
      ]),
      9
    );
  });
});
