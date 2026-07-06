import {
  isBlockedBattleTile,
  isTileWithinBattleMap,
  type BattleMapConfig,
} from "./battleMaps";
import {
  getColumnIndex,
  getRow,
  getStepFromCasterToTarget,
  getTileId,
} from "./battleTileSteps";

export interface ResolveKnockbackDestinationParams {
  casterTile: string;
  targetTile: string;
  occupiedTiles: string[];
  battleMap: BattleMapConfig;
}

function getPreferredKnockbackDestinationTile(
  casterTile: string,
  targetTile: string
): string {
  const targetCol = getColumnIndex(targetTile);
  const targetRow = getRow(targetTile);
  const { colStep, rowStep } = getStepFromCasterToTarget(casterTile, targetTile);

  return getTileId(targetCol + colStep, targetRow + rowStep);
}

export function resolveKnockbackDestination({
  casterTile,
  targetTile,
  occupiedTiles,
  battleMap,
}: ResolveKnockbackDestinationParams): string | null {
  const preferredKnockbackTile = getPreferredKnockbackDestinationTile(
    casterTile,
    targetTile
  );

  if (!isTileWithinBattleMap(preferredKnockbackTile, battleMap)) {
    return null;
  }

  if (isBlockedBattleTile(preferredKnockbackTile, battleMap)) {
    return null;
  }

  const occupiedTileSet = new Set(
    occupiedTiles
      .filter((tile) => tile.toLowerCase() !== targetTile.toLowerCase())
      .map((tile) => tile.toLowerCase())
  );

  if (occupiedTileSet.has(preferredKnockbackTile.toLowerCase())) {
    return null;
  }

  return preferredKnockbackTile;
}
