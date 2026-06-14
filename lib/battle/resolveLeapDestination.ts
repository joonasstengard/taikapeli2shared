import {
  isBlockedBattleTile,
  isTileWithinBattleMap,
  type BattleMapConfig,
} from "./battleMaps";

const COLUMN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getColumnIndex(tileId: string): number {
  return COLUMN_LETTERS.indexOf(tileId[0]?.toUpperCase());
}

function getRow(tileId: string): number {
  return parseInt(tileId.slice(1), 10);
}

export function calculateBattleTileDistance(
  fromTile: string,
  toTile: string
): number {
  const fromCol = getColumnIndex(fromTile);
  const fromRow = getRow(fromTile);
  const toCol = getColumnIndex(toTile);
  const toRow = getRow(toTile);

  return Math.max(Math.abs(toCol - fromCol), Math.abs(toRow - fromRow));
}

function getTileId(columnIndex: number, row: number): string {
  return `${COLUMN_LETTERS[columnIndex]}${row}`;
}

function getPreferredLeapLandingTile(
  casterTile: string,
  targetTile: string
): string {
  const casterCol = getColumnIndex(casterTile);
  const casterRow = getRow(casterTile);
  const targetCol = getColumnIndex(targetTile);
  const targetRow = getRow(targetTile);

  const colStep =
    casterCol === targetCol ? 0 : casterCol > targetCol ? 1 : -1;
  const rowStep =
    casterRow === targetRow ? 0 : casterRow > targetRow ? 1 : -1;

  return getTileId(targetCol + colStep, targetRow + rowStep);
}

export interface ResolveLeapDestinationParams {
  casterTile: string;
  targetTile: string;
  occupiedTiles: string[];
  battleMap: BattleMapConfig;
}

export function resolveLeapDestination({
  casterTile,
  targetTile,
  occupiedTiles,
  battleMap,
}: ResolveLeapDestinationParams): string | null {
  const casterDistanceToTarget = calculateBattleTileDistance(
    casterTile,
    targetTile
  );

  if (casterDistanceToTarget <= 1) {
    return null;
  }

  const preferredLandingTile = getPreferredLeapLandingTile(
    casterTile,
    targetTile
  );

  if (!isTileWithinBattleMap(preferredLandingTile, battleMap)) {
    return null;
  }

  if (isBlockedBattleTile(preferredLandingTile, battleMap)) {
    return null;
  }

  const occupiedTileSet = new Set(
    occupiedTiles
      .filter((tile) => tile.toLowerCase() !== casterTile.toLowerCase())
      .map((tile) => tile.toLowerCase())
  );

  if (occupiedTileSet.has(preferredLandingTile.toLowerCase())) {
    return null;
  }

  return preferredLandingTile;
}
