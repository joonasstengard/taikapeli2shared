import type { ItemDefinition, ItemPassiveEffect } from "./itemTypes";
import { ITEM_PASSIVE_EFFECT_KEY } from "./itemTypes";

export function itemGrantsPassiveEffect(
  item: Pick<ItemDefinition, "effects"> | null | undefined,
  effect: ItemPassiveEffect
): boolean {
  return item?.effects?.includes(effect) ?? false;
}

export function grantsSpellCastManaMasteryRestore(
  item: Pick<ItemDefinition, "effects"> | null | undefined
): boolean {
  return itemGrantsPassiveEffect(item, ITEM_PASSIVE_EFFECT_KEY.manaMastery);
}

export const MANA_MASTERY_SPELL_CAST_MANA_RESTORE = 1;

/** Applies Mana Mastery mana restore when the equipped item grants it. */
export function applySpellCastManaMasteryRestoreToWarrior(warrior: {
  item?: Pick<ItemDefinition, "effects"> | null;
  currentMana: number;
  mana: number;
}): { currentMana: number } {
  if (!grantsSpellCastManaMasteryRestore(warrior.item)) {
    return { currentMana: warrior.currentMana };
  }

  return {
    currentMana: Math.min(
      warrior.currentMana + MANA_MASTERY_SPELL_CAST_MANA_RESTORE,
      warrior.mana
    ),
  };
}
