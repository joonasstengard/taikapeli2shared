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
} as const;

/** One of these is granted randomly when a Horseman is created. */
export const HORSEMAN_STARTING_SKILL_IDS = [
  SKILL_ID.cavalryCharge,
  SKILL_ID.stomp
] as const;

/** One of these is granted randomly when a King is created. */
export const KING_STARTING_SKILL_IDS = [
  SKILL_ID.decisiveStrike
] as const;

/** One of these is granted randomly when a Knight is created. */
export const KNIGHT_STARTING_SKILL_IDS = [
  SKILL_ID.lunge,
  SKILL_ID.lastStand
] as const;

/** One of these is granted randomly when a Marksman is created. */
export const MARKSMAN_STARTING_SKILL_IDS = [
  SKILL_ID.criticalBolt
] as const;

/** One of these is granted randomly when a Moonblade is created. */
export const MOONBLADE_STARTING_SKILL_IDS = [
] as const;

/** One of these is granted randomly when a Raider is created. */
export const RAIDER_STARTING_SKILL_IDS = [
  SKILL_ID.eviscerate
] as const;

/** One of these is granted randomly when a Ranger is created. */
export const RANGER_STARTING_SKILL_IDS = [
  SKILL_ID.frozenArrow,
  SKILL_ID.longShot
] as const;

