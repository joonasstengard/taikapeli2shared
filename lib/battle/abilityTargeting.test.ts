import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAreaAbilityTargets,
  isAllySupportTargeting,
  isAreaTargeting,
  isInstantCastTargeting,
  isSingleTargetTargeting,
  isValidAbilityTarget,
} from "./abilityTargeting";

describe("abilityTargeting", () => {
  it("treats allAllies and allEnemies as area targeting", () => {
    assert.equal(isAreaTargeting("allAllies"), true);
    assert.equal(isAreaTargeting("allEnemies"), true);
    assert.equal(isAreaTargeting("ally"), false);
    assert.equal(isAreaTargeting("enemy"), false);
  });

  it("treats ally and enemy as single-target targeting", () => {
    assert.equal(isSingleTargetTargeting("ally"), true);
    assert.equal(isSingleTargetTargeting("enemy"), true);
    assert.equal(isSingleTargetTargeting("self"), false);
  });

  it("treats self, ally, and allAllies as ally support targeting", () => {
    assert.equal(isAllySupportTargeting("self"), true);
    assert.equal(isAllySupportTargeting("ally"), true);
    assert.equal(isAllySupportTargeting("allAllies"), true);
    assert.equal(isAllySupportTargeting("enemy"), false);
  });

  it("validates ally and enemy targets by army", () => {
    assert.equal(isValidAbilityTarget("ally", 10, 10), true);
    assert.equal(isValidAbilityTarget("ally", 10, 20), false);
    assert.equal(isValidAbilityTarget("enemy", 10, 20), true);
    assert.equal(isValidAbilityTarget("enemy", 10, 10), false);
  });

  it("treats self and area targeting as instant cast", () => {
    assert.equal(isInstantCastTargeting("self"), true);
    assert.equal(isInstantCastTargeting("allAllies"), true);
    assert.equal(isInstantCastTargeting("ally"), false);
    assert.equal(isInstantCastTargeting("enemy"), false);
  });

  it("returns allies in range and excludes caster and dead warriors", () => {
    const caster = {
      id: 1,
      armyId: 10,
      currentHealth: 20,
      battleTileCurrent: "B2",
    };
    const allies = [
      caster,
      {
        id: 2,
        armyId: 10,
        currentHealth: 15,
        battleTileCurrent: "B3",
      },
      {
        id: 3,
        armyId: 10,
        currentHealth: 0,
        battleTileCurrent: "C2",
      },
      {
        id: 4,
        armyId: 10,
        currentHealth: 12,
        battleTileCurrent: "E2",
      },
      {
        id: 5,
        armyId: 20,
        currentHealth: 12,
        battleTileCurrent: "B1",
      },
    ];

    const inRange = getAreaAbilityTargets(
      allies,
      caster,
      1,
      "allAllies",
      8
    );

    assert.deepEqual(
      inRange.map((warrior) => warrior.id).sort(),
      [2]
    );
  });

  it("returns enemies in range for allEnemies targeting", () => {
    const caster = {
      id: 1,
      armyId: 10,
      currentHealth: 20,
      battleTileCurrent: "B2",
    };
    const warriors = [
      caster,
      {
        id: 2,
        armyId: 20,
        currentHealth: 15,
        battleTileCurrent: "C3",
      },
      {
        id: 3,
        armyId: 20,
        currentHealth: 12,
        battleTileCurrent: "A1",
      },
    ];

    const targets = getAreaAbilityTargets(
      warriors,
      caster,
      1,
      "allEnemies",
      8
    );

    assert.deepEqual(
      targets.map((warrior) => warrior.id).sort(),
      [2, 3]
    );
  });
});
