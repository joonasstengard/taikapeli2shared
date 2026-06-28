export const SPELL_ID = {
  flamewheel: 1,
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
  beaconOfLight: 19,
  deathRitual: 20,
  consecrate: 21,
  penance: 22,
  moonBlast: 23,
  spiritClaw: 24,
  spiritRend: 25,
} as const;

/** One of these is granted randomly when a Sorcerer is created. */
export const SORCERER_STARTING_SPELL_IDS = [
  SPELL_ID.flamewheel,
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

/** One of these is granted randomly when a Warlock is created. */
export const WARLOCK_STARTING_SPELL_IDS = [
  SPELL_ID.bloodCurse,
  SPELL_ID.rottingTouch,
  SPELL_ID.lifeDrain
] as const;

/** One of these is granted randomly when a Moonblade is created. */
export const MOONBLADE_STARTING_SPELL_IDS = [
  SPELL_ID.shadowBlink,
  SPELL_ID.moonBlast
] as const;

/** One of these is granted randomly when a Shaman is created. */
export const SHAMAN_STARTING_SPELL_IDS = [
  SPELL_ID.spiritClaw
] as const;