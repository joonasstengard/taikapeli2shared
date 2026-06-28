import type { CombatStat } from "../statusEffects/statusEffectTypes";
import type { StatModifiers, WarriorStatBuffInstance } from "./statBuffTypes";

const COMBAT_STATS: CombatStat[] = [
  "strength",
  "speed",
  "faith",
  "spellDamage",
];

export function hasPositiveStatModifiers(
  statModifiers: StatModifiers | undefined
): boolean {
  if (!statModifiers) {
    return false;
  }

  return Object.values(statModifiers).some(
    (value) => typeof value === "number" && value > 0
  );
}

export function sumStatBuffBonuses(
  statBuffs: Pick<WarriorStatBuffInstance, "turnsRemaining" | "statModifiers">[] | undefined
): Partial<Record<CombatStat, number>> {
  const bonuses: Partial<Record<CombatStat, number>> = {};

  for (const buff of statBuffs ?? []) {
    if (buff.turnsRemaining <= 0) {
      continue;
    }

    for (const stat of COMBAT_STATS) {
      const modifier = buff.statModifiers[stat];
      if (modifier === undefined) {
        continue;
      }

      bonuses[stat] = (bonuses[stat] ?? 0) + modifier;
    }
  }

  return bonuses;
}
