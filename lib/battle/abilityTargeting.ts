

export type AbilityTargetingType =
  | "self"
  | "ally"
  | "enemy"
  | "allAllies"
  | "allEnemies";

export function isSingleTargetTargeting(
  targetingType: AbilityTargetingType
): targetingType is "ally" | "enemy" {
  return targetingType === "ally" || targetingType === "enemy";
}

export function isValidAbilityTarget(
  targetingType: AbilityTargetingType,
  casterArmyId: number,
  targetArmyId: number
): boolean {
  if (targetingType === "ally") {
    return casterArmyId === targetArmyId;
  }

  if (targetingType === "enemy") {
    return casterArmyId !== targetArmyId;
  }

  return true;
}

export function isAreaTargeting(
  targetingType: AbilityTargetingType
): targetingType is "allAllies" | "allEnemies" {
  return targetingType === "allAllies" || targetingType === "allEnemies";
}

/** Abilities that fire immediately without selecting a map tile. */
export function isInstantCastTargeting(
  targetingType: AbilityTargetingType
): boolean {
  return targetingType === "self" || isAreaTargeting(targetingType);
}

/** Targeting types that can apply supportive effects to allies (including self). */
export function isAllySupportTargeting(
  targetingType: AbilityTargetingType
): boolean {
  return (
    targetingType === "self" ||
    targetingType === "ally" ||
    targetingType === "allAllies"
  );
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
 * Never includes the caster. Never includes dead warriors.
 */
export function getAreaAbilityTargets<T extends AbilityTargetWarrior>(
  allWarriors: readonly T[],
  caster: AbilityTargetWarrior,
  range: number,
  targetingType: "allAllies" | "allEnemies",
  battleMapWidth: number
): T[] {
  if (!caster.battleTileCurrent) {
    return [];
  }

  return allWarriors.filter((warrior) => {
    if (warrior.id === caster.id) {
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

    if (targetingType === "allAllies") {
      return warrior.armyId === caster.armyId;
    }

    return warrior.armyId !== caster.armyId;
  }) as T[];
}
