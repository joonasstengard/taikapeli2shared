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
      health: "8-14",
      stamina: "5-13",
      speed: "3-13",
      strength: "3-10",
      armor: "2-7",
      resistance: "1-4",
    },
  },
  King: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "9-15",
      stamina: "6-12",
      speed: "2-9",
      strength: "2-11",
      armor: "3-8",
      resistance: "2-6",
    },
  },
  Knight: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "10-17",
      stamina: "3-12",
      speed: "1-6",
      strength: "4-11",
      armor: "6-12",
      resistance: "1-4",
    },
  },
  Paladin: {
    optionalStats: [...MANA_STATS, ...STAMINA_STATS, "faith"],
    weightedStats: {
      health: "8-15",
      stamina: "1-8",
      speed: "1-4",
      strength: "1-11",
      mana: "5-10",
      faith: "3-9",
      spellDamage: "1-3",
      armor: "4-10",
      resistance: "3-8",
    },
  },
  Peasant: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "4-10",
      stamina: "2-5",
      speed: "1-4",
      strength: "1-4",
      armor: "1-3",
      resistance: "1-3",
    },
  },
  Warlock: {
    optionalStats: MANA_STATS,
    weightedStats: {
      health: "5-13",
      speed: "1-7",
      mana: "7-12",
      spellDamage: "2-8",
      strength: "1-5",
      armor: "1-3",
      resistance: "4-10",
    },
  },
  Marksman: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "6-12",
      stamina: "4-7",
      strength: "3-7",
      attackRange: "2-2",
      speed: "1-2",
      armor: "1-4",
      resistance: "1-5",
    },
  },
  Moonblade: {
    optionalStats: [...MANA_STATS, ...STAMINA_STATS],
    weightedStats: {
      health: "7-12",
      stamina: "5-8",
      mana: "1-2",
      spellDamage: "1-2",
      speed: "4-11",
      strength: "7-13",
      armor: "1-5",
      resistance: "1-4",
    },
  },
  Priestess: {
    optionalStats: [...MANA_STATS, "faith"],
    weightedStats: {
      health: "5-13",
      speed: "3-10",
      mana: "6-12",
      faith: "5-16",
      strength: "1-5",
      spellDamage: "1-4",
      armor: "1-4",
      resistance: "3-9",
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
      armor: "1-4",
      resistance: "1-5",
    },
  },
  Berserker: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "6-14",
      stamina: "4-10",
      speed: "5-13",
      strength: "6-14",
      armor: "2-6",
      resistance: "1-4",
    },
  },
  Brutalizer: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "8-16",
      stamina: "4-9",
      speed: "2-7",
      strength: "8-16",
      armor: "5-11",
      resistance: "1-4",
    },
  },
  Shaman: {
    optionalStats: [...MANA_STATS, ...STAMINA_STATS],
    weightedStats: {
      health: "8-13",
      stamina: "4-6",
      speed: "3-8",
      strength: "4-8",
      mana: "2-5",
      spellDamage: "2-5",
      armor: "2-6",
      resistance: "2-7",
    },
  },
  Sorcerer: {
    optionalStats: [...MANA_STATS, "faith"],
    weightedStats: {
      health: "6-12",
      mana: "6-13",
      faith: "1-3",
      spellDamage: "5-12",
      speed: "1-9",
      armor: "1-3",
      resistance: "4-10",
    },
  },
  Infiltrator: {
    optionalStats: STAMINA_STATS,
    weightedStats: {
      health: "5-12",
      stamina: "4-6",
      speed: "6-18",
      strength: "5-11",
      armor: "1-5",
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
