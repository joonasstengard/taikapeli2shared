import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterSingleAllyTargets,
  getAreaAbilityTargets,
  getEnemyAoESplashTargets,
  getEnemyChainSpreadTargets,
  getEnemyChainSpreadTargetsAfterPrimary,
  isAllyAreaTargeting,
  isAllySupportTargeting,
  isAreaTargeting,
  isEnemyAoETargeting,
  isEnemyChainTargeting,
  isEnemyTargeting,
  isInstantCastTargeting,
  isSingleAllyTargeting,
  isSingleTargetTargeting,
  isTileTargeting,
  isValidAbilityTarget,
  isValidAbilityTargetWarrior,
} from "./abilityTargeting";

describe("abilityTargeting", () => {
  it("treats allAllies, otherAllies, and allEnemies as area targeting", () => {
    assert.equal(isAreaTargeting("allAllies"), true);
    assert.equal(isAreaTargeting("otherAllies"), true);
    assert.equal(isAreaTargeting("allEnemies"), true);
    assert.equal(isAreaTargeting("ally"), false);
    assert.equal(isAreaTargeting("otherAlly"), false);
    assert.equal(isAreaTargeting("enemy"), false);
  });

  it("identifies ally area targeting types", () => {
    assert.equal(isAllyAreaTargeting("allAllies"), true);
    assert.equal(isAllyAreaTargeting("otherAllies"), true);
    assert.equal(isAllyAreaTargeting("allEnemies"), false);
    assert.equal(isAllyAreaTargeting("ally"), false);
    assert.equal(isAllyAreaTargeting("otherAlly"), false);
  });

  it("treats ally, otherAlly, enemy, enemyAoE, and enemyChain as single-target targeting", () => {
    assert.equal(isSingleTargetTargeting("ally"), true);
    assert.equal(isSingleTargetTargeting("otherAlly"), true);
    assert.equal(isSingleTargetTargeting("enemy"), true);
    assert.equal(isSingleTargetTargeting("enemyAoE"), true);
    assert.equal(isSingleTargetTargeting("enemyChain"), true);
    assert.equal(isSingleTargetTargeting("self"), false);
    assert.equal(isSingleTargetTargeting("tile"), false);
  });

  it("identifies tile targeting", () => {
    assert.equal(isTileTargeting("tile"), true);
    assert.equal(isTileTargeting("enemy"), false);
    assert.equal(isInstantCastTargeting("tile"), false);
  });

  it("identifies single-ally targeting types", () => {
    assert.equal(isSingleAllyTargeting("ally"), true);
    assert.equal(isSingleAllyTargeting("otherAlly"), true);
    assert.equal(isSingleAllyTargeting("allAllies"), false);
    assert.equal(isSingleAllyTargeting("enemy"), false);
  });

  it("identifies enemy, enemyAoE, and enemyChain as enemy targeting", () => {
    assert.equal(isEnemyTargeting("enemy"), true);
    assert.equal(isEnemyTargeting("enemyAoE"), true);
    assert.equal(isEnemyTargeting("enemyChain"), true);
    assert.equal(isEnemyAoETargeting("enemyAoE"), true);
    assert.equal(isEnemyChainTargeting("enemyChain"), true);
    assert.equal(isEnemyAoETargeting("enemy"), false);
    assert.equal(isEnemyChainTargeting("enemyAoE"), false);
    assert.equal(isAreaTargeting("enemyAoE"), false);
  });

  it("treats self, ally, otherAlly, allAllies, and otherAllies as ally support targeting", () => {
    assert.equal(isAllySupportTargeting("self"), true);
    assert.equal(isAllySupportTargeting("ally"), true);
    assert.equal(isAllySupportTargeting("otherAlly"), true);
    assert.equal(isAllySupportTargeting("allAllies"), true);
    assert.equal(isAllySupportTargeting("otherAllies"), true);
    assert.equal(isAllySupportTargeting("enemy"), false);
  });

  it("validates ally and enemy targets by army", () => {
    assert.equal(isValidAbilityTarget("ally", 10, 10), true);
    assert.equal(isValidAbilityTarget("otherAlly", 10, 10), true);
    assert.equal(isValidAbilityTarget("ally", 10, 20), false);
    assert.equal(isValidAbilityTarget("otherAlly", 10, 20), false);
    assert.equal(isValidAbilityTarget("enemy", 10, 20), true);
    assert.equal(isValidAbilityTarget("enemy", 10, 10), false);
    assert.equal(isValidAbilityTarget("enemyAoE", 10, 20), true);
    assert.equal(isValidAbilityTarget("enemyAoE", 10, 10), false);
    assert.equal(isValidAbilityTarget("enemyChain", 10, 20), true);
    assert.equal(isValidAbilityTarget("enemyChain", 10, 10), false);
  });

  it("rejects the caster for otherAlly warrior validation", () => {
    const caster = { id: 1, armyId: 10 };
    const ally = { id: 2, armyId: 10 };
    const enemy = { id: 3, armyId: 20 };

    assert.equal(isValidAbilityTargetWarrior("ally", caster, caster), true);
    assert.equal(isValidAbilityTargetWarrior("otherAlly", caster, caster), false);
    assert.equal(isValidAbilityTargetWarrior("otherAlly", caster, ally), true);
    assert.equal(isValidAbilityTargetWarrior("otherAlly", caster, enemy), false);
  });

  it("filters caster out of otherAlly target lists", () => {
    const allies = [{ id: 1 }, { id: 2 }, { id: 3 }];

    assert.deepEqual(
      filterSingleAllyTargets("ally", 1, allies).map((ally) => ally.id),
      [1, 2, 3]
    );
    assert.deepEqual(
      filterSingleAllyTargets("otherAlly", 1, allies).map((ally) => ally.id),
      [2, 3]
    );
  });

  it("treats self and area targeting as instant cast", () => {
    assert.equal(isInstantCastTargeting("self"), true);
    assert.equal(isInstantCastTargeting("allAllies"), true);
    assert.equal(isInstantCastTargeting("otherAllies"), true);
    assert.equal(isInstantCastTargeting("ally"), false);
    assert.equal(isInstantCastTargeting("otherAlly"), false);
    assert.equal(isInstantCastTargeting("enemy"), false);
  });

  it("returns allies in range including caster for allAllies, excluding dead warriors", () => {
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
      [1, 2]
    );
  });

  it("returns allies in range excluding caster for otherAllies", () => {
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
        currentHealth: 12,
        battleTileCurrent: "C2",
      },
    ];

    const inRange = getAreaAbilityTargets(
      allies,
      caster,
      1,
      "otherAllies",
      8
    );

    assert.deepEqual(
      inRange.map((warrior) => warrior.id).sort(),
      [2, 3]
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

  it("returns nearby enemies for enemyAoE splash around the primary target", () => {
    const warriors = [
      {
        id: 1,
        armyId: 10,
        currentHealth: 20,
        battleTileCurrent: "A1",
      },
      {
        id: 2,
        armyId: 20,
        currentHealth: 15,
        battleTileCurrent: "B2",
      },
      {
        id: 3,
        armyId: 20,
        currentHealth: 12,
        battleTileCurrent: "C2",
      },
      {
        id: 4,
        armyId: 20,
        currentHealth: 10,
        battleTileCurrent: "E5",
      },
      {
        id: 5,
        armyId: 10,
        currentHealth: 12,
        battleTileCurrent: "B3",
      },
    ];

    const splashTargets = getEnemyAoESplashTargets(
      warriors,
      "B2",
      10,
      2,
      8
    );

    assert.deepEqual(
      splashTargets.map((warrior) => warrior.id).sort(),
      [3]
    );
  });

  it("chains through clustered enemies but not isolated ones", () => {
    const warriors = [
      {
        id: 1,
        armyId: 10,
        currentHealth: 20,
        battleTileCurrent: "A1",
      },
      {
        id: 2,
        armyId: 20,
        currentHealth: 15,
        battleTileCurrent: "B2",
      },
      {
        id: 3,
        armyId: 20,
        currentHealth: 12,
        battleTileCurrent: "C2",
      },
      {
        id: 4,
        armyId: 20,
        currentHealth: 10,
        battleTileCurrent: "E5",
      },
    ];

    const chainTargets = getEnemyChainSpreadTargets(warriors, 2, 10, 8);

    assert.deepEqual(
      chainTargets.map((warrior) => warrior.id),
      [2, 3]
    );
  });

  it("returns only the primary target for an isolated enemy chain", () => {
    const warriors = [
      {
        id: 1,
        armyId: 10,
        currentHealth: 20,
        battleTileCurrent: "A1",
      },
      {
        id: 2,
        armyId: 20,
        currentHealth: 15,
        battleTileCurrent: "E5",
      },
    ];

    const chainTargets = getEnemyChainSpreadTargets(warriors, 2, 10, 8);

    assert.deepEqual(
      chainTargets.map((warrior) => warrior.id),
      [2]
    );
  });

  it("still chains from a defeated primary target tile", () => {
    const warriors = [
      {
        id: 1,
        armyId: 10,
        currentHealth: 20,
        battleTileCurrent: "A1",
      },
      {
        id: 2,
        armyId: 20,
        currentHealth: 0,
        battleTileCurrent: "B2",
      },
      {
        id: 3,
        armyId: 20,
        currentHealth: 12,
        battleTileCurrent: "C2",
      },
    ];

    const chainTargets = getEnemyChainSpreadTargetsAfterPrimary(
      warriors,
      2,
      10,
      8
    );

    assert.deepEqual(
      chainTargets.map((warrior) => warrior.id),
      [3]
    );
  });
});
