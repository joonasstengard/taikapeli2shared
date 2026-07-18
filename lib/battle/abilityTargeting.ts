

export type AbilityTargetingType =
  | "self"
  | "ally"
  | "otherAlly"
  | "enemy"
  | "enemyAoE"
  | "enemyChain"
  | "allAllies"
  | "otherAllies"
  | "allEnemies"
  | "tile";

/** Tile distance from the primary target for enemyAoE splash hits. */
export const ENEMY_AOE_SPLASH_RANGE = 1;

/** Tile distance used when spreading enemyChain hits to the next target. */
export const ENEMY_CHAIN_SPREAD_RANGE = 1;

export function isEnemyTargeting(
  targetingType: AbilityTargetingType
): targetingType is "enemy" | "enemyAoE" | "enemyChain" {
  return (
    targetingType === "enemy" ||
    targetingType === "enemyAoE" ||
    targetingType === "enemyChain"
  );
}

export function isEnemyAoETargeting(
  targetingType: AbilityTargetingType
): targetingType is "enemyAoE" {
  return targetingType === "enemyAoE";
}

export function isEnemyChainTargeting(
  targetingType: AbilityTargetingType
): targetingType is "enemyChain" {
  return targetingType === "enemyChain";
}

/** Single-target ally abilities (with or without the caster). */
export function isSingleAllyTargeting(
  targetingType: AbilityTargetingType
): targetingType is "ally" | "otherAlly" {
  return targetingType === "ally" || targetingType === "otherAlly";
}

export function isSingleTargetTargeting(
  targetingType: AbilityTargetingType
): targetingType is "ally" | "otherAlly" | "enemy" | "enemyAoE" | "enemyChain" {
  return isSingleAllyTargeting(targetingType) || isEnemyTargeting(targetingType);
}

export function isValidAbilityTarget(
  targetingType: AbilityTargetingType,
  casterArmyId: number,
  targetArmyId: number
): boolean {
  if (isSingleAllyTargeting(targetingType)) {
    return casterArmyId === targetArmyId;
  }

  if (isEnemyTargeting(targetingType)) {
    return casterArmyId !== targetArmyId;
  }

  return true;
}

/**
 * Army + warrior identity checks for single-target abilities.
 * `otherAlly` requires a different ally (not the caster).
 */
export function isValidAbilityTargetWarrior(
  targetingType: AbilityTargetingType,
  caster: { id: number; armyId: number },
  target: { id: number; armyId: number }
): boolean {
  if (!isValidAbilityTarget(targetingType, caster.armyId, target.armyId)) {
    return false;
  }

  if (targetingType === "otherAlly" && caster.id === target.id) {
    return false;
  }

  return true;
}

/** Area abilities that hit allies in range (with or without the caster). */
export function isAllyAreaTargeting(
  targetingType: AbilityTargetingType
): targetingType is "allAllies" | "otherAllies" {
  return targetingType === "allAllies" || targetingType === "otherAllies";
}

export function isAreaTargeting(
  targetingType: AbilityTargetingType
): targetingType is "allAllies" | "otherAllies" | "allEnemies" {
  return isAllyAreaTargeting(targetingType) || targetingType === "allEnemies";
}

/** Abilities that fire immediately without selecting a map tile. */
export function isInstantCastTargeting(
  targetingType: AbilityTargetingType
): boolean {
  return targetingType === "self" || isAreaTargeting(targetingType);
}

/** Abilities that target an empty map tile (no warrior). */
export function isTileTargeting(
  targetingType: AbilityTargetingType
): targetingType is "tile" {
  return targetingType === "tile";
}

/** Targeting types that can apply supportive effects to allies. */
export function isAllySupportTargeting(
  targetingType: AbilityTargetingType
): boolean {
  return (
    targetingType === "self" ||
    isSingleAllyTargeting(targetingType) ||
    isAllyAreaTargeting(targetingType)
  );
}

/**
 * Living allies for single-target ally abilities.
 * `otherAlly` excludes the caster; `ally` includes them.
 */
export function filterSingleAllyTargets<T extends { id: number }>(
  targetingType: AbilityTargetingType,
  casterId: number,
  allies: readonly T[]
): T[] {
  if (targetingType === "otherAlly") {
    return allies.filter((ally) => ally.id !== casterId);
  }

  return allies.slice();
}

export interface AbilityTargetWarrior {
  id: number;
  armyId: number;
  currentHealth: number;
  battleTileCurrent: string | null;
}

const COLUMN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function calculateTileDistance(
  fromTile: string,
  toTile: string,
  mapWidth: number
): number {
  const columns = Array.from({ length: mapWidth }, (_, columnIndex) =>
    COLUMN_LETTERS[columnIndex]
  );
  const fromCol = columns.indexOf(fromTile[0]);
  const fromRow = parseInt(fromTile.slice(1), 10);
  const toCol = columns.indexOf(toTile[0]);
  const toRow = parseInt(toTile.slice(1), 10);
  return Math.max(Math.abs(toCol - fromCol), Math.abs(toRow - fromRow));
}

import { isWarriorAliveOnBattleMap } from "./tileOccupancy";

function isWithinRange(
  casterTile: string,
  targetTile: string,
  range: number,
  mapWidth: number
): boolean {
  return calculateTileDistance(casterTile, targetTile, mapWidth) <= range;
}

/**
 * Returns living warriors affected by an area ability.
 * `allAllies` includes the caster; `otherAllies` and `allEnemies` do not.
 * Never includes dead warriors.
 */
export function getAreaAbilityTargets<T extends AbilityTargetWarrior>(
  allWarriors: readonly T[],
  caster: AbilityTargetWarrior,
  range: number,
  targetingType: "allAllies" | "otherAllies" | "allEnemies",
  battleMapWidth: number
): T[] {
  if (!caster.battleTileCurrent) {
    return [];
  }

  return allWarriors.filter((warrior) => {
    if (targetingType !== "allAllies" && warrior.id === caster.id) {
      return false;
    }

    if (!isWarriorAliveOnBattleMap(warrior) || !warrior.battleTileCurrent) {
      return false;
    }

    if (
      !isWithinRange(
        caster.battleTileCurrent!,
        warrior.battleTileCurrent,
        range,
        battleMapWidth
      )
    ) {
      return false;
    }

    if (isAllyAreaTargeting(targetingType)) {
      return warrior.armyId === caster.armyId;
    }

    return warrior.armyId !== caster.armyId;
  }) as T[];
}

/**
 * Returns living enemy warriors within splash range of the primary target tile.
 * Never includes the primary target warrior.
 */
export function getEnemyAoESplashTargets<T extends AbilityTargetWarrior>(
  allWarriors: readonly T[],
  primaryTargetTile: string,
  casterArmyId: number,
  primaryTargetWarriorId: number,
  battleMapWidth: number,
  splashRange: number = ENEMY_AOE_SPLASH_RANGE
): T[] {
  return allWarriors.filter((warrior) => {
    if (warrior.id === primaryTargetWarriorId) {
      return false;
    }

    if (!isWarriorAliveOnBattleMap(warrior) || !warrior.battleTileCurrent) {
      return false;
    }

    if (!isValidAbilityTarget("enemy", casterArmyId, warrior.armyId)) {
      return false;
    }

    return isWithinRange(
      primaryTargetTile,
      warrior.battleTileCurrent,
      splashRange,
      battleMapWidth
    );
  }) as T[];
}

/**
 * Returns living enemy warriors connected to the primary target through
 * repeated spreadRange adjacency (BFS). Includes the primary target when alive.
 * Order is breadth-first from the primary target.
 *
 * Spread continues from the primary tile even if the primary is already defeated,
 * so chain hits still resolve after a killing blow on the first target.
 */
export function getEnemyChainSpreadTargets<T extends AbilityTargetWarrior>(
  allWarriors: readonly T[],
  primaryTargetWarriorId: number,
  casterArmyId: number,
  battleMapWidth: number,
  spreadRange: number = ENEMY_CHAIN_SPREAD_RANGE
): T[] {
  const primaryTarget = allWarriors.find(
    (warrior) => warrior.id === primaryTargetWarriorId
  );

  if (
    !primaryTarget?.battleTileCurrent ||
    !isValidAbilityTarget("enemy", casterArmyId, primaryTarget.armyId)
  ) {
    return [];
  }

  const visitedIds = new Set<number>();
  const orderedTargets: T[] = [];
  const queue: Array<{ warriorId: number; tile: string }> = [
    {
      warriorId: primaryTarget.id,
      tile: primaryTarget.battleTileCurrent,
    },
  ];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visitedIds.has(current.warriorId)) {
      continue;
    }

    visitedIds.add(current.warriorId);

    const currentWarrior = allWarriors.find(
      (warrior) => warrior.id === current.warriorId
    );

    if (
      currentWarrior &&
      isWarriorAliveOnBattleMap(currentWarrior) &&
      currentWarrior.battleTileCurrent &&
      isValidAbilityTarget("enemy", casterArmyId, currentWarrior.armyId)
    ) {
      orderedTargets.push(currentWarrior as T);
    }

    for (const warrior of allWarriors) {
      if (
        visitedIds.has(warrior.id) ||
        !isWarriorAliveOnBattleMap(warrior) ||
        !warrior.battleTileCurrent ||
        !isValidAbilityTarget("enemy", casterArmyId, warrior.armyId)
      ) {
        continue;
      }

      if (
        isWithinRange(
          current.tile,
          warrior.battleTileCurrent,
          spreadRange,
          battleMapWidth
        )
      ) {
        queue.push({
          warriorId: warrior.id,
          tile: warrior.battleTileCurrent,
        });
      }
    }
  }

  return orderedTargets;
}

/** Chain targets after the primary hit (same BFS order, primary omitted). */
export function getEnemyChainSpreadTargetsAfterPrimary<
  T extends AbilityTargetWarrior,
>(
  allWarriors: readonly T[],
  primaryTargetWarriorId: number,
  casterArmyId: number,
  battleMapWidth: number,
  spreadRange: number = ENEMY_CHAIN_SPREAD_RANGE
): T[] {
  return getEnemyChainSpreadTargets(
    allWarriors,
    primaryTargetWarriorId,
    casterArmyId,
    battleMapWidth,
    spreadRange
  ).filter((warrior) => warrior.id !== primaryTargetWarriorId);
}
