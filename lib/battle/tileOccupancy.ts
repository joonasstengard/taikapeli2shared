export interface BattleMapOccupant {
  currentHealth: number;
  battleTileCurrent?: string | null;
}

export interface ArmyBattleOccupant extends BattleMapOccupant {
  id: number;
  armyId: number;
}

export function isWarriorAliveOnBattleMap(
  warrior: Pick<BattleMapOccupant, "currentHealth" | "battleTileCurrent">
): boolean {
  return warrior.currentHealth > 0 && Boolean(warrior.battleTileCurrent);
}

export function getAliveOccupiedBattleTiles<T extends BattleMapOccupant>(
  warriors: readonly T[]
): string[] {
  return warriors
    .filter(isWarriorAliveOnBattleMap)
    .map((warrior) => warrior.battleTileCurrent as string);
}

export function hasAliveAlly<T extends ArmyBattleOccupant>(
  warrior: T,
  allWarriors: readonly T[]
): boolean {
  return allWarriors.some(
    (other) =>
      other.id !== warrior.id &&
      other.armyId === warrior.armyId &&
      isWarriorAliveOnBattleMap(other)
  );
}
