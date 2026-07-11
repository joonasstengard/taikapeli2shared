import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  appendLeapMoveEvent,
  castSpellEvent,
  meleeAttackEvent,
  moveEvent,
  uniqueTiles,
  useSkillEvent,
} from "./battleVisualEvents";

describe("battleVisualEvents", () => {
  it("builds a move event", () => {
    assert.deepEqual(moveEvent(3, "A1", "B2"), {
      type: "move",
      warriorId: 3,
      fromTile: "A1",
      toTile: "B2",
    });
  });

  it("prepends leap move when destination differs from caster tile", () => {
    const events = appendLeapMoveEvent(
      [castSpellEvent(5, 12, ["C3"])],
      5,
      "A1",
      "B2"
    );

    assert.equal(events.length, 2);
    assert.equal(events[0].type, "move");
    assert.equal(events[1].type, "castSpell");
  });

  it("skips leap move when landing on caster tile", () => {
    const events = appendLeapMoveEvent(
      [castSpellEvent(5, 12, ["A1"])],
      5,
      "A1",
      "a1"
    );

    assert.equal(events.length, 1);
    assert.equal(events[0].type, "castSpell");
  });

  it("deduplicates effect tiles case-insensitively", () => {
    assert.deepEqual(uniqueTiles(["A1", "a1", "B2", null, "B2"]), ["A1", "B2"]);
  });

  it("builds melee and skill events", () => {
    assert.deepEqual(meleeAttackEvent(1, "D4"), {
      type: "meleeAttack",
      warriorId: 1,
      targetTile: "D4",
    });

    assert.deepEqual(
      useSkillEvent(2, 7, ["C3"], true, true),
      {
        type: "useSkill",
        warriorId: 2,
        skillId: 7,
        effectTiles: ["C3"],
        casterAttackPose: true,
        targetSlashFx: true,
      }
    );

    assert.deepEqual(
      useSkillEvent(2, 9, ["C3"], false, true, "C3"),
      {
        type: "useSkill",
        warriorId: 2,
        skillId: 9,
        effectTiles: ["C3"],
        casterAttackPose: false,
        targetSlashFx: true,
        casterWalkToTile: "C3",
      }
    );
  });
});
