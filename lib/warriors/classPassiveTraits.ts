import type { WarriorClass, WarriorGender } from "./warriorPictureVariants";
import { STATUS_EFFECT_KEY } from "../statusEffects/statusEffectTypes";
import { isWarriorBleeding } from "../abilities/requiresBleedingTarget";
import {
  isWarriorFrozen,
  isWarriorStunned,
  upsertWarriorStatusEffect,
} from "../statusEffects/warriorStatusEffect";
import type { WarriorStatusEffect } from "../statusEffects/warriorStatusEffect";
import { getWarriorRace, type WarriorRace } from "./warriorRaces";

export const CLASS_PASSIVE_TRAIT_KEYS = {
  plateBearing: "plateBearing",
  sanctified: "sanctified",
  soulHarvest: "soulHarvest",
  relentlessPursuit: "relentlessPursuit",
  rend: "rend",
  devotion: "devotion",
  // unused atm, repurpose later
  manaMastery: "manaMastery",
  cleave: "cleave",
  braced: "braced",
  huntersMark: "huntersMark",
  kingsCommand: "kingsCommand",
  humbleOrigins: "humbleOrigins",
  wildChannel: "wildChannel",
  bloodFeud: "bloodFeud",
  eldritchSpite: "eldritchSpite",
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
    description: "Restore 1 health after casting a Holy spell.",
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
    description: "Basic attacks inflict Bleeding for 2 turns.",
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
      "Basic attacks deal 1 additional damage to Frozen, Bleeding, or Stunned enemies.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.kingsCommand]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.kingsCommand,
    name: "The King's Command",
    description:
      "Grant +1 strength for 1 turn to all other alive allies after using a skill or casting a spell.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.humbleOrigins]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.humbleOrigins,
    name: "Humble Origins",
    description:
      "Gain 10% more experience from all sources. Level ups grant +1 extra stat permanently to a random stat.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.wildChannel]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.wildChannel,
    name: "Wild Channel",
    description:
      "Restore 1 stamina after casting a Primal spell, and restore 1 mana after using a Primal skill.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.bloodFeud]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.bloodFeud,
    name: "Blood Feud",
    description:
      "Basic attacks and skills deal 1 additional damage to Humans and Elves.",
  },
  [CLASS_PASSIVE_TRAIT_KEYS.eldritchSpite]: {
    key: CLASS_PASSIVE_TRAIT_KEYS.eldritchSpite,
    name: "Eldritch Spite",
    description:
      "Basic attacks and spells deal 1 additional damage to Orcs.",
  },
};

/** Passive trait granted to each warrior class. Omit classes with no trait yet. */
export const CLASS_PASSIVE_TRAITS: Partial<
  Record<WarriorClass, ClassPassiveTraitKey>
> = {
  Knight: CLASS_PASSIVE_TRAIT_KEYS.plateBearing,
  Paladin: CLASS_PASSIVE_TRAIT_KEYS.sanctified,
  Warlock: CLASS_PASSIVE_TRAIT_KEYS.soulHarvest,
  Charger: CLASS_PASSIVE_TRAIT_KEYS.relentlessPursuit,
  Berserker: CLASS_PASSIVE_TRAIT_KEYS.rend,
  Priestess: CLASS_PASSIVE_TRAIT_KEYS.devotion,
  Sorcerer: CLASS_PASSIVE_TRAIT_KEYS.eldritchSpite,
  Moonblade: CLASS_PASSIVE_TRAIT_KEYS.cleave,
  Marksman: CLASS_PASSIVE_TRAIT_KEYS.braced,
  Ranger: CLASS_PASSIVE_TRAIT_KEYS.huntersMark,
  King: CLASS_PASSIVE_TRAIT_KEYS.kingsCommand,
  Peasant: CLASS_PASSIVE_TRAIT_KEYS.humbleOrigins,
  Shaman: CLASS_PASSIVE_TRAIT_KEYS.wildChannel,
  Brutalizer: CLASS_PASSIVE_TRAIT_KEYS.bloodFeud,
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

export const HUMBLE_ORIGINS_EXPERIENCE_BONUS_PERCENT = 10;

export const HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS = [
  "health",
  "mana",
  "strength",
  "stamina",
  "speed",
  "faith",
  "spellDamage",
] as const;

export type HumbleOriginsLevelUpStatKey =
  (typeof HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS)[number];

export interface HumbleOriginsLevelUpStats extends Record<
  HumbleOriginsLevelUpStatKey,
  number
> {
  currentHealth: number;
  currentMana: number;
  currentStamina: number;
}

export function grantsHumbleOriginsTrait(warriorClass: string): boolean {
  const trait = getClassPassiveTraitForClass(warriorClass);
  return trait?.key === CLASS_PASSIVE_TRAIT_KEYS.humbleOrigins;
}

/** Applies Humble Origins +10% XP bonus when the warrior has the trait. */
export function applyHumbleOriginsExperienceBonus(
  warriorClass: string,
  amount: number
): number {
  if (amount <= 0 || !grantsHumbleOriginsTrait(warriorClass)) {
    return amount;
  }

  return Math.round(
    amount * (1 + HUMBLE_ORIGINS_EXPERIENCE_BONUS_PERCENT / 100)
  );
}

/** Applies +1 to one random permanent stat after a level up. */
export function applyHumbleOriginsLevelUpBonus<T extends HumbleOriginsLevelUpStats>(
  stats: T,
  randomStatIndex: number
): T {
  const statKey =
    HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS[
      randomStatIndex % HUMBLE_ORIGINS_LEVEL_UP_STAT_KEYS.length
    ];
  const wasDefeated = stats.currentHealth <= 0;
  const updated = { ...stats, [statKey]: stats[statKey] + 1 };

  if (statKey === "health" && !wasDefeated) {
    updated.currentHealth = Math.min(updated.currentHealth + 1, updated.health);
  }

  if (statKey === "mana" && !wasDefeated) {
    updated.currentMana = Math.min(updated.currentMana + 1, updated.mana);
  }

  if (statKey === "stamina" && !wasDefeated) {
    updated.currentStamina = Math.min(
      updated.currentStamina + 1,
      updated.stamina
    );
  }

  return updated;
}

export const BASIC_ATTACK_BLEEDING_DURATION = 2;

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
  warriorClass: string;
  currentMana: number;
  mana: number;
}): Pick<TakedownTraitWarriorResources, "currentMana"> {
  if (!grantsSpellCastManaMasteryRestore(warrior.warriorClass)) {
    return { currentMana: warrior.currentMana };
  }

  return {
    currentMana: Math.min(warrior.currentMana + 1, warrior.mana),
  };
}

export const WILD_CHANNEL_PRIMAL_SPELL_STAMINA_RESTORE = 1;
export const WILD_CHANNEL_PRIMAL_SKILL_MANA_RESTORE = 1;

export function grantsWildChannelPrimalSpellStaminaRestore(
  casterClass: string,
  spellType: string | null
): boolean {
  const trait = getClassPassiveTraitForClass(casterClass);
  return (
    trait?.key === CLASS_PASSIVE_TRAIT_KEYS.wildChannel && spellType === "Primal"
  );
}

export function grantsWildChannelPrimalSkillManaRestore(
  casterClass: string,
  skillType: string | null
): boolean {
  const trait = getClassPassiveTraitForClass(casterClass);
  return (
    trait?.key === CLASS_PASSIVE_TRAIT_KEYS.wildChannel && skillType === "Primal"
  );
}

export function applyWildChannelPrimalSpellStaminaRestoreToWarrior(
  warrior: {
    warriorClass: string;
    currentStamina: number;
    stamina: number;
  },
  spellType: string | null
): Pick<TakedownTraitWarriorResources, "currentStamina"> {
  if (
    !grantsWildChannelPrimalSpellStaminaRestore(
      warrior.warriorClass,
      spellType
    )
  ) {
    return { currentStamina: warrior.currentStamina };
  }

  return {
    currentStamina: Math.min(
      warrior.currentStamina + WILD_CHANNEL_PRIMAL_SPELL_STAMINA_RESTORE,
      warrior.stamina
    ),
  };
}

export function applyWildChannelPrimalSkillManaRestoreToWarrior(
  warrior: {
    warriorClass: string;
    currentMana: number;
    mana: number;
  },
  skillType: string | null
): Pick<TakedownTraitWarriorResources, "currentMana"> {
  if (
    !grantsWildChannelPrimalSkillManaRestore(warrior.warriorClass, skillType)
  ) {
    return { currentMana: warrior.currentMana };
  }

  return {
    currentMana: Math.min(
      warrior.currentMana + WILD_CHANNEL_PRIMAL_SKILL_MANA_RESTORE,
      warrior.mana
    ),
  };
}

export const KINGS_COMMAND_STRENGTH_BUFF_BONUS = 1;
export const KINGS_COMMAND_STRENGTH_BUFF_DURATION = 1;
export const KINGS_COMMAND_STRENGTH_BUFF_LABEL = "King's Command";

export function grantsKingsCommandAllyStrengthBuff(
  casterClass: string
): boolean {
  const trait = getClassPassiveTraitForClass(casterClass);
  return trait?.key === CLASS_PASSIVE_TRAIT_KEYS.kingsCommand;
}

export interface KingsCommandAllyTarget {
  id: number;
  armyId: number;
  currentHealth: number;
}

export function isKingsCommandStrengthBuffTarget(
  ally: KingsCommandAllyTarget,
  caster: { id: number; warriorClass: string; armyId: number }
): boolean {
  return (
    grantsKingsCommandAllyStrengthBuff(caster.warriorClass) &&
    ally.id !== caster.id &&
    ally.armyId === caster.armyId &&
    ally.currentHealth > 0
  );
}

export function createKingsCommandStrengthBuffParams(): {
  statModifiers: { strength: number };
  duration: number;
  label: string;
} {
  return {
    statModifiers: { strength: KINGS_COMMAND_STRENGTH_BUFF_BONUS },
    duration: KINGS_COMMAND_STRENGTH_BUFF_DURATION,
    label: KINGS_COMMAND_STRENGTH_BUFF_LABEL,
  };
}

export interface TakedownTraitWarriorResources {
  warriorClass: string;
  currentMana: number;
  mana: number;
  currentStamina: number;
  stamina: number;
}

/** Applies takedown trait resource restore for battle replay and tests. */
export function applyTakedownTraitRestoreToWarrior(
  warrior: TakedownTraitWarriorResources
): Pick<TakedownTraitWarriorResources, "currentMana" | "currentStamina"> {
  const trait = getClassPassiveTraitForClass(warrior.warriorClass);

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
export const BLOOD_FEUD_DAMAGE_BONUS = 1;
export const ELDRITCH_SPITE_DAMAGE_BONUS = 1;

export const BLOOD_FEUD_TARGET_RACES: readonly WarriorRace[] = [
  "Human",
  "Elf",
];

export const ELDRITCH_SPITE_TARGET_RACES: readonly WarriorRace[] = ["Orc"];

export interface BasicAttackDamageModifiers {
  attackerClass?: string;
  attackerHasMovedThisTurn?: boolean | number;
  defenderStatusEffects?: Pick<
    WarriorStatusEffect,
    "effectKey" | "turnsRemaining"
  >[];
  defenderRace?: WarriorRace | string;
}

export interface RaceBonusDefenderIdentity {
  warriorClass: string;
  gender: string;
  picture: number;
}

export type BloodFeudDefenderIdentity = RaceBonusDefenderIdentity;

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
    (isWarriorFrozen(defenderStatusEffects) ||
      isWarriorBleeding(defenderStatusEffects) ||
      isWarriorStunned(defenderStatusEffects))
  );
}

export function isBloodFeudTargetRace(
  defenderRace: WarriorRace | string | undefined
): boolean {
  return (
    !!defenderRace &&
    (BLOOD_FEUD_TARGET_RACES as readonly string[]).includes(defenderRace)
  );
}

export function grantsBloodFeudDamageBonus(
  attackerClass: string,
  defenderRace: WarriorRace | string | undefined
): boolean {
  const trait = getClassPassiveTraitForClass(attackerClass);
  return (
    trait?.key === CLASS_PASSIVE_TRAIT_KEYS.bloodFeud &&
    isBloodFeudTargetRace(defenderRace)
  );
}

export function getBloodFeudDamageBonus(
  attackerClass: string | undefined,
  defenderRace: WarriorRace | string | undefined
): number {
  if (!attackerClass || !grantsBloodFeudDamageBonus(attackerClass, defenderRace)) {
    return 0;
  }

  return BLOOD_FEUD_DAMAGE_BONUS;
}

export function getBloodFeudDamageBonusAgainstWarrior(
  attackerClass: string | undefined,
  defender: RaceBonusDefenderIdentity | undefined
): number {
  if (!attackerClass || !defender) {
    return 0;
  }

  return getBloodFeudDamageBonus(
    attackerClass,
    getWarriorRace(
      defender.warriorClass as WarriorClass,
      defender.gender as WarriorGender,
      defender.picture
    )
  );
}

export function isEldritchSpiteTargetRace(
  defenderRace: WarriorRace | string | undefined
): boolean {
  return (
    !!defenderRace &&
    (ELDRITCH_SPITE_TARGET_RACES as readonly string[]).includes(defenderRace)
  );
}

export function grantsEldritchSpiteDamageBonus(
  attackerClass: string,
  defenderRace: WarriorRace | string | undefined
): boolean {
  const trait = getClassPassiveTraitForClass(attackerClass);
  return (
    trait?.key === CLASS_PASSIVE_TRAIT_KEYS.eldritchSpite &&
    isEldritchSpiteTargetRace(defenderRace)
  );
}

export function getEldritchSpiteDamageBonus(
  attackerClass: string | undefined,
  defenderRace: WarriorRace | string | undefined
): number {
  if (
    !attackerClass ||
    !grantsEldritchSpiteDamageBonus(attackerClass, defenderRace)
  ) {
    return 0;
  }

  return ELDRITCH_SPITE_DAMAGE_BONUS;
}

export function getEldritchSpiteDamageBonusAgainstWarrior(
  attackerClass: string | undefined,
  defender: RaceBonusDefenderIdentity | undefined
): number {
  if (!attackerClass || !defender) {
    return 0;
  }

  return getEldritchSpiteDamageBonus(
    attackerClass,
    getWarriorRace(
      defender.warriorClass as WarriorClass,
      defender.gender as WarriorGender,
      defender.picture
    )
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

  bonus += getBloodFeudDamageBonus(
    modifiers.attackerClass,
    modifiers.defenderRace
  );

  bonus += getEldritchSpiteDamageBonus(
    modifiers.attackerClass,
    modifiers.defenderRace
  );

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
