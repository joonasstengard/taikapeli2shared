import { isAbilityUnlocked } from "../warriors/isAbilityUnlocked";

export interface BattleWarriorStartSnapshot {
  warriorId: number;
  armyId: number;
  level: number;
  experience: number;
  takedowns: number;
  health: number;
  mana: number;
  strength: number;
  stamina: number;
  speed: number;
  faith: number;
  spellDamage: number;
}

export interface BattleKillEntry {
  attackerId: number;
  victimId: number;
}

export interface BattleRuntimeSummary {
  warriorSnapshots: BattleWarriorStartSnapshot[];
  kills: BattleKillEntry[];
  /** Highest total enemy HP removed by one player action this battle. */
  maxPlayerActionDamage: number;
  /** Highest total player-army HP restored by one player action this battle. */
  maxPlayerActionHealing: number;
}

export const EMPTY_BATTLE_RUNTIME_SUMMARY: BattleRuntimeSummary = {
  warriorSnapshots: [],
  kills: [],
  maxPlayerActionDamage: 0,
  maxPlayerActionHealing: 0,
};

export interface BattleWarriorStatDeltas {
  health: number;
  mana: number;
  strength: number;
  stamina: number;
  speed: number;
  faith: number;
  spellDamage: number;
}

export interface BattleWarriorLevelUpResult {
  warriorId: number;
  xpGained: number;
  levelsGained: number;
  statDeltas: BattleWarriorStatDeltas;
  newSkillIds: number[];
  newSpellIds: number[];
}

export interface BattleSummary {
  winnerArmyId: number;
  playersArmyId: number;
  winnerGold: number;
  loserGold: number;
  nationHealthLost: number;
  survivorCount: number;
  kills: BattleKillEntry[];
  playerLevelUps: BattleWarriorLevelUpResult[];
}

export interface BattleVictoryEconomy {
  winnerGold: number;
  loserGold: number;
  nationHealthLost: number;
  survivorCount: number;
}

const STAT_KEYS = [
  "health",
  "mana",
  "strength",
  "stamina",
  "speed",
  "faith",
  "spellDamage",
] as const satisfies ReadonlyArray<keyof BattleWarriorStatDeltas>;

type SnapshotSource = {
  id: number;
  armyId: number | null;
  level: number;
  experience: number;
  takedowns: number;
  health: number;
  mana: number;
  strength: number;
  stamina: number;
  speed: number;
  faith: number;
  spellDamage: number;
};

type WarriorEndState = SnapshotSource & {
  skills: Array<{ id: number; requiredLevel: number }>;
  spells: Array<{ id: number; requiredLevel: number }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseWarriorSnapshot(value: unknown): BattleWarriorStartSnapshot | null {
  if (!isRecord(value)) {
    return null;
  }

  const warriorId = toNumber(value.warriorId);
  const armyId = toNumber(value.armyId);

  if (warriorId <= 0 || armyId <= 0) {
    return null;
  }

  return {
    warriorId,
    armyId,
    level: toNumber(value.level),
    experience: toNumber(value.experience),
    takedowns: toNumber(value.takedowns),
    health: toNumber(value.health),
    mana: toNumber(value.mana),
    strength: toNumber(value.strength),
    stamina: toNumber(value.stamina),
    speed: toNumber(value.speed),
    faith: toNumber(value.faith),
    spellDamage: toNumber(value.spellDamage),
  };
}

function parseKillEntry(value: unknown): BattleKillEntry | null {
  if (!isRecord(value)) {
    return null;
  }

  const attackerId = toNumber(value.attackerId);
  const victimId = toNumber(value.victimId);

  if (attackerId <= 0 || victimId <= 0) {
    return null;
  }

  return { attackerId, victimId };
}

export function parseBattleRuntimeSummary(
  value: unknown
): BattleRuntimeSummary {
  if (!isRecord(value)) {
    return EMPTY_BATTLE_RUNTIME_SUMMARY;
  }

  const warriorSnapshots = Array.isArray(value.warriorSnapshots)
    ? value.warriorSnapshots
        .map(parseWarriorSnapshot)
        .filter((snapshot): snapshot is BattleWarriorStartSnapshot =>
          Boolean(snapshot)
        )
    : [];

  const kills = Array.isArray(value.kills)
    ? value.kills
        .map(parseKillEntry)
        .filter((kill): kill is BattleKillEntry => Boolean(kill))
    : [];

  return {
    warriorSnapshots,
    kills,
    maxPlayerActionDamage: Math.max(0, toNumber(value.maxPlayerActionDamage)),
    maxPlayerActionHealing: Math.max(0, toNumber(value.maxPlayerActionHealing)),
  };
}

export function createBattleWarriorSnapshots(
  warriors: SnapshotSource[]
): BattleWarriorStartSnapshot[] {
  return warriors
    .filter((warrior): warrior is SnapshotSource & { armyId: number } =>
      warrior.armyId != null
    )
    .map((warrior) => ({
      warriorId: warrior.id,
      armyId: warrior.armyId,
      level: warrior.level,
      experience: warrior.experience,
      takedowns: warrior.takedowns,
      health: warrior.health,
      mana: warrior.mana,
      strength: warrior.strength,
      stamina: warrior.stamina,
      speed: warrior.speed,
      faith: warrior.faith,
      spellDamage: warrior.spellDamage,
    }));
}

function computeStatDeltas(
  snapshot: BattleWarriorStartSnapshot,
  warrior: WarriorEndState
): BattleWarriorStatDeltas {
  return {
    health: warrior.health - snapshot.health,
    mana: warrior.mana - snapshot.mana,
    strength: warrior.strength - snapshot.strength,
    stamina: warrior.stamina - snapshot.stamina,
    speed: warrior.speed - snapshot.speed,
    faith: warrior.faith - snapshot.faith,
    spellDamage: warrior.spellDamage - snapshot.spellDamage,
  };
}

function getNewlyUnlockedAbilityIds(
  abilities: Array<{ id: number; requiredLevel: number }>,
  startLevel: number,
  endLevel: number
): number[] {
  return abilities
    .filter(
      (ability) =>
        ability.requiredLevel > startLevel &&
        isAbilityUnlocked(endLevel, ability.requiredLevel)
    )
    .map((ability) => ability.id);
}

export function buildBattleSummary(params: {
  winnerArmyId: number;
  playersArmyId: number;
  warriors: WarriorEndState[];
  runtimeSummary: BattleRuntimeSummary;
  economy: BattleVictoryEconomy;
}): BattleSummary {
  const snapshotByWarriorId = new Map(
    params.runtimeSummary.warriorSnapshots.map((snapshot) => [
      snapshot.warriorId,
      snapshot,
    ])
  );

  const playerLevelUps: BattleWarriorLevelUpResult[] = [];

  for (const warrior of params.warriors) {
    if (warrior.armyId !== params.playersArmyId) {
      continue;
    }

    const snapshot = snapshotByWarriorId.get(warrior.id);
    if (!snapshot) {
      continue;
    }

    const levelsGained = warrior.level - snapshot.level;
    if (levelsGained <= 0) {
      continue;
    }

    playerLevelUps.push({
      warriorId: warrior.id,
      xpGained: warrior.experience - snapshot.experience,
      levelsGained,
      statDeltas: computeStatDeltas(snapshot, warrior),
      newSkillIds: getNewlyUnlockedAbilityIds(
        warrior.skills,
        snapshot.level,
        warrior.level
      ),
      newSpellIds: getNewlyUnlockedAbilityIds(
        warrior.spells,
        snapshot.level,
        warrior.level
      ),
    });
  }

  playerLevelUps.sort((left, right) => left.warriorId - right.warriorId);

  return {
    winnerArmyId: params.winnerArmyId,
    playersArmyId: params.playersArmyId,
    winnerGold: params.economy.winnerGold,
    loserGold: params.economy.loserGold,
    nationHealthLost: params.economy.nationHealthLost,
    survivorCount: params.economy.survivorCount,
    kills: [...params.runtimeSummary.kills],
    playerLevelUps,
  };
}

export function listBattleSummaryStatDeltas(
  statDeltas: BattleWarriorStatDeltas
): Array<{ key: keyof BattleWarriorStatDeltas; delta: number }> {
  return STAT_KEYS.flatMap((key) => {
    const delta = statDeltas[key];
    if (delta === 0) {
      return [];
    }

    return [{ key, delta }];
  });
}
