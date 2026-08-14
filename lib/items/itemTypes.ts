import type { CombatStat } from "../statusEffects/statusEffectTypes";

/** Battle passives granted by an item. None in v1; extend this union later. */
export type ItemPassiveEffect = never;

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
