/** Starting Elo for every mode. */
export const DEFAULT_ELO_RATING = 1000;

/** Classic Elo K-factor (v1: flat for all games). */
export const ELO_K_FACTOR = 32;

/** Scale factor in the logistic expected-score curve. */
export const ELO_RATING_SCALE = 400;

/** Default number of rows on a ladder page. */
export const LADDER_PAGE_SIZE = 50;

/**
 * Expected score for `rating` against `opponentRating`
 * (probability of winning under classic Elo).
 */
export function expectedScore(
  rating: number,
  opponentRating: number
): number {
  return (
    1 /
    (1 + Math.pow(10, (opponentRating - rating) / ELO_RATING_SCALE))
  );
}

/**
 * Integer rating change for a decisive result (`1` win / `0` loss).
 * Rounded to nearest integer (half away from zero via Math.round).
 */
export function ratingDelta(
  rating: number,
  opponentRating: number,
  score: 0 | 1,
  kFactor: number = ELO_K_FACTOR
): number {
  return Math.round(kFactor * (score - expectedScore(rating, opponentRating)));
}

export function applyRatingDelta(rating: number, delta: number): number {
  return rating + delta;
}
