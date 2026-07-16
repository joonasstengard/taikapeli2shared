import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyArmorMitigation,
  applyDefenseMitigation,
  applyResistanceMitigation,
} from "./damageMitigation";
import { resolveMitigatedHit } from "./resolveMitigatedHit";

describe("resolveMitigatedHit", () => {
  it("returns no damage when the target is invulnerable", () => {
    assert.deepEqual(
      resolveMitigatedHit({
        rawDamage: 15,
        mitigation: "armor",
        defense: 0,
        currentHealth: 20,
        invulnerable: true,
      }),
      { damageDealt: 0, newHealth: 20 }
    );
  });

  it("returns no damage when raw damage or current health is non-positive", () => {
    assert.deepEqual(
      resolveMitigatedHit({
        rawDamage: 0,
        mitigation: "armor",
        defense: 10,
        currentHealth: 20,
      }),
      { damageDealt: 0, newHealth: 20 }
    );
    assert.deepEqual(
      resolveMitigatedHit({
        rawDamage: 10,
        mitigation: "armor",
        defense: 10,
        currentHealth: 0,
      }),
      { damageDealt: 0, newHealth: 0 }
    );
  });

  it("applies armor mitigation then clamps to current health", () => {
    const raw = 15;
    const armor = 20;
    const mitigated = applyArmorMitigation(raw, armor);
    assert.equal(mitigated, applyDefenseMitigation(raw, armor));
    assert.equal(mitigated, 10);

    assert.deepEqual(
      resolveMitigatedHit({
        rawDamage: raw,
        mitigation: "armor",
        defense: armor,
        currentHealth: 40,
      }),
      { damageDealt: 10, newHealth: 30 }
    );

    assert.deepEqual(
      resolveMitigatedHit({
        rawDamage: raw,
        mitigation: "armor",
        defense: armor,
        currentHealth: 7,
      }),
      { damageDealt: 7, newHealth: 0 }
    );
  });

  it("applies resistance mitigation then clamps to current health", () => {
    const raw = 15;
    const resistance = 20;
    assert.equal(applyResistanceMitigation(raw, resistance), 10);

    assert.deepEqual(
      resolveMitigatedHit({
        rawDamage: raw,
        mitigation: "resistance",
        defense: resistance,
        currentHealth: 40,
      }),
      { damageDealt: 10, newHealth: 30 }
    );
  });

  it("skips mitigation when kind is none (bleed / sacrifice / pre-mitigated)", () => {
    assert.deepEqual(
      resolveMitigatedHit({
        rawDamage: 8,
        mitigation: "none",
        defense: 50,
        currentHealth: 20,
      }),
      { damageDealt: 8, newHealth: 12 }
    );

    assert.deepEqual(
      resolveMitigatedHit({
        rawDamage: 8,
        mitigation: "none",
        currentHealth: 5,
      }),
      { damageDealt: 5, newHealth: 0 }
    );
  });

  it("defaults defense to 0 when omitted", () => {
    assert.deepEqual(
      resolveMitigatedHit({
        rawDamage: 12,
        mitigation: "armor",
        currentHealth: 20,
      }),
      { damageDealt: 12, newHealth: 8 }
    );
  });
});
