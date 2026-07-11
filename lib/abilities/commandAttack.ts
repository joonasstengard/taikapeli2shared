import {
  calculateTileDistance,
  getAreaAbilityTargets,
} from "../battle/abilityTargeting";
import { isWarriorAliveOnBattleMap } from "../battle/tileOccupancy";
import type { AbilityEffect } from "./abilityEffects";

export function hasCommandAttackEffect(
  effect: AbilityEffect | null | undefined
): boolean {
  return effect?.effectType === "commandAttack";
}

export interface CommandAttackParticipant {
  id: number;
  armyId: number;
  currentHealth: number;
  battleTileCurrent: string | null;
  attackRange: number;
}

export function getCommandAttackableEnemies<T extends CommandAttackParticipant>(
  commander: CommandAttackParticipant,
  ally: CommandAttackParticipant,
  allWarriors: readonly T[],
  battleMapWidth: number,
  isAttackableEnemy: (enemy: T) => boolean
): T[] {
  if (!ally.battleTileCurrent) {
    return [];
  }

  return allWarriors.filter((enemy) => {
    if (enemy.armyId === commander.armyId) {
      return false;
    }

    if (!isWarriorAliveOnBattleMap(enemy) || !enemy.battleTileCurrent) {
      return false;
    }

    if (!isAttackableEnemy(enemy)) {
      return false;
    }

    return (
      calculateTileDistance(
        ally.battleTileCurrent!,
        enemy.battleTileCurrent,
        battleMapWidth
      ) <= ally.attackRange
    );
  });
}

export function canAllyReceiveCommandAttack<T extends CommandAttackParticipant>(
  commander: CommandAttackParticipant,
  ally: CommandAttackParticipant,
  allWarriors: readonly T[],
  battleMapWidth: number,
  isAttackableEnemy: (enemy: T) => boolean
): boolean {
  return (
    getCommandAttackableEnemies(
      commander,
      ally,
      allWarriors,
      battleMapWidth,
      isAttackableEnemy
    ).length > 0
  );
}

export function canAnyAllyReceiveCommandAttack<
  T extends CommandAttackParticipant,
>(
  commander: CommandAttackParticipant,
  allWarriors: readonly T[],
  range: number,
  battleMapWidth: number,
  isAttackableEnemy: (enemy: T) => boolean
): boolean {
  const alliesInRange = getAreaAbilityTargets(
    allWarriors,
    commander,
    range,
    "allAllies",
    battleMapWidth
  );

  return alliesInRange.some((ally) =>
    canAllyReceiveCommandAttack(
      commander,
      ally,
      allWarriors,
      battleMapWidth,
      isAttackableEnemy
    )
  );
}
