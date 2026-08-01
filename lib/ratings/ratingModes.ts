/** Competitive ladder / Elo modes (extend as new ladders ship). */
export type RatingMode = "quick_battle";

export const RATING_MODES = ["quick_battle"] as const satisfies readonly RatingMode[];

export function isRatingMode(value: string): value is RatingMode {
  return (RATING_MODES as readonly string[]).includes(value);
}

/** Maps multiplayer match mode → rating ladder mode. */
export function ratingModeForMultiplayerMode(
  mode: "quick"
): RatingMode {
  switch (mode) {
    case "quick":
      return "quick_battle";
  }
}
