// Warrior stat training gold costs. Kept here for easy tweaking (shared by frontend + backend).

export const TRAINING_BASE_COST = 5;
export const TRAINING_LEVEL_MULTIPLIER = 1;
export const TRAINING_STAT_MAX = 50;

export const TRAINABLE_STATS = [
  "health",
  "mana",
  "stamina",
  "strength",
  "speed",
  "faith",
  "spellDamage",
] as const;

export type TrainableStat = (typeof TRAINABLE_STATS)[number];

export function isTrainableStat(value: string): value is TrainableStat {
  return (TRAINABLE_STATS as readonly string[]).includes(value);
}

/** Gold cost to raise a stat by one point when its current value is `statValueBeforeIncrease`. */
export function trainingCostForPoint(statValueBeforeIncrease: number): number {
  return Math.round(
    TRAINING_BASE_COST + statValueBeforeIncrease * TRAINING_LEVEL_MULTIPLIER
  );
}

/** Total gold cost to train a stat from `fromStat` up to `toStat` (exclusive of no-op when equal). */
export function calculateTrainingCost(fromStat: number, toStat: number): number {
  if (toStat <= fromStat) {
    return 0;
  }

  let total = 0;

  for (let level = fromStat; level < toStat; level += 1) {
    total += trainingCostForPoint(level);
  }

  return total;
}
