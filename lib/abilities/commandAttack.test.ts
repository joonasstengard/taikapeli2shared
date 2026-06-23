import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canAllyReceiveCommandAttack,
  getCommandAttackableEnemies,
  hasCommandAttackEffect,
  pickRandomCommandAttackTarget,
} from "./commandAttack";

const commander = {
  id: 1,
  armyId: 10,
  currentHealth: 10,
  battleTileCurrent: "A1",
  attackRange: 1,
};

const meleeAlly = {
  id: 2,
  armyId: 10,
  currentHealth: 10,
  battleTileCurrent: "B1",
  attackRange: 1,
};

const rangedAlly = {
  id: 3,
  armyId: 10,
  currentHealth: 10,
  battleTileCurrent: "A2",
  attackRange: 2,
};

const enemyInMeleeRange = {
  id: 4,
  armyId: 20,
  currentHealth: 8,
  battleTileCurrent: "C1",
  attackRange: 1,
};

const enemyInRangedReach = {
  id: 5,
  armyId: 20,
  currentHealth: 8,
  battleTileCurrent: "C2",
  attackRange: 1,
};

const enemyBeyondMeleeReach = {
  id: 7,
  armyId: 20,
  currentHealth: 8,
  battleTileCurrent: "D3",
  attackRange: 1,
};

const invulnerableEnemy = {
  id: 6,
  armyId: 20,
  currentHealth: 8,
  battleTileCurrent: "B2",
  attackRange: 1,
  invulnerable: true,
};

describe("hasCommandAttackEffect", () => {
  it("detects command attack skills", () => {
    assert.equal(hasCommandAttackEffect({ effectType: "commandAttack" }), true);
    assert.equal(hasCommandAttackEffect({ effectType: "leap" }), false);
    assert.equal(hasCommandAttackEffect(null), false);
  });
});

describe("getCommandAttackableEnemies", () => {
  it("returns enemies within the ally attack range and excludes invulnerable targets", () => {
    const warriors = [
      meleeAlly,
      enemyInMeleeRange,
      enemyBeyondMeleeReach,
      invulnerableEnemy,
    ];

    const attackable = getCommandAttackableEnemies(
      commander,
      meleeAlly,
      warriors,
      8,
      (enemy) => !("invulnerable" in enemy && enemy.invulnerable)
    );

    assert.deepEqual(
      attackable.map((enemy) => enemy.id),
      [enemyInMeleeRange.id]
    );
  });

  it("uses the commanded ally attack range, not the commander's", () => {
    const warriors = [rangedAlly, enemyInRangedReach];

    const attackable = getCommandAttackableEnemies(
      commander,
      rangedAlly,
      warriors,
      8,
      () => true
    );

    assert.deepEqual(
      attackable.map((enemy) => enemy.id),
      [enemyInRangedReach.id]
    );
  });
});

describe("canAllyReceiveCommandAttack", () => {
  it("is true when the ally has at least one valid enemy target", () => {
    assert.equal(
      canAllyReceiveCommandAttack(
        commander,
        meleeAlly,
        [meleeAlly, enemyInMeleeRange],
        8,
        () => true
      ),
      true
    );
    assert.equal(
      canAllyReceiveCommandAttack(
        commander,
        meleeAlly,
        [meleeAlly, invulnerableEnemy],
        8,
        (enemy) => !("invulnerable" in enemy && enemy.invulnerable)
      ),
      false
    );
  });
});

describe("pickRandomCommandAttackTarget", () => {
  it("picks from the provided enemy list", () => {
    const picked = pickRandomCommandAttackTarget(
      [enemyInMeleeRange, enemyInRangedReach],
      () => 0.5
    );

    assert.equal(picked.id, enemyInRangedReach.id);
  });
});
