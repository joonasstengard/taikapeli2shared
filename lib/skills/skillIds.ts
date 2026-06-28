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
  moonHarvest: 15,
  arrowVolley: 16,
  fadeArrow: 17,
  commandAttack: 18,
  spiritWalk: 19,
  primalSlam: 20,
  bogPotion: 21,
  transformWolf: 22,
} as const;

/** One of these is granted randomly when a Charger is created. */
export const CHARGER_STARTING_SKILL_IDS = [
  SKILL_ID.cavalryCharge,
  SKILL_ID.stomp
] as const;

/** One of these is granted randomly when a King is created. */
export const KING_STARTING_SKILL_IDS = [
  SKILL_ID.rallyTroops,
  SKILL_ID.commandAttack
] as const;

/** One of these is granted randomly when a Knight is created. */
export const KNIGHT_STARTING_SKILL_IDS = [
  SKILL_ID.lastStand,
  SKILL_ID.decisiveStrike,
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

