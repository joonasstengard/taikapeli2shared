/** 1-based column and row indices into a spritesheet grid. */
export function getSpriteBackgroundPosition(
  column: number,
  row: number,
  columns: number,
  rows: number
): string {
  const x = column === 1 ? 0 : ((column - 1) / (columns - 1)) * 100;
  const y = row === 1 ? 0 : ((row - 1) / (rows - 1)) * 100;

  return `${x}% ${y}%`;
}
