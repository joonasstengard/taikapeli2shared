import {
  getStatusEffect,
  isTransformStatusEffectKey,
} from "./statusEffectDefinitions";
import type { CombatStat } from "./statusEffectTypes";
import type { WarriorStatBuffInstance } from "../statBuffs/statBuffTypes";
import { sumStatBuffBonuses } from "../statBuffs/sumStatBuffBonuses";
import type { WarriorStatusEffect } from "./warriorStatusEffect";
import type {
  SkillCasterCombatStats,
  SpellCasterCombatStats,
} from "../spells/spellPower";

export type CombatStatValues = Record<CombatStat, number>;

export interface ResolvedCombatStats {
  base: CombatStatValues;
  effective: CombatStatValues;
  bonuses: Partial<Record<CombatStat, number>>;
}

type WarriorCombatStatSource = Partial<CombatStatValues>;

type ActiveStatusEffect = Pick<
  WarriorStatusEffect,
  "effectKey" | "turnsRemaining"
>;

const COMBAT_STATS: CombatStat[] = [
  "strength",
  "speed",
  "faith",
  "spellDamage",
];

function readBaseCombatStats(
  warrior: WarriorCombatStatSource
): CombatStatValues {
  return {
    strength: warrior.strength ?? 0,
    speed: warrior.speed ?? 0,
    faith: warrior.faith ?? 0,
    spellDamage: warrior.spellDamage ?? 0,
  };
}

export function sumStatusEffectStatBonuses(
  statusEffects: ActiveStatusEffect[] | undefined
): Partial<Record<CombatStat, number>> {
  const bonuses: Partial<Record<CombatStat, number>> = {};

  for (const effect of statusEffects ?? []) {
    if (effect.turnsRemaining <= 0) {
      continue;
    }

    const definition = getStatusEffect(effect.effectKey);
    if (!definition?.statModifiers) {
      continue;
    }

    for (const stat of COMBAT_STATS) {
      const modifier = definition.statModifiers[stat];
      if (modifier === undefined) {
        continue;
      }

      bonuses[stat] = (bonuses[stat] ?? 0) + modifier;
    }
  }

  return bonuses;
}

export function resolveCombatStats(
  warrior: WarriorCombatStatSource,
  statusEffects?: ActiveStatusEffect[],
  statBuffs?: Pick<WarriorStatBuffInstance, "turnsRemaining" | "statModifiers">[]
): ResolvedCombatStats {
  const base = readBaseCombatStats(warrior);
  const statusBonuses = sumStatusEffectStatBonuses(statusEffects);
  const buffBonuses = sumStatBuffBonuses(statBuffs);
  const bonuses: Partial<Record<CombatStat, number>> = {};

  for (const stat of COMBAT_STATS) {
    const total = (statusBonuses[stat] ?? 0) + (buffBonuses[stat] ?? 0);
    if (total !== 0) {
      bonuses[stat] = total;
    }
  }

  const effective = { ...base };

  for (const stat of COMBAT_STATS) {
    effective[stat] = base[stat] + (bonuses[stat] ?? 0);
  }

  return { base, effective, bonuses };
}

export function getEffectiveStrength(
  warrior: WarriorCombatStatSource,
  statusEffects?: ActiveStatusEffect[],
  statBuffs?: Pick<WarriorStatBuffInstance, "turnsRemaining" | "statModifiers">[]
): number {
  return resolveCombatStats(warrior, statusEffects, statBuffs).effective
    .strength;
}

export function getEffectiveSpeed(
  warrior: WarriorCombatStatSource,
  statusEffects?: ActiveStatusEffect[],
  statBuffs?: Pick<WarriorStatBuffInstance, "turnsRemaining" | "statModifiers">[]
): number {
  return resolveCombatStats(warrior, statusEffects, statBuffs).effective.speed;
}

export function toEffectiveSkillCasterCombatStats(
  warrior: WarriorCombatStatSource,
  statusEffects?: ActiveStatusEffect[],
  statBuffs?: Pick<WarriorStatBuffInstance, "turnsRemaining" | "statModifiers">[]
): SkillCasterCombatStats {
  return {
    strength: getEffectiveStrength(warrior, statusEffects, statBuffs),
  };
}

export function toEffectiveSpellCasterCombatStats(
  warrior: WarriorCombatStatSource,
  statusEffects?: ActiveStatusEffect[],
  statBuffs?: Pick<WarriorStatBuffInstance, "turnsRemaining" | "statModifiers">[]
): SpellCasterCombatStats {
  const { effective } = resolveCombatStats(warrior, statusEffects, statBuffs);
  return {
    faith: effective.faith,
    spellDamage: effective.spellDamage,
  };
}

/** First active transform status effect key, for sprite override. */
export function getActiveTransformStatusEffectKey(
  statusEffects: ActiveStatusEffect[] | undefined
): string | undefined {
  for (const effect of statusEffects ?? []) {
    if (
      effect.turnsRemaining > 0 &&
      isTransformStatusEffectKey(effect.effectKey)
    ) {
      return effect.effectKey;
    }
  }

  return undefined;
}
