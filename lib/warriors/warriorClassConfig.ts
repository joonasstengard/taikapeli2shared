import {
  WARRIOR_CLASSES,
  type WarriorClass,
} from "./warriorPictureVariants";

export { WARRIOR_CLASSES, type WarriorClass };

export type WarriorStat =
  | "health"
  | "mana"
  | "strength"
  | "stamina"
  | "speed"
  | "faith"
  | "spellDamage"
  | "armor"
  | "resistance"
  | "attackRange";

export const CONDITIONAL_WARRIOR_STATS = [
  "mana",
  "stamina",
  "faith",
  "spellDamage",
] as const satisfies readonly WarriorStat[];

export type ConditionalWarriorStat =
  (typeof CONDITIONAL_WARRIOR_STATS)[number];

export type StatRange = `${number}-${number}`;

export interface WarriorClassConfig {
  weightedStats: Partial<Record<WarriorStat, StatRange>>;
  optionalStats: readonly ConditionalWarriorStat[];
}

const MANA_STATS = ["mana", "spellDamage"] as const;
const STAMINA_STATS = ["stamina"] as const;

// Weighted class-based starting stats and the conditional stats each class uses.
export const WARRIOR_CLASS_CONFIG: Record<WarriorClass, WarriorClassConfig> = {
  Charger: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "6-12",
      stamina: "5-10",
      speed: "5-13",
      strength: "5-10",
      armor: "3-8",
      resistance: "1-4",
    },
  },
  King: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "9-15",
      stamina: "6-12",
      speed: "2-9",
      strength: "2-9",
      armor: "3-12",
      resistance: "2-6",
    },
  },
  Knight: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "8-15",
      stamina: "3-11",
      speed: "1-5",
      strength: "4-10",
      armor: "6-16",
      resistance: "1-3",
    },
  },
  Paladin: {
    optionalStats: [...MANA_STATS, ...STAMINA_STATS, "faith"],
    weightedStats: {
      health: "7-13",
      stamina: "2-4",
      speed: "1-4",
      strength: "1-11",
      mana: "5-9",
      faith: "3-9",
      spellDamage: "1-3",
      armor: "4-10",
      resistance: "3-8",
    },
  },
  Peasant: {
    optionalStats: [...MANA_STATS, ...STAMINA_STATS, "faith"],
    weightedStats: {
      health: "4-10",
      stamina: "2-5",
      speed: "1-4",
      strength: "1-4",
      armor: "1-3",
      resistance: "1-3",
      mana: "1-1",
      faith: "1-1",
      spellDamage: "1-1",
    },
  },
  Warlock: {
    optionalStats: MANA_STATS,
    weightedStats: {
      health: "7-12",
      speed: "1-7",
      mana: "6-10",
      spellDamage: "3-10",
      strength: "1-5",
      armor: "2-6",
      resistance: "4-10",
    },
  },
  Marksman: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "6-11",
      stamina: "4-7",
      strength: "4-7",
      attackRange: "2-2",
      speed: "1-3",
      armor: "4-14",
      resistance: "1-2",
    },
  },
  Moonblade: {
    optionalStats: [...MANA_STATS, ...STAMINA_STATS],
    weightedStats: {
      health: "7-12",
      stamina: "5-7",
      mana: "1-2",
      spellDamage: "1-2",
      speed: "4-10",
      strength: "6-13",
      armor: "1-2",
      resistance: "3-12",
    },
  },
  Priestess: {
    optionalStats: [...MANA_STATS, "faith"],
    weightedStats: {
      health: "5-13",
      speed: "3-10",
      mana: "6-12",
      faith: "5-16",
      strength: "1-3",
      spellDamage: "1-4",
      armor: "1-1",
      resistance: "1-10",
    },
  },
  Ranger: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "5-9",
      stamina: "4-12",
      strength: "3-9",
      attackRange: "2-2",
      speed: "3-13",
      armor: "1-2",
      resistance: "2-6",
    },
  },
  Berserker: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "7-11",
      stamina: "4-9",
      speed: "5-12",
      strength: "6-13",
      armor: "3-8",
      resistance: "1-3",
    },
  },
  Brutalizer: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "7-14",
      stamina: "4-7",
      speed: "2-5",
      strength: "6-13",
      armor: "1-3",
      resistance: "1-6",
    },
  },
  Shaman: {
    optionalStats: [...MANA_STATS, ...STAMINA_STATS],
    weightedStats: {
      health: "8-13",
      stamina: "4-6",
      speed: "3-8",
      strength: "4-8",
      mana: "2-8",
      spellDamage: "2-5",
      armor: "1-4",
      resistance: "2-9",
    },
  },
  Sorcerer: {
    optionalStats: [...MANA_STATS, "faith"],
    weightedStats: {
      health: "6-12",
      mana: "6-12",
      faith: "1-3",
      spellDamage: "5-14",
      speed: "1-8",
      resistance: "4-15",
    },
  },
  Infiltrator: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "6-11",
      stamina: "4-8",
      speed: "6-18",
      strength: "6-12",
      armor: "1-4",
      resistance: "1-4",
    },
  },
};

export function isWarriorClass(value: string): value is WarriorClass {
  return (WARRIOR_CLASSES as readonly string[]).includes(value);
}

export function classUsesOptionalStat(
  warriorClass: string,
  stat: ConditionalWarriorStat
): boolean {
  return (
    isWarriorClass(warriorClass) &&
    WARRIOR_CLASS_CONFIG[warriorClass].optionalStats.includes(stat)
  );
}

export function warriorUsesStat(
  warriorClass: string,
  stat: WarriorStat
): boolean {
  return (
    !(CONDITIONAL_WARRIOR_STATS as readonly WarriorStat[]).includes(stat) ||
    classUsesOptionalStat(warriorClass, stat as ConditionalWarriorStat)
  );
}
