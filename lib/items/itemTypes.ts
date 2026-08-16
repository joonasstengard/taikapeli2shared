import type { CombatStat } from "../statusEffects/statusEffectTypes";

export const ITEM_PASSIVE_EFFECT_KEY = {
  manaMastery: "manaMastery",
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
