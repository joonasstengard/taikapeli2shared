import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildBattleSummary,
  createBattleWarriorSnapshots,
  parseBattleRuntimeSummary,
} from "./battleSummary";

describe("parseBattleRuntimeSummary", () => {
  it("returns empty summary for invalid input", () => {
    const summary = parseBattleRuntimeSummary(null);
    assert.deepEqual(summary, { warriorSnapshots: [], kills: [] });
  });

  it("parses snapshots and kills", () => {
    const summary = parseBattleRuntimeSummary({
      warriorSnapshots: [
        {
          warriorId: 1,
          armyId: 10,
          level: 2,
          experience: 40,
          takedowns: 0,
          health: 20,
          mana: 10,
          strength: 8,
          stamina: 8,
          speed: 6,
          faith: 4,
          spellDamage: 3,
        },
      ],
      kills: [{ attackerId: 1, victimId: 2 }],
    });

    assert.equal(summary.warriorSnapshots.length, 1);
    assert.equal(summary.kills.length, 1);
  });
});

describe("buildBattleSummary", () => {
  it("builds player level ups and economy from snapshots", () => {
    const runtimeSummary = {
      warriorSnapshots: createBattleWarriorSnapshots([
        {
          id: 1,
          armyId: 10,
          level: 2,
          experience: 40,
          takedowns: 0,
          health: 20,
          mana: 10,
          strength: 8,
          stamina: 8,
          speed: 6,
          faith: 4,
          spellDamage: 3,
        },
        {
          id: 2,
          armyId: 20,
          level: 1,
          experience: 0,
          takedowns: 0,
          health: 18,
          mana: 8,
          strength: 7,
          stamina: 7,
          speed: 5,
          faith: 3,
          spellDamage: 2,
        },
      ]),
      kills: [{ attackerId: 1, victimId: 2 }],
    };

    const summary = buildBattleSummary({
      winnerArmyId: 10,
      playersArmyId: 10,
      warriors: [
        {
          id: 1,
          armyId: 10,
          level: 3,
          experience: 95,
          takedowns: 1,
          health: 22,
          mana: 11,
          strength: 9,
          stamina: 9,
          speed: 7,
          faith: 5,
          spellDamage: 4,
          skills: [{ id: 5, requiredLevel: 3 }],
          spells: [{ id: 9, requiredLevel: 4 }],
        },
        {
          id: 2,
          armyId: 20,
          level: 1,
          experience: 0,
          takedowns: 0,
          health: 0,
          mana: 8,
          strength: 7,
          stamina: 7,
          speed: 5,
          faith: 3,
          spellDamage: 2,
          skills: [],
          spells: [],
        },
      ],
      runtimeSummary,
      economy: {
        winnerGold: 30,
        loserGold: 25,
        nationHealthLost: 39,
        survivorCount: 1,
      },
    });

    assert.equal(summary.winnerGold, 30);
    assert.equal(summary.loserGold, 25);
    assert.equal(summary.nationHealthLost, 39);
    assert.equal(summary.kills.length, 1);
    assert.equal(summary.playerLevelUps.length, 1);
    assert.equal(summary.playerLevelUps[0]?.warriorId, 1);
    assert.equal(summary.playerLevelUps[0]?.levelsGained, 1);
    assert.deepEqual(summary.playerLevelUps[0]?.newSkillIds, [5]);
    assert.deepEqual(summary.playerLevelUps[0]?.newSpellIds, []);
    assert.ok(summary.playerLevelUps[0]?.statDeltas.health > 0);
  });
});
