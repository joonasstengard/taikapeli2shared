export const NATION_NAMES = [
  "Korpivaara",
  "Tuomela",
  "Hiidenlahti",
  "Vainola",
  "Viranta",
  "Tapiola",
  "Pohjamaa",
  "Aarnimetsä",
  "Hopeavesi",
  "Kalmalampi",
] as const;

export type NationName = (typeof NATION_NAMES)[number];

/** Alias used by the frontend. */
export const nationNames = NATION_NAMES;

export function isNationName(value: string): value is NationName {
  return (NATION_NAMES as readonly string[]).includes(value);
}
