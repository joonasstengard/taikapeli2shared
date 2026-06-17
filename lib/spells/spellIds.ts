export const SPELL_ID = {
  fireball: 1,
  healingPrayer: 2,
  frostball: 3,
  thunderball: 4,
  desperateRune: 5,
  holySmite: 6,
  shadowBlink: 7,
  teleport: 8,
  freezingWhisper: 9,
  protect: 10,
  rottingTouch: 11,
  bloodCurse: 12,
  thunder: 13,
  icebolt: 14,
  hellflame: 15,
  lifeDrain: 16,
  lifeDevour: 17,
  massHealing: 18,
  beaconOfLight: 19
} as const;

/** One of these is granted randomly when a Sorcerer is created. */
export const SORCERER_STARTING_SPELL_IDS = [
  SPELL_ID.fireball,
  SPELL_ID.frostball,
  SPELL_ID.thunderball,
] as const;

/** One of these is granted randomly when a Priestess is created. */
export const PRIESTESS_STARTING_SPELL_IDS = [
  SPELL_ID.healingPrayer,
  SPELL_ID.holySmite,
] as const;

/** One of these is granted randomly when a Paladin is created. */
export const PALADIN_STARTING_SPELL_IDS = [
  SPELL_ID.beaconOfLight,
  SPELL_ID.holySmite
] as const;

/** One of these is granted randomly when a Necromancer is created. */
export const NECROMANCER_STARTING_SPELL_IDS = [
  SPELL_ID.bloodCurse,
  SPELL_ID.rottingTouch,
  SPELL_ID.lifeDrain
] as const;

/** One of these is granted randomly when a Moonblade is created. */
export const MOONBLADE_STARTING_SPELL_IDS = [
  SPELL_ID.shadowBlink
] as const;
