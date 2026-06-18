import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAreaAbilityTargets,
  isAreaTargeting,
  isInstantCastTargeting,
} from "./abilityTargeting";

describe("abilityTargeting", () => {
  it("treats allAllies and allEnemies as area targeting", () => {
    assert.equal(isAreaTargeting("allAllies"), true);
    assert.equal(isAreaTargeting("allEnemies"), true);
    assert.equal(isAreaTargeting("warrior"), false);
  });

  it("treats self and area targeting as instant cast", () => {
    assert.equal(isInstantCastTargeting("self"), true);
    assert.equal(isInstantCastTargeting("allAllies"), true);
    assert.equal(isInstantCastTargeting("warrior"), false);
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
