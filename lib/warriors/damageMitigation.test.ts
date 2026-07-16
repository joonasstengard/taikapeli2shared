import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyArmorMitigation,
  applyDefenseMitigation,
  applyResistanceMitigation,
  DEFENSE_CONSTANT,
  MIN_DAMAGE_AFTER_MITIGATION,
} from "./damageMitigation";

/** Layer 0 reference: same soft curve the production helper must match. */
function expectedMitigatedDamage(rawDamage: number, defense: number): number {
  if (rawDamage <= 0) {
    return 0;
  }

  const clampedDefense = Math.max(0, defense);
  if (clampedDefense <= 0) {
    return rawDamage;
  }

  return Math.max(
    MIN_DAMAGE_AFTER_MITIGATION,
    Math.floor(
      (rawDamage * DEFENSE_CONSTANT) / (DEFENSE_CONSTANT + clampedDefense)
    )
  );
}

const MATRIX_RAW_VALUES = [1, 5, 10, 15] as const;
const MATRIX_DEFENSE_VALUES = [0, 5, 10, 20, 30, 50] as const;

describe("applyDefenseMitigation — Layer 0 formula lock", () => {
  it("locks the defense constant and chip floor", () => {
    assert.equal(DEFENSE_CONSTANT, 40);
    assert.equal(MIN_DAMAGE_AFTER_MITIGATION, 1);
  });

  it("returns zero when raw damage is zero or negative", () => {
    assert.equal(applyDefenseMitigation(0, 20), 0);
    assert.equal(applyDefenseMitigation(-1, 20), 0);
    assert.equal(applyDefenseMitigation(-5, 50), 0);
    assert.equal(applyDefenseMitigation(0, 0), 0);
  });

  it("passes through raw damage when defense is zero or negative", () => {
    assert.equal(applyDefenseMitigation(10, 0), 10);
    assert.equal(applyDefenseMitigation(15, 0), 15);
    assert.equal(applyDefenseMitigation(1, 0), 1);
    assert.equal(applyDefenseMitigation(10, -1), 10);
    assert.equal(applyDefenseMitigation(10, -3), 10);
    assert.equal(applyDefenseMitigation(7, -100), 7);
  });

  it("never reduces positive damage below the minimum chip", () => {
    assert.equal(applyDefenseMitigation(1, 50), MIN_DAMAGE_AFTER_MITIGATION);
    assert.equal(applyDefenseMitigation(1, 10), MIN_DAMAGE_AFTER_MITIGATION);
    assert.equal(applyDefenseMitigation(2, 200), MIN_DAMAGE_AFTER_MITIGATION);
    assert.equal(applyDefenseMitigation(3, 10_000), MIN_DAMAGE_AFTER_MITIGATION);
  });

  it("matches the full defense × raw matrix (0/5/10/20/30/50 × 1/5/10/15)", () => {
    for (const raw of MATRIX_RAW_VALUES) {
      for (const defense of MATRIX_DEFENSE_VALUES) {
        const expected = expectedMitigatedDamage(raw, defense);
        assert.equal(
          applyDefenseMitigation(raw, defense),
          expected,
          `raw=${raw} defense=${defense}`
        );
        if (raw > 0) {
          assert.ok(
            applyDefenseMitigation(raw, defense) >= MIN_DAMAGE_AFTER_MITIGATION,
            `positive raw must never mitigate to 0 (raw=${raw}, defense=${defense})`
          );
        }
      }
    }
  });

  it("locks design-doc acceptance anchors", () => {
    // Warrior with armor 20 vs skill dealing 15 raw → 10
    assert.equal(applyDefenseMitigation(15, 20), 10);
    // Same warrior vs spell 15 raw with resistance 1 → floor(15*40/41) = 14
    assert.equal(applyDefenseMitigation(15, 1), 14);
  });

  it("floors fractional intermediates the same way as the production formula", () => {
    // floor(10 * 40 / 45) = floor(8.888…) = 8
    assert.equal(applyDefenseMitigation(10, 5), 8);
    // floor(15 * 40 / 50) = floor(12) = 12
    assert.equal(applyDefenseMitigation(15, 10), 12);
    // Non-integer raw/defense inputs still go through Math.floor of the ratio
    assert.equal(
      applyDefenseMitigation(10.9, 5),
      expectedMitigatedDamage(10.9, 5)
    );
    assert.equal(
      applyDefenseMitigation(10, 5.7),
      expectedMitigatedDamage(10, 5.7)
    );
  });

  it("treats high defense as soft reduction, never immunity", () => {
    assert.equal(applyDefenseMitigation(15, 50), 6);
    assert.equal(applyDefenseMitigation(10, 50), 4);
    assert.ok(applyDefenseMitigation(100, 50) < 100);
    assert.ok(applyDefenseMitigation(100, 50) >= MIN_DAMAGE_AFTER_MITIGATION);
  });
});

describe("applyArmorMitigation / applyResistanceMitigation — Layer 0 wrappers", () => {
  const WRAPPER_CASES: ReadonlyArray<readonly [number, number]> = [
    [1, 0],
    [1, 10],
    [5, 5],
    [10, 0],
    [10, 20],
    [15, 1],
    [15, 20],
    [15, 50],
    [8, 10],
  ];

  it("delegates every sampled pair to the same defense curve", () => {
    for (const [raw, defense] of WRAPPER_CASES) {
      const expected = applyDefenseMitigation(raw, defense);
      assert.equal(
        applyArmorMitigation(raw, defense),
        expected,
        `armor raw=${raw} defense=${defense}`
      );
      assert.equal(
        applyResistanceMitigation(raw, defense),
        expected,
        `resistance raw=${raw} defense=${defense}`
      );
    }
  });

  it("locks armor and resistance acceptance anchors via wrappers", () => {
    assert.equal(applyArmorMitigation(15, 20), 10);
    assert.equal(applyResistanceMitigation(15, 1), 14);
  });
});
