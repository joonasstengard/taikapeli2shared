import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ITEM_ID } from "./itemIds";
import { getItemById } from "./itemCatalog";
import {
  applySpellCastManaMasteryRestoreToWarrior,
  grantsSpellCastManaMasteryRestore,
} from "./itemPassiveEffects";
import { ITEM_PASSIVE_EFFECT_KEY } from "./itemTypes";

describe("grantsSpellCastManaMasteryRestore", () => {
  it("applies when Arkenfall Crystals are equipped", () => {
    const crystals = getItemById(ITEM_ID.arkenfallCrystals);
    assert.equal(grantsSpellCastManaMasteryRestore(crystals), true);
  });

  it("does not apply without the item effect", () => {
    assert.equal(grantsSpellCastManaMasteryRestore(null), false);
    assert.equal(
      grantsSpellCastManaMasteryRestore(getItemById(ITEM_ID.wornBand)),
      false
    );
  });
});

describe("applySpellCastManaMasteryRestoreToWarrior", () => {
  it("restores 1 mana when Mana Mastery is equipped", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        item: {
          effects: [ITEM_PASSIVE_EFFECT_KEY.manaMastery],
        },
        currentMana: 4,
        mana: 12,
      }),
      { currentMana: 5 }
    );
  });

  it("does not restore mana without Mana Mastery", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        item: null,
        currentMana: 4,
        mana: 12,
      }),
      { currentMana: 4 }
    );
  });

  it("does not exceed max mana", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        item: {
          effects: [ITEM_PASSIVE_EFFECT_KEY.manaMastery],
        },
        currentMana: 12,
        mana: 12,
      }),
      { currentMana: 12 }
    );
  });
});
