import type { CombatStat } from "../statusEffects/statusEffectTypes";

export const ITEM_PASSIVE_EFFECT_KEY = {
  manaMastery: "manaMastery",
  primalMending: "primalMending",
  trophyHarvest: "trophyHarvest",
} as const;

export type ItemPassiveEffect =
  (typeof ITEM_PASSIVE_EFFECT_KEY)[keyof typeof ITEM_PASSIVE_EFFECT_KEY];

export interface ItemPassiveEffectDefinition {
  key: ItemPassiveEffect;
  name: string;
  description: string;
}

export const ITEM_PASSIVE_EFFECT_DEFINITIONS: Record<
  ItemPassiveEffect,
  ItemPassiveEffectDefinition
> = {
  [ITEM_PASSIVE_EFFECT_KEY.manaMastery]: {
    key: ITEM_PASSIVE_EFFECT_KEY.manaMastery,
    name: "Mana Mastery",
    description: "Restore 1 mana after casting any spell.",
  },
  [ITEM_PASSIVE_EFFECT_KEY.primalMending]: {
    key: ITEM_PASSIVE_EFFECT_KEY.primalMending,
    name: "Primal Mending",
    description:
      "Restore 5 health after casting a Primal spell or using a Primal skill.",
  },
  [ITEM_PASSIVE_EFFECT_KEY.trophyHarvest]: {
    key: ITEM_PASSIVE_EFFECT_KEY.trophyHarvest,
    name: "Trophy Harvest",
    description:
      "Restore 50% of the defeated enemy's max health when you score a takedown.",
  },
};

/** Static item definition (catalog data, not a DB row). */
export interface ItemDefinition {
  id: number;
  name: string;
  description?: string;
  icon: string;
  goldCost: number;
  statBonuses?: Partial<Record<CombatStat, number>>;
  effects?: ItemPassiveEffect[];
}

export function getItemPassiveEffectDefinitions(
  item: Pick<ItemDefinition, "effects"> | null | undefined
): ItemPassiveEffectDefinition[] {
  return (item?.effects ?? []).map(
    (effect) => ITEM_PASSIVE_EFFECT_DEFINITIONS[effect]
  );
}

export const ITEM_STAT_ORDER: CombatStat[] = [
  "strength",
  "speed",
  "faith",
  "spellDamage",
  "armor",
  "resistance",
];

export function getItemStatBonusEntries(
  item: Pick<ItemDefinition, "statBonuses"> | null | undefined
): Array<{ stat: CombatStat; amount: number }> {
  if (!item?.statBonuses) {
    return [];
  }

  return ITEM_STAT_ORDER.flatMap((stat) => {
    const amount = item.statBonuses?.[stat];
    if (amount === undefined || amount === 0) {
      return [];
    }

    return [{ stat, amount }];
  });
}
