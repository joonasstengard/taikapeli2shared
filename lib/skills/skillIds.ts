export const SKILL_ID = {
  lastStand: 1,
  eviscerate: 2,
  decisiveStrike: 3,
  lunge: 4,
  frozenArrow: 5,
  criticalBolt: 6,
  longShot: 7,
  cavalryCharge: 8,
  stomp: 9,
  lifeSteal: 10,
  rallyTroops: 11,
  raiseMorale: 12,
  martyrdom: 13,
  cutthroat: 14,
  eclipseHarvest: 15,
  arrowVolley: 16,
  fadeArrow: 17,
  commandAttack: 18,
  spiritWalk: 19,
  primalSlam: 20,
  bogPotion: 21,
  transformWolf: 22,
  battleCry: 23,
  warDecree: 24,
  jab: 25,
  desperateSwing: 26,
  scrounge: 27,
  panicStrike: 28,
  overrun: 29,
  protect: 30,
  takeAim: 31,
  berserk: 32,
  crescentSlash: 33,
  moonlitVeil: 34,
  fullMoonHarvest: 35,
} as const;

/** One of these is granted randomly when a Charger is created. */
export const CHARGER_STARTING_SKILL_IDS = [
  SKILL_ID.cavalryCharge
] as const;

/** One of these is granted randomly when a King is created. */
export const KING_STARTING_SKILL_IDS = [
  SKILL_ID.commandAttack,
  SKILL_ID.battleCry
] as const;

/** One of these is granted randomly when a Knight is created. */
export const KNIGHT_STARTING_SKILL_IDS = [
  SKILL_ID.decisiveStrike,
  SKILL_ID.protect
] as const;

/** One of these is granted randomly when a Marksman is created. */
export const MARKSMAN_STARTING_SKILL_IDS = [
  SKILL_ID.criticalBolt,
  SKILL_ID.longShot
] as const;

/** One of these is granted randomly when a Moonblade is created. */
export const MOONBLADE_STARTING_SKILL_IDS = [
  SKILL_ID.lifeSteal
] as const;

/** One of these is granted randomly when a Berserker is created. */
export const BERSERKER_STARTING_SKILL_IDS = [
  SKILL_ID.eviscerate
] as const;

/** One of these is granted randomly when a Ranger is created. */
export const RANGER_STARTING_SKILL_IDS = [
  SKILL_ID.frozenArrow,
  SKILL_ID.arrowVolley,
  SKILL_ID.fadeArrow,
] as const;

/** One of these is granted randomly when a Shaman is created. */
export const SHAMAN_STARTING_SKILL_IDS = [
  SKILL_ID.spiritWalk,
  SKILL_ID.bogPotion,
  SKILL_ID.transformWolf,
] as const;

