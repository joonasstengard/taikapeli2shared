// Warrior recruitment gold costs. Kept here for easy tweaking (shared by frontend + backend).

export const RECRUIT_PRICE_STATS = [
  "health",
  "mana",
  "strength",
  "stamina",
  "speed",
  "faith",
  "spellDamage",
  "armor",
  "resistance",
  "attackRange",
] as const;

export type RecruitPriceStat = (typeof RECRUIT_PRICE_STATS)[number];

/** Stats whose combat value is disproportionate to their numeric size. */
export const HIGH_VALUE_STATS = ["attackRange"] as const;

export type HighValueStat = (typeof HIGH_VALUE_STATS)[number];

/** Multiplier applied to a high-value stat's full contribution. */
// (attack range)
export const HIGH_VALUE_STAT_MULTIPLIER = 14;

/** Per-point cost shape — same idea as training, with separate tuning knobs. */
export const RECRUIT_STAT_BASE_COST = 0.4;
export const RECRUIT_STAT_LEVEL_MULTIPLIER = 0.25;

/** Flat add-on so even a weak warrior is not free. */
export const RECRUIT_BASE_PRICE = 4;

/** Global scaler for recruit prices. */
export const RECRUIT_PRICE_MULTIPLIER = 0.5;

/** Gold premium per spell the warrior already knows. */
export const RECRUIT_SPELL_COST_PER_SPELL = 1;

/** Gold premium per skill the warrior already knows. */
export const RECRUIT_SKILL_COST_PER_SKILL = 1;

/** Minimum recruit price after rounding. */
export const RECRUIT_MIN_PRICE = 4;

export type WarriorRecruitStats = Record<RecruitPriceStat, number>;

export function isHighValueStat(stat: RecruitPriceStat): stat is HighValueStat {
  return (HIGH_VALUE_STATS as readonly string[]).includes(stat);
}

/** Gold value of one stat point when its current value is `statValueBeforeIncrease`. */
export function recruitCostForPoint(statValueBeforeIncrease: number): number {
  return (
    RECRUIT_STAT_BASE_COST +
    statValueBeforeIncrease * RECRUIT_STAT_LEVEL_MULTIPLIER
  );
}

/** Total gold value of a stat from `fromStat` up to `toStat`. */
export function calculateRecruitStatCost(
  fromStat: number,
  toStat: number
): number {
  if (toStat <= fromStat) {
    return 0;
  }

  let total = 0;

  for (let level = fromStat; level < toStat; level += 1) {
    total += recruitCostForPoint(level);
  }

  return total;
}

/** Gold value of a single stat above the baseline of 1. */
export function recruitStatContribution(statValue: number): number {
  return calculateRecruitStatCost(1, statValue);
}

/** Sum of all stat contributions, including high-value multipliers. */
export function calculateWarriorStatRecruitValue(
  warrior: WarriorRecruitStats
): number {
  return RECRUIT_PRICE_STATS.reduce((total, stat) => {
    let contribution = recruitStatContribution(warrior[stat]);

    if (isHighValueStat(stat)) {
      contribution *= HIGH_VALUE_STAT_MULTIPLIER;
    }

    return total + contribution;
  }, 0);
}

/** Recruitment price from warrior stats and known spells/skills. */
export function calculateWarriorRecruitPrice(
  warrior: WarriorRecruitStats,
  spellCount = 0,
  skillCount = 0
): number {
  const statValue = calculateWarriorStatRecruitValue(warrior);
  const abilityValue =
    spellCount * RECRUIT_SPELL_COST_PER_SPELL +
    skillCount * RECRUIT_SKILL_COST_PER_SKILL;
  const rawPrice =
    (RECRUIT_BASE_PRICE + statValue + abilityValue) * RECRUIT_PRICE_MULTIPLIER;

  return Math.max(RECRUIT_MIN_PRICE, Math.round(rawPrice));
}

/** Gold granted when releasing a warrior (half the recruit/market price). */
export function calculateWarriorReleaseGold(
  warrior: WarriorRecruitStats,
  spellCount = 0,
  skillCount = 0
): number {
  return Math.round(
    calculateWarriorRecruitPrice(warrior, spellCount, skillCount) / 2
  );
}
