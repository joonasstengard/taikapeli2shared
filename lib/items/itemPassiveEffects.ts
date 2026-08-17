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
export const PRIMAL_MENDING_HEALTH_RESTORE = 5;
export const TROPHY_HARVEST_HEALTH_RESTORE_PERCENT = 50;

export function grantsPrimalAbilityHealthRestore(
  item: Pick<ItemDefinition, "effects"> | null | undefined,
  abilityType: string | null
): boolean {
  return (
    itemGrantsPassiveEffect(item, ITEM_PASSIVE_EFFECT_KEY.primalMending) &&
    abilityType === "Primal"
  );
}

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

export function grantsTakedownVictimHealthRestore(
  item: Pick<ItemDefinition, "effects"> | null | undefined
): boolean {
  return itemGrantsPassiveEffect(item, ITEM_PASSIVE_EFFECT_KEY.trophyHarvest);
}

export function calculateTakedownVictimHealthRestore(
  victimMaxHealth: number
): number {
  if (victimMaxHealth <= 0) {
    return 0;
  }

  return Math.round(
    victimMaxHealth * (TROPHY_HARVEST_HEALTH_RESTORE_PERCENT / 100)
  );
}

/** Applies Trophy Harvest health restore after scoring a takedown. */
export function applyTakedownVictimHealthRestoreToWarrior(
  warrior: {
    item?: Pick<ItemDefinition, "effects"> | null;
    currentHealth: number;
    health: number;
  },
  victimMaxHealth: number
): { currentHealth: number } {
  if (
    !grantsTakedownVictimHealthRestore(warrior.item) ||
    warrior.currentHealth <= 0
  ) {
    return { currentHealth: warrior.currentHealth };
  }

  return {
    currentHealth: Math.min(
      warrior.currentHealth +
        calculateTakedownVictimHealthRestore(victimMaxHealth),
      warrior.health
    ),
  };
}

/** Applies Primal Mending health restore after a Primal spell or skill. */
export function applyPrimalAbilityHealthRestoreToWarrior(
  warrior: {
    item?: Pick<ItemDefinition, "effects"> | null;
    currentHealth: number;
    health: number;
  },
  abilityType: string | null
): { currentHealth: number } {
  if (
    !grantsPrimalAbilityHealthRestore(warrior.item, abilityType) ||
    warrior.currentHealth <= 0
  ) {
    return { currentHealth: warrior.currentHealth };
  }

  return {
    currentHealth: Math.min(
      warrior.currentHealth + PRIMAL_MENDING_HEALTH_RESTORE,
      warrior.health
    ),
  };
}
