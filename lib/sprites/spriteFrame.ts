/** 1-based column and row indices into a spritesheet grid. */
export function getSpriteBackgroundPosition(
  column: number,
  row: number,
  columns: number,
  rows: number,
  scale = 1
): string {
  const normalizedScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  const x =
    ((normalizedScale * (column - 0.5) - 0.5) /
      (columns * normalizedScale - 1)) *
    100;
  const y =
    ((normalizedScale * (row - 0.5) - 0.5) /
      (rows * normalizedScale - 1)) *
    100;

  return `${x}% ${y}%`;
}
