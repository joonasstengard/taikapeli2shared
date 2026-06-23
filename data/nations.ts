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
