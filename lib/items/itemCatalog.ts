import { ITEM_ID } from "./itemIds";
import type { ItemDefinition } from "./itemTypes";

const ITEM_ICON_BASE = "/icons/items";

/** Item definitions with explicit ids for stable warriors.itemId references. */
export const ITEMS: ItemDefinition[] = [
  {
    id: ITEM_ID.wornBand,
    name: "Worn Band",
    description: null,
    icon: `${ITEM_ICON_BASE}/worn_band.png`,
    goldCost: 10,
    statBonuses: { resistance: 4 },
  },
  {
    id: ITEM_ID.bloodseal,
    name: "Bloodseal",
    description: "A pact pressed into steel.",
    icon: `${ITEM_ICON_BASE}/bloodseal.png`,
    goldCost: 20,
    statBonuses: { spellDamage: 8 },
  },
  {
    id: ITEM_ID.moonshardRing,
    name: "Moonshard Ring",
    description: "A sliver of cold light set in silver.",
    icon: `${ITEM_ICON_BASE}/moonshard_ring.png`,
    goldCost: 16,
    statBonuses: { spellDamage: 3, speed: 3 },
  },
  {
    id: ITEM_ID.emberdelveSignet,
    name: "Emberdelve Signet",
    description: "Heat from the hold still sleeps in the metal.",
    icon: `${ITEM_ICON_BASE}/emberdelve_signet.png`,
    goldCost: 20,
    statBonuses: { resistance: 8 },
  },
];

export const ITEM_BY_ID: Record<number, ItemDefinition> = ITEMS.reduce(
  (byId, item) => {
    byId[item.id] = item;
    return byId;
  },
  {} as Record<number, ItemDefinition>
);

export function getItemById(itemId: number): ItemDefinition | undefined {
  return ITEM_BY_ID[itemId];
}

export function resolveItemsFromIds(itemIds: number[]): ItemDefinition[] {
  return itemIds
    .map((itemId) => getItemById(itemId))
    .filter((item): item is ItemDefinition => item !== undefined);
}

export function resolveEquippedItem(
  itemId: number | null | undefined
): ItemDefinition | null {
  if (itemId == null) {
    return null;
  }

  return getItemById(itemId) ?? null;
}
