import {
  isBlockedBattleTile,
  isTileWithinBattleMap,
  type BattleMapConfig,
} from "./battleMaps";
import { calculateBattleTileDistance } from "./resolveLeapDestination";
import { getTileId } from "./battleTileSteps";

/**
 * Empty-tile ability targeting: same occupancy rules as movement.
 * Destination must be in range, on the map, unblocked, unoccupied, and not the caster tile.
 */
export function isValidEmptyAbilityTile(params: {
  casterTile: string;
  targetTile: string;
  range: number;
  battleMap: BattleMapConfig;
  occupiedTiles: readonly string[];
}): boolean {
  const { casterTile, targetTile, range, battleMap, occupiedTiles } = params;

  if (casterTile.toLowerCase() === targetTile.toLowerCase()) {
    return false;
  }

  if (!isTileWithinBattleMap(targetTile, battleMap)) {
    return false;
  }

  if (isBlockedBattleTile(targetTile, battleMap)) {
    return false;
  }

  if (calculateBattleTileDistance(casterTile, targetTile) > range) {
    return false;
  }

  const occupiedTileSet = new Set(
    occupiedTiles.map((tile) => tile.toLowerCase())
  );

  if (occupiedTileSet.has(targetTile.toLowerCase())) {
    return false;
  }

  return true;
}

/** All empty tiles within ability range of the caster (movement-style). */
export function getEmptyAbilityTilesInRange(params: {
  casterTile: string;
  range: number;
  battleMap: BattleMapConfig;
  occupiedTiles: readonly string[];
}): string[] {
  const { casterTile, range, battleMap, occupiedTiles } = params;
  const tiles: string[] = [];

  for (let col = 0; col < battleMap.width; col++) {
    for (let row = 1; row <= battleMap.height; row++) {
      const tileId = getTileId(col, row);
      if (
        isValidEmptyAbilityTile({
          casterTile,
          targetTile: tileId,
          range,
          battleMap,
          occupiedTiles,
        })
      ) {
        tiles.push(tileId);
      }
    }
  }

  return tiles;
}
