import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  sortSkillsByDisplayOrder,
  sortSpellsByDisplayOrder,
} from "./sortAbilitiesByDisplayOrder";

describe("sortSpellsByDisplayOrder", () => {
  it("sorts by required level ascending, then mana cost ascending", () => {
    const sorted = sortSpellsByDisplayOrder([
      { id: 1, requiredLevel: 4, manaCost: 5 },
      { id: 2, requiredLevel: 2, manaCost: 9 },
      { id: 3, requiredLevel: 2, manaCost: 3 },
      { id: 4, requiredLevel: 1, manaCost: 7 },
    ] as never);

    assert.deepEqual(
      sorted.map((spell) => spell.id),
      [4, 3, 2, 1]
    );
  });
});

describe("sortSkillsByDisplayOrder", () => {
  it("sorts by required level ascending, then stamina cost ascending", () => {
    const sorted = sortSkillsByDisplayOrder([
      { id: 1, requiredLevel: 3, staminaCost: 4 },
      { id: 2, requiredLevel: 1, staminaCost: 6 },
      { id: 3, requiredLevel: 1, staminaCost: 2 },
      { id: 4, requiredLevel: 2, staminaCost: 5 },
    ] as never);

    assert.deepEqual(
      sorted.map((skill) => skill.id),
      [3, 2, 4, 1]
    );
  });
});
