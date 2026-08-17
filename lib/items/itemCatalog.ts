import { ITEM_ID } from "./itemIds";
import { ITEM_PASSIVE_EFFECT_KEY, type ItemDefinition } from "./itemTypes";

const ITEM_ICON_BASE = "/icons/items";

/** Item definitions with explicit ids for stable warriors.itemId references. */
export const ITEMS: ItemDefinition[] = [
  {
    id: ITEM_ID.wornBand,
    name: "Worn Leather Band",
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
    goldCost: 20,
    statBonuses: { spellDamage: 4, speed: 4 },
  },
  {
    id: ITEM_ID.emberdelveSignet,
    name: "Emberdelve Signet",
    description: "Heat from the hold still sleeps in the dwarven metal.",
    icon: `${ITEM_ICON_BASE}/emberdelve_signet.png`,
    goldCost: 30,
    statBonuses: { armor: 6, resistance: 6 },
  },
  {
    id: ITEM_ID.thalenEmeraldRing,
    name: "Thalen Emerald Ring",
    description: null,
    icon: `${ITEM_ICON_BASE}/thalen_emerald_ring.png`,
    goldCost: 15,
    statBonuses: { spellDamage: 3, speed: 3 },
  },
  {
    id: ITEM_ID.amberSignet,
    name: "Amber Signet",
    description: null,
    icon: `${ITEM_ICON_BASE}/amber_signet.png`,
    goldCost: 15,
    statBonuses: { spellDamage: 3, faith: 3 },
  },
  {
    id: ITEM_ID.nightglassRing,
    name: "Nightglass Ring",
    description: null,
    icon: `${ITEM_ICON_BASE}/nightglass_ring.png`,
    goldCost: 15,
    statBonuses: { spellDamage: 3, resistance: 3 },
  },
  {
    id: ITEM_ID.steelBand,
    name: "Steel Band",
    description: null,
    icon: `${ITEM_ICON_BASE}/steel_band.png`,
    goldCost: 10,
    statBonuses: { armor: 4 },
  },
  {
    id: ITEM_ID.threeMarks,
    name: "Three Marks",
    description: null,
    icon: `${ITEM_ICON_BASE}/three_marks.png`,
    goldCost: 22,
    statBonuses: { spellDamage: 3, speed: 3, resistance: 3 },
  },
  {
    id: ITEM_ID.ritualistsBracelet,
    name: "Ritualist's Bracelet",
    description: null,
    icon: `${ITEM_ICON_BASE}/ritualists_bracelet.png`,
    goldCost: 20,
    statBonuses: { armor: 6, spellDamage: 3 },
  },
  {
    id: ITEM_ID.seresTear,
    name: "Mother Sere's Tear",
    description: "It weeps a light the Blight cannot drink.",
    icon: `${ITEM_ICON_BASE}/seres_tear.png`,
    goldCost: 36,
    statBonuses: { faith: 12, resistance: 3 },
  },
  {
    id: ITEM_ID.graveCharm,
    name: "Grave Charm",
    description: null,
    icon: `${ITEM_ICON_BASE}/grave_charm.png`,
    goldCost: 20,
    statBonuses: { resistance: 6, strength: 2 },
  },
  {
    id: ITEM_ID.woundBead,
    name: "Wound Bead",
    description: "Worn until the chain learns the pulse",
    icon: `${ITEM_ICON_BASE}/wound_bead.png`,
    goldCost: 24,
    statBonuses: { resistance: 5, strength: 4 },
  },
  {
    id: ITEM_ID.palesilverBelt,
    name: "Palesilver Belt",
    description: null,
    icon: `${ITEM_ICON_BASE}/palesilver_belt.png`,
    goldCost: 17,
    statBonuses: { resistance: 7 },
  },
  {
    id: ITEM_ID.leatherBelt,
    name: "Leather Belt",
    description: null,
    icon: `${ITEM_ICON_BASE}/leather_belt.png`,
    goldCost: 10,
    statBonuses: { resistance: 2, armor: 2 },
  },
  {
    id: ITEM_ID.arkenfallCrystals,
    name: "Arkenfall Crystals",
    icon: `${ITEM_ICON_BASE}/arkenfall_crystals.png`,
    goldCost: 16,
    statBonuses: { spellDamage: 4, speed: 2 },
    effects: [ITEM_PASSIVE_EFFECT_KEY.manaMastery],
  },
  {
    id: ITEM_ID.aeronorMandrake,
    name: "Aeronor Mandrake",
    icon: `${ITEM_ICON_BASE}/aeronor_mandrake.png`,
    goldCost: 16,
    effects: [ITEM_PASSIVE_EFFECT_KEY.primalMending],
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
