import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";
import {
  canUseBleedingRequiredAbilityOnTarget,
  isWarriorBleeding,
  requiresBleedingTarget,
} from "./requiresBleedingTarget";

describe("requiresBleedingTarget", () => {
  it("detects the requiresBleeding effect", () => {
    assert.equal(requiresBleedingTarget({ effectType: "requiresBleeding" }), true);
    assert.equal(requiresBleedingTarget({ effectType: "leap" }), false);
    assert.equal(requiresBleedingTarget(null), false);
  });
});

describe("isWarriorBleeding", () => {
  it("returns true only when bleeding has turns remaining", () => {
    assert.equal(
      isWarriorBleeding([
        { effectKey: STATUS_EFFECT_KEY.bleeding, turnsRemaining: 2 },
      ]),
      true
    );
    assert.equal(
      isWarriorBleeding([
        { effectKey: STATUS_EFFECT_KEY.bleeding, turnsRemaining: 0 },
      ]),
      false
    );
    assert.equal(isWarriorBleeding([]), false);
  });
});

describe("canUseBleedingRequiredAbilityOnTarget", () => {
  const bleedingEffect = { effectType: "requiresBleeding" as const };

  it("allows any target when the ability has no bleeding requirement", () => {
    assert.equal(
      canUseBleedingRequiredAbilityOnTarget({ effectType: "leap" }, []),
      true
    );
  });

  it("blocks non-bleeding targets for bleeding-required abilities", () => {
    assert.equal(canUseBleedingRequiredAbilityOnTarget(bleedingEffect, []), false);
    assert.equal(
      canUseBleedingRequiredAbilityOnTarget(bleedingEffect, [
        { effectKey: STATUS_EFFECT_KEY.frozen, turnsRemaining: 1 },
      ]),
      false
    );
    assert.equal(
      canUseBleedingRequiredAbilityOnTarget(bleedingEffect, [
        { effectKey: STATUS_EFFECT_KEY.bleeding, turnsRemaining: 1 },
      ]),
      true
    );
  });
});
