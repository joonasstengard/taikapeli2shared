import type { WarriorBase } from "./warriorTypes";
import {
  type WarriorClass,
  type WarriorClassGenderKey,
  type WarriorGender,
} from "./warriorPictureVariants";
import { getWarriorShiningSprite } from "./warriorShiningSprites";

export const WARRIOR_RACES = ["Human", "Dwarf", "Elf", "Orc"] as const;
export type WarriorRace = (typeof WARRIOR_RACES)[number];

export const DEFAULT_WARRIOR_RACE: WarriorRace = "Human";

/** UI label for each race (e.g. Elf → "Elven"). */
export const WARRIOR_RACE_DISPLAY_NAMES: Record<WarriorRace, string> = {
  Human: "Human",
  Dwarf: "Dwarf",
  Elf: "Elf",
  Orc: "Orc",
};

type PictureRaceRange = { race: WarriorRace; from: number; to: number };

/**
 * Inclusive picture-index ranges per class+gender combo.
 * Omit combos where every variant uses DEFAULT_WARRIOR_RACE.
 */
export const WARRIOR_PICTURE_RACE_RANGES: Partial<
  Record<WarriorClassGenderKey, PictureRaceRange[]>
> = {
  ChargerMale: [
    { race: "Human", from: 1, to: 9 },
    { race: "Orc", from: 10, to: 13 },
    { race: "Elf", from: 14, to: 23 },
  ],
  KingMale: [{ race: "Human", from: 1, to: 7 }, { race: "Dwarf", from: 8, to: 14 }],
  KnightMale: [
    { race: "Human", from: 1, to: 10 },
    { race: "Elf", from: 11, to: 23 },
  ],
  MarksmanMale: [{ race: "Human", from: 1, to: 9 }, { race: "Dwarf", from: 10, to: 15 }],
  MoonbladeMale: [{ race: "Elf", from: 1, to: 10 }],
  PeasantMale: [{ race: "Human", from: 1, to: 20 }, { race: "Dwarf", from: 21, to: 26 }],
  BerserkerMale: [{ race: "Human", from: 1, to: 4 }, { race: "Orc", from: 5, to: 12 }],
  BrutalizerMale: [{ race: "Orc", from: 1, to: 13 }],
  RangerMale: [{ race: "Elf", from: 1, to: 7 }, { race: "Orc", from: 8, to: 11 }],
  ShamanMale: [{ race: "Human", from: 1, to: 4 }, { race: "Orc", from: 5, to: 8 }],
  SorcererMale: [{ race: "Human", from: 1, to: 10 }, { race: "Elf", from: 11, to: 18 }],
};

export function getWarriorRaceDisplayName(race: WarriorRace): string {
  return WARRIOR_RACE_DISPLAY_NAMES[race];
}

export function getWarriorRace(
  warriorClass: WarriorClass,
  gender: WarriorGender,
  picture: number
): WarriorRace {
  const shiningSprite = getWarriorShiningSprite(warriorClass, gender, picture);
  if (shiningSprite) {
    return shiningSprite.race;
  }

  const key = `${warriorClass}${gender}` as WarriorClassGenderKey;
  const ranges = WARRIOR_PICTURE_RACE_RANGES[key];

  if (ranges) {
    for (const range of ranges) {
      if (picture >= range.from && picture <= range.to) {
        return range.race;
      }
    }
  }

  return DEFAULT_WARRIOR_RACE;
}

export function formatWarriorClassLabel(
  warriorClass: WarriorClass,
  gender: WarriorGender,
  picture: number
): string {
  const race = getWarriorRace(warriorClass, gender, picture);
  return `${getWarriorRaceDisplayName(race)} ${warriorClass}`;
}

export function formatWarriorClassLabelForWarrior(
  warrior: Pick<WarriorBase, "warriorClass" | "gender" | "picture">
): string {
  return formatWarriorClassLabel(
    warrior.warriorClass as WarriorClass,
    warrior.gender as WarriorGender,
    warrior.picture
  );
}

/** Validates that ranges cover exactly 1..pictureCount with no gaps or overlaps. */
export function validatePictureRaceRanges(
  ranges: PictureRaceRange[],
  pictureCount: number
): boolean {
  if (pictureCount <= 0) {
    return ranges.length === 0;
  }

  const covered = new Set<number>();
  for (const range of ranges) {
    if (range.from > range.to) {
      return false;
    }
    for (let picture = range.from; picture <= range.to; picture++) {
      if (covered.has(picture)) {
        return false;
      }
      covered.add(picture);
    }
  }

  for (let picture = 1; picture <= pictureCount; picture++) {
    if (!covered.has(picture)) {
      return false;
    }
  }

  return covered.size === pictureCount;
}

export function getExpectedPictureRaceRanges(
  warriorClass: WarriorClass,
  gender: WarriorGender,
  pictureCount: number
): PictureRaceRange[] {
  const key = `${warriorClass}${gender}` as WarriorClassGenderKey;
  const configured = WARRIOR_PICTURE_RACE_RANGES[key];

  if (configured) {
    return configured;
  }

  if (pictureCount <= 0) {
    return [];
  }

  return [{ race: DEFAULT_WARRIOR_RACE, from: 1, to: pictureCount }];
}
