// Max picture variant per class+gender combo for new warriors.
// Spritesheets are named class+gender+picture, e.g. KnightMale1.png.

export const WARRIOR_CLASSES = [
  "Horseman",
  "Knight",
  "Marksman",
  "Monk",
  "Necromancer",
  "Paladin",
  "Raider",
  "Ranger",
  "Sorcerer",
] as const;
export type WarriorClass = (typeof WARRIOR_CLASSES)[number];

export const WARRIOR_GENDERS = ["Male", "Female"] as const;
export type WarriorGender = (typeof WARRIOR_GENDERS)[number];

export type WarriorClassGenderKey = `${WarriorClass}${WarriorGender}`;

/** Default number of picture variants when a combo has no override below. */
export const DEFAULT_WARRIOR_PICTURE_COUNT = 0;

/**
 * Max picture index (1..N) for specific class+gender combos.
 * Only list combos that differ from DEFAULT_WARRIOR_PICTURE_COUNT.
 * Use 0 when no sprites exist for that combo; warriors must not be generated for it.
 */
export const WARRIOR_PICTURE_COUNT_OVERRIDES: Partial<
  Record<WarriorClassGenderKey, number>
> = {
  HorsemanMale: 9,
  HorsemanFemale: 0,
  KnightFemale: 0,
  KnightMale: 4,
  MarksmanFemale: 0,
  MarksmanMale: 9,
  MonkFemale: 6,
  MonkMale: 0,
  NecromancerFemale: 0,
  NecromancerMale: 6,
  PaladinMale: 9,
  PaladinFemale: 0,
  RaiderMale: 5,
  RaiderFemale: 0,
  RangerMale: 5,
  RangerFemale: 0,
  SorcererFemale: 0,
  SorcererMale: 10
};

export function getWarriorPictureCount(
  warriorClass: WarriorClass,
  gender: WarriorGender
): number {
  const key = `${warriorClass}${gender}` as WarriorClassGenderKey;
  return WARRIOR_PICTURE_COUNT_OVERRIDES[key] ?? DEFAULT_WARRIOR_PICTURE_COUNT;
}

export function hasWarriorPictures(
  warriorClass: WarriorClass,
  gender: WarriorGender
): boolean {
  return getWarriorPictureCount(warriorClass, gender) > 0;
}

export function getAvailableWarriorGenders(
  warriorClass: WarriorClass
): WarriorGender[] {
  return WARRIOR_GENDERS.filter((gender) =>
    hasWarriorPictures(warriorClass, gender)
  );
}
