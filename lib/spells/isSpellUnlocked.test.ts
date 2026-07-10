import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SPELL_ID } from "./spellIds";
import { filterUnlockedSpells, isSpellUnlocked } from "./isSpellUnlocked";
import { LEVEL_SPELL_BUCKETS_BY_CLASS } from "./levelSpellBuckets";

describe("isSpellUnlocked", () => {
  it("returns true when warrior level meets required level", () => {
    assert.equal(isSpellUnlocked(3, 3), true);
    assert.equal(isSpellUnlocked(5, 3), true);
  });

  it("returns false when warrior level is below required level", () => {
    assert.equal(isSpellUnlocked(2, 3), false);
  });
});

describe("filterUnlockedSpells", () => {
  it("keeps only spells the warrior can use", () => {
    const spells = [
      { id: SPELL_ID.flamewheel, requiredLevel: 1 },
      { id: SPELL_ID.icebolt, requiredLevel: 3 },
    ];

    assert.deepEqual(filterUnlockedSpells(spells, 2), [spells[0]]);
    assert.deepEqual(filterUnlockedSpells(spells, 3), spells);
  });
});

describe("LEVEL_SPELL_BUCKETS_BY_CLASS", () => {
  it("grants Chain Lightning to Sorcerers at level 3", () => {
    assert.ok(
      LEVEL_SPELL_BUCKETS_BY_CLASS.Sorcerer?.[3]?.spellIds.includes(
        SPELL_ID.chainLightning
      )
    );
  });
});
