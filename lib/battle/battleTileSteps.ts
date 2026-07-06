const COLUMN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function getColumnIndex(tileId: string): number {
  return COLUMN_LETTERS.indexOf(tileId[0]?.toUpperCase());
}

export function getRow(tileId: string): number {
  return parseInt(tileId.slice(1), 10);
}

export function getTileId(columnIndex: number, row: number): string {
  return `${COLUMN_LETTERS[columnIndex]}${row}`;
}

/** Unit step from caster toward target (used by retreat and knockback). */
export function getStepFromCasterToTarget(
  casterTile: string,
  targetTile: string
): { colStep: number; rowStep: number } {
  const casterCol = getColumnIndex(casterTile);
  const casterRow = getRow(casterTile);
  const targetCol = getColumnIndex(targetTile);
  const targetRow = getRow(targetTile);

  return {
    colStep:
      casterCol === targetCol ? 0 : casterCol > targetCol ? -1 : 1,
    rowStep:
      casterRow === targetRow ? 0 : casterRow > targetRow ? -1 : 1,
  };
}
