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

function getTileId(columnIndex: number, row: number): string {
  return `${COLUMN_LETTERS[columnIndex]}${row}`;
}

function getPreferredRetreatDestinationTile(
  casterTile: string,
  targetTile: string
): string {
  const casterCol = getColumnIndex(casterTile);
  const casterRow = getRow(casterTile);
  const targetCol = getColumnIndex(targetTile);
  const targetRow = getRow(targetTile);

  const colStep =
    casterCol === targetCol ? 0 : casterCol > targetCol ? -1 : 1;
  const rowStep =
    casterRow === targetRow ? 0 : casterRow > targetRow ? -1 : 1;

  return getTileId(casterCol - colStep, casterRow - rowStep);
}

export interface ResolveRetreatDestinationParams {
  casterTile: string;
  targetTile: string;
  occupiedTiles: string[];
  battleMap: BattleMapConfig;
}

export function resolveRetreatDestination({
  casterTile,
  targetTile,
  occupiedTiles,
  battleMap,
}: ResolveRetreatDestinationParams): string | null {
  const preferredRetreatTile = getPreferredRetreatDestinationTile(
    casterTile,
    targetTile
  );

  if (!isTileWithinBattleMap(preferredRetreatTile, battleMap)) {
    return null;
  }

  if (isBlockedBattleTile(preferredRetreatTile, battleMap)) {
    return null;
  }

  const occupiedTileSet = new Set(
    occupiedTiles
      .filter((tile) => tile.toLowerCase() !== casterTile.toLowerCase())
      .map((tile) => tile.toLowerCase())
  );

  if (occupiedTileSet.has(preferredRetreatTile.toLowerCase())) {
    return null;
  }

  return preferredRetreatTile;
}
