import { calculateTileDistance } from "../battle/abilityTargeting";
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

export function pickRandomCommandAttackTarget<T>(
  enemies: readonly T[],
  random: () => number = Math.random
): T {
  if (enemies.length === 0) {
    throw new Error("Cannot pick a command attack target from an empty list.");
  }

  return enemies[Math.floor(random() * enemies.length)]!;
}
