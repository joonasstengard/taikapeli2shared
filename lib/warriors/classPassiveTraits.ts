import type { WarriorClass } from "./warriorPictureVariants";
import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";
import {
  isWarriorFrozen,
  upsertWarriorStatusEffect,
} from "../statusEffects/warriorStatusEffect";
import type { WarriorStatusEffect } from "../statusEffects/warriorStatusEffect";

export const CLASS_PASSIVE_TRAIT_KEYS = {
  plateBearing: "plateBearing",
  sanctified: "sanctified",
  soulHarvest: "soulHarvest",
  relentlessPursuit: "relentlessPursuit",
  rend: "rend",
  devotion: "devotion",
  manaMastery: "manaMastery",
  cleave: "cleave",
  braced: "braced",
  huntersMark: "huntersMark",
  kingsCommand: "kingsCommand",
} as const;

export type ClassPassiveTraitKey =
  (typeof CLASS_PASSIVE_TRAIT_KEYS)[keyof typeof CLASS_PASSIVE_TRAIT_KEYS];

export interface ClassPassiveTraitDefinition {
  key: ClassPassiveTraitKey;
  name: string;
  description: string;
}

export const CLASS_PASSIVE_TRAIT_DEFINITIONS: Record<
  ClassPassiveTraitKey,
  ClassPassiveTraitDefinition
> = {
  [CLASS_PASSIVE_TRAIT_KEYS.plateBearing]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.plateBearing,
    name: "Plate Bearing",
    description:
      "Take 1 less damage from basic attacks (to a minimum of 1).",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.sanctified]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.sanctified,
    name: "Sanctified",
    description: "All Holy spells heal the caster for 1.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.soulHarvest]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.soulHarvest,
    name: "Soul Harvest",
    description: "Restore 1 mana when you score a takedown.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.relentlessPursuit]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.relentlessPursuit,
    name: "Relentless Pursuit",
    description: "Restore 1 stamina when you score a takedown.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.rend]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.rend,
    name: "Rend",
    description: "Basic attacks inflict Bleeding for 1 turn.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.devotion]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.devotion,
    name: "Devotion",
    description: "Healing spells restore 1 additional health.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.manaMastery]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.manaMastery,
    name: "Mana Mastery",
    description: "Restore 1 mana after casting any spell.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.cleave]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.cleave,
    name: "Cleave",
    description:
      "Basic attacks deal 1 damage to enemies on the left and right sides of the target.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.braced]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.braced,
    name: "Braced",
    description:
      "If you have not moved this turn, basic attacks deal 1 additional damage.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.huntersMark]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.huntersMark,
    name: "Hunter's Mark",
    description:
      "Basic attacks deal 1 additional damage to Frozen enemies.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.kingsCommand]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.kingsCommand,
    name: "The King's Command",
    description:
      "Restore 1 stamina to all other alive allies after using a skill or casting a spell.",
  },
};

/** Passive trait granted to each warrior class. Omit classes with no trait yet. */
export const CLASS_PASSIVE_TRAITS: Partial<
  Record<WarriorClass, ClassPassiveTraitKey>
> = {
  Knight: CLASS_PASSIVE_TRAIT_KEYS.plateBearing,
  Paladin: CLASS_PASSIVE_TRAIT_KEYS.sanctified,
  Necromancer: CLASS_PASSIVE_TRAIT_KEYS.soulHarvest,
  Horseman: CLASS_PASSIVE_TRAIT_KEYS.relentlessPursuit,
  Raider: CLASS_PASSIVE_TRAIT_KEYS.rend,
  Priestess: CLASS_PASSIVE_TRAIT_KEYS.devotion,
  Sorcerer: CLASS_PASSIVE_TRAIT_KEYS.manaMastery,
  Moonblade: CLASS_PASSIVE_TRAIT_KEYS.cleave,
  Marksman: CLASS_PASSIVE_TRAIT_KEYS.braced,
  Ranger: CLASS_PASSIVE_TRAIT_KEYS.huntersMark,
  King: CLASS_PASSIVE_TRAIT_KEYS.kingsCommand,
};

export function getClassPassiveTraitForClass(
  warriorClass: string
): ClassPassiveTraitDefinition | null {
  const traitKey = CLASS_PASSIVE_TRAITS[warriorClass as WarriorClass];
  if (!traitKey) {
    return null;
  }

  return CLASS_PASSIVE_TRAIT_DEFINITIONS[traitKey];
}

export const BASIC_ATTACK_BLEEDING_DURATION = 1;

export function grantsBasicAttackBleeding(attackerClass: string): boolean {
  const trait = getClassPassiveTraitForClass(attackerClass);
  return trait?.key === CLASS_PASSIVE_TRAIT_KEYS.rend;
}

export const CLEAVE_SPLASH_DAMAGE = 1;

export function grantsBasicAttackCleave(attackerClass: string): boolean {
  const trait = getClassPassiveTraitForClass(attackerClass);
  return trait?.key === CLASS_PASSIVE_TRAIT_KEYS.cleave;
}

export function applyBasicAttackBleedingToWarrior(
  statusEffects: WarriorStatusEffect[] | undefined
): WarriorStatusEffect[] {
  return upsertWarriorStatusEffect(
    statusEffects,
    {
      effectKey: STATUS_EFFECT_KEY.bleeding,
      name: "Bleeding",
      tags: [],
    },
    BASIC_ATTACK_BLEEDING_DURATION
  );
}

export function grantsHolySpellCastSelfHeal(
  casterClass: string,
  spellType: string | null
): boolean {
  const trait = getClassPassiveTraitForClass(casterClass);
  return (
    trait?.key === CLASS_PASSIVE_TRAIT_KEYS.sanctified && spellType === "Holy"
  );
}

export const DEVOTION_SPELL_HEAL_BONUS = 1;

export function getDevotionSpellHealBonus(casterClass: string | undefined): number {
  const trait = casterClass
    ? getClassPassiveTraitForClass(casterClass)
    : null;
  return trait?.key === CLASS_PASSIVE_TRAIT_KEYS.devotion
    ? DEVOTION_SPELL_HEAL_BONUS
    : 0;
}

export function grantsSpellCastManaMasteryRestore(
  casterClass: string
): boolean {
  const trait = getClassPassiveTraitForClass(casterClass);
  return trait?.key === CLASS_PASSIVE_TRAIT_KEYS.manaMastery;
}

export function applySpellCastManaMasteryRestoreToWarrior(warrior: {
  class: string;
  currentMana: number;
  mana: number;
}): Pick<TakedownTraitWarriorResources, "currentMana"> {
  if (!grantsSpellCastManaMasteryRestore(warrior.class)) {
    return { currentMana: warrior.currentMana };
  }

  return {
    currentMana: Math.min(warrior.currentMana + 1, warrior.mana),
  };
}

export const KINGS_COMMAND_ALLY_STAMINA_RESTORE = 1;

export function grantsKingsCommandAllyStaminaRestore(
  casterClass: string
): boolean {
  const trait = getClassPassiveTraitForClass(casterClass);
  return trait?.key === CLASS_PASSIVE_TRAIT_KEYS.kingsCommand;
}

export interface KingsCommandAllyWarrior {
  id: number;
  armyId: number;
  currentHealth: number;
  currentStamina: number;
  stamina: number;
}

export function applyKingsCommandStaminaRestoreToAlly(
  ally: KingsCommandAllyWarrior,
  caster: { id: number; class: string; armyId: number }
): Pick<KingsCommandAllyWarrior, "currentStamina"> {
  if (
    !grantsKingsCommandAllyStaminaRestore(caster.class) ||
    ally.id === caster.id ||
    ally.armyId !== caster.armyId ||
    ally.currentHealth <= 0
  ) {
    return { currentStamina: ally.currentStamina };
  }

  return {
    currentStamina: Math.min(
      ally.currentStamina + KINGS_COMMAND_ALLY_STAMINA_RESTORE,
      ally.stamina
    ),
  };
}

export interface TakedownTraitWarriorResources {
  class: string;
  currentMana: number;
  mana: number;
  currentStamina: number;
  stamina: number;
}

/** Applies takedown trait resource restore for battle replay and tests. */
export function applyTakedownTraitRestoreToWarrior(
  warrior: TakedownTraitWarriorResources
): Pick<TakedownTraitWarriorResources, "currentMana" | "currentStamina"> {
  const trait = getClassPassiveTraitForClass(warrior.class);

  switch (trait?.key) {
    case CLASS_PASSIVE_TRAIT_KEYS.soulHarvest:
      return {
        currentMana: Math.min(warrior.currentMana + 1, warrior.mana),
        currentStamina: warrior.currentStamina,
      };
    case CLASS_PASSIVE_TRAIT_KEYS.relentlessPursuit:
      return {
        currentMana: warrior.currentMana,
        currentStamina: Math.min(warrior.currentStamina + 1, warrior.stamina),
      };
    default:
      return {
        currentMana: warrior.currentMana,
        currentStamina: warrior.currentStamina,
      };
  }
}

export const BRACED_BASIC_ATTACK_DAMAGE_BONUS = 1;
export const HUNTERS_MARK_BASIC_ATTACK_DAMAGE_BONUS = 1;

export interface BasicAttackDamageModifiers {
  attackerClass?: string;
  attackerHasMovedThisTurn?: boolean | number;
  defenderStatusEffects?: Pick<
    WarriorStatusEffect,
    "effectKey" | "turnsRemaining"
  >[];
}

export function grantsBracedBasicAttackBonus(
  attackerClass: string,
  attackerHasMovedThisTurn: boolean | number | undefined
): boolean {
  const trait = getClassPassiveTraitForClass(attackerClass);
  return (
    trait?.key === CLASS_PASSIVE_TRAIT_KEYS.braced &&
    attackerHasMovedThisTurn !== 1 &&
    attackerHasMovedThisTurn !== true
  );
}

export function grantsHuntersMarkBasicAttackBonus(
  attackerClass: string,
  defenderStatusEffects: BasicAttackDamageModifiers["defenderStatusEffects"]
): boolean {
  const trait = getClassPassiveTraitForClass(attackerClass);
  return (
    trait?.key === CLASS_PASSIVE_TRAIT_KEYS.huntersMark &&
    isWarriorFrozen(defenderStatusEffects)
  );
}

function getBasicAttackOffensiveBonus(
  modifiers: BasicAttackDamageModifiers | undefined
): number {
  if (!modifiers?.attackerClass) {
    return 0;
  }

  let bonus = 0;

  if (
    grantsBracedBasicAttackBonus(
      modifiers.attackerClass,
      modifiers.attackerHasMovedThisTurn
    )
  ) {
    bonus += BRACED_BASIC_ATTACK_DAMAGE_BONUS;
  }

  if (
    grantsHuntersMarkBasicAttackBonus(
      modifiers.attackerClass,
      modifiers.defenderStatusEffects
    )
  ) {
    bonus += HUNTERS_MARK_BASIC_ATTACK_DAMAGE_BONUS;
  }

  return bonus;
}

/** Damage dealt by a basic attack command (not skills or spells). */
export function calculateBasicAttackDamage(
  attackPower: number,
  defenderClass: string,
  modifiers?: BasicAttackDamageModifiers
): number {
  const rawDamage =
    Math.max(0, attackPower) + getBasicAttackOffensiveBonus(modifiers);
  const trait = getClassPassiveTraitForClass(defenderClass);

  if (!trait) {
    return rawDamage;
  }

  switch (trait.key) {
    case CLASS_PASSIVE_TRAIT_KEYS.plateBearing:
      return Math.max(1, rawDamage - 1);
    default:
      return rawDamage;
  }
}
