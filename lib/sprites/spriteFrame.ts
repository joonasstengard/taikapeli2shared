/** 1-based column and row indices into a spritesheet grid. */
export function getSpriteBackgroundPosition(
  column: number,
  row: number,
  columns: number,
  rows: number,
  scale = 1
): string {
  const normalizedScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  const xDenominator = columns * normalizedScale - 1;
  const yDenominator = rows * normalizedScale - 1;
  const x =
    xDenominator <= 0
      ? 0
      : ((normalizedScale * (column - 0.5) - 0.5) / xDenominator) * 100;
  const y =
    yDenominator <= 0
      ? 0
      : ((normalizedScale * (row - 0.5) - 0.5) / yDenominator) * 100;

  return `${x}% ${y}%`;
}
