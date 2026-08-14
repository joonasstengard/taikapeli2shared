import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ITEM_STAT_ORDER } from "./itemTypes";
import { ITEM_ID } from "./itemIds";
import {
  getItemById,
  ITEMS,
  resolveEquippedItem,
  resolveItemsFromIds,
} from "./itemCatalog";

describe("item catalog", () => {
  it("has unique ids matching ITEM_ID", () => {
    const catalogIds = ITEMS.map((item) => item.id);
    const definedIds = Object.values(ITEM_ID);

    assert.equal(new Set(catalogIds).size, catalogIds.length);
    assert.deepEqual([...catalogIds].sort((a, b) => a - b), [...definedIds].sort((a, b) => a - b));
  });

  it("requires a name, icon, positive gold cost, and combat-stat bonuses", () => {
    for (const item of ITEMS) {
      assert.ok(item.name.length > 0, `item ${item.id} is missing a name`);
      assert.ok(item.icon.startsWith("/icons/items/"), `item ${item.id} has a bad icon path`);
      assert.ok(item.goldCost > 0, `item ${item.id} must cost gold`);

      const bonusStats = Object.keys(item.statBonuses ?? {});
      assert.ok(bonusStats.length > 0, `item ${item.id} has no stat bonuses`);
      for (const stat of bonusStats) {
        assert.ok(
          (ITEM_STAT_ORDER as string[]).includes(stat),
          `item ${item.id} buffs unsupported stat ${stat}`
        );
      }
    }
  });

  it("resolves equipped items and ignores unknown ids", () => {
    const wornBand = getItemById(ITEM_ID.wornBand);
    assert.equal(wornBand?.name, "Worn Band");
    assert.equal(resolveEquippedItem(ITEM_ID.wornBand)?.id, ITEM_ID.wornBand);
    assert.equal(resolveEquippedItem(null), null);
    assert.equal(resolveEquippedItem(9999), null);
    assert.deepEqual(
      resolveItemsFromIds([ITEM_ID.bloodseal, 9999]).map((item) => item.id),
      [ITEM_ID.bloodseal]
    );
  });
});
