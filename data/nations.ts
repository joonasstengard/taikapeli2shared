export const NATION_NAMES = [
  "Thornwall",
  "Ashenwood",
  "Bleakwater",
  "Cindervale",
  "Umbraven",
  "Grimhold",
  "Valdris",
  "Duskreach",
  "Aurenth",
  "Ironmoor",
] as const;

export type NationName = (typeof NATION_NAMES)[number];

/** Alias used by the frontend. */
export const nationNames = NATION_NAMES;

export function isNationName(value: string): value is NationName {
  return (NATION_NAMES as readonly string[]).includes(value);
}

/** Fisher–Yates sample of unique flavor names for computer armies. */
export function pickUniqueNationNames(
  count: number,
  random: () => number = Math.random
): NationName[] {
  if (count < 0 || count > NATION_NAMES.length) {
    throw new Error(
      `Cannot pick ${count} unique nation names from ${NATION_NAMES.length}.`
    );
  }

  const shuffled = [...NATION_NAMES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
