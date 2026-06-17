import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SKILL_ID } from "../skills/skillIds";
import { SPELL_ID } from "../spells/spellIds";
import {
  filterUnlockedAbilities,
  isAbilityUnlocked,
} from "./isAbilityUnlocked";

describe("isAbilityUnlocked", () => {
  it("returns true when warrior level meets required level", () => {
    assert.equal(isAbilityUnlocked(3, 3), true);
    assert.equal(isAbilityUnlocked(5, 3), true);
  });

  it("returns false when warrior level is below required level", () => {
    assert.equal(isAbilityUnlocked(2, 3), false);
  });
});

describe("filterUnlockedAbilities", () => {
  it("keeps only abilities the warrior can use", () => {
    const spells = [
      { id: SPELL_ID.fireball, requiredLevel: 1 },
      { id: SPELL_ID.icebolt, requiredLevel: 3 },
    ];
    const skills = [
      { id: SKILL_ID.lunge, requiredLevel: 1 },
      { id: SKILL_ID.eviscerate, requiredLevel: 3 },
    ];

    assert.deepEqual(filterUnlockedAbilities(spells, 2), [spells[0]]);
    assert.deepEqual(filterUnlockedAbilities(spells, 3), spells);
    assert.deepEqual(filterUnlockedAbilities(skills, 2), [skills[0]]);
    assert.deepEqual(filterUnlockedAbilities(skills, 3), skills);
  });
});
