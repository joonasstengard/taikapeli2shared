export interface BattleMapOccupant {
  currentHealth: number;
  battleTileCurrent?: string | null;
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
