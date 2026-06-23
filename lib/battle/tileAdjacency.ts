const COLUMN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Tiles immediately left and right of the target on the same row. */
export function getHorizontalAdjacentTileIds(
  targetTile: string,
  mapWidth: number
): string[] {
  const columnIndex = COLUMN_LETTERS.indexOf(
    targetTile[0]?.toUpperCase() ?? ""
  );
  const row = parseInt(targetTile.slice(1), 10);

  if (columnIndex < 0 || columnIndex >= mapWidth || Number.isNaN(row)) {
    return [];
  }

  const adjacentTiles: string[] = [];

  if (columnIndex > 0) {
    adjacentTiles.push(`${COLUMN_LETTERS[columnIndex - 1]}${row}`);
  }

  if (columnIndex < mapWidth - 1) {
    adjacentTiles.push(`${COLUMN_LETTERS[columnIndex + 1]}${row}`);
  }

  return adjacentTiles;
}
