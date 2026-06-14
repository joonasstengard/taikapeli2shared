export const SPELL_ID = {
  fireball: 1,
  healingPrayer: 2,
  frostball: 3,
  thunderball: 4,
  desperateRune: 5,
  holySmite: 6,
} as const;

/** One of these is granted randomly when a Sorcerer is created. */
export const SORCERER_STARTING_SPELL_IDS = [
  SPELL_ID.fireball,
  SPELL_ID.frostball,
  SPELL_ID.thunderball,
] as const;

/** One of these is granted randomly when a Monk is created. */
export const MONK_STARTING_SPELL_IDS = [
  SPELL_ID.healingPrayer,
  SPELL_ID.holySmite,
] as const;

/** One of these is granted randomly when a Paladin is created. */
export const PALADIN_STARTING_SPELL_IDS = [
  SPELL_ID.healingPrayer,
  SPELL_ID.holySmite,
] as const;
