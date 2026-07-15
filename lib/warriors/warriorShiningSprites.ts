import type {
  WarriorClass,
  WarriorGender,
} from "./warriorPictureVariants";
import type { WarriorRace } from "./warriorRaces";

/** Chance that a generated warrior uses a configured shining spritesheet. */
// 0.001 = 1 in 1000
export const SHINING_WARRIOR_ROLL_CHANCE = 0.001;

/**
 * A rare alternate spritesheet for a warrior class.
 * The picture number maps directly to a file such as KnightMale999.png.
 */
export interface WarriorShiningSprite {
  warriorClass: WarriorClass;
  race: WarriorRace;
  gender: WarriorGender;
  picture: number;
}

/**
 * Add new shining spritesheets here as they become available.
 * A class can have multiple entries; one is selected at random on a shining roll.
 */
export const WARRIOR_SHINING_SPRITES: readonly WarriorShiningSprite[] = [
  {
    warriorClass: "Knight",
    race: "Human",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Charger",
    race: "Human",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Berserker",
    race: "Human",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Brutalizer",
    race: "Orc",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "King",
    race: "Human",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Marksman",
    race: "Dwarf",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Moonblade",
    race: "Elf",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Paladin",
    race: "Human",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Peasant",
    race: "Human",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Ranger",
    race: "Orc",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Shaman",
    race: "Orc",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Sorcerer",
    race: "Human",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Infiltrator",
    race: "Human",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Warlock",
    race: "Human",
    gender: "Male",
    picture: 999,
  },
  {
    warriorClass: "Priestess",
    race: "Human",
    gender: "Female",
    picture: 999,
  },
];

export function getShiningWarriorSpritesForClass(
  warriorClass: WarriorClass
): readonly WarriorShiningSprite[] {
  return WARRIOR_SHINING_SPRITES.filter(
    (sprite) => sprite.warriorClass === warriorClass
  );
}

export function getWarriorShiningSprite(
  warriorClass: WarriorClass,
  gender: WarriorGender,
  picture: number
): WarriorShiningSprite | undefined {
  return WARRIOR_SHINING_SPRITES.find(
    (sprite) =>
      sprite.warriorClass === warriorClass &&
      sprite.gender === gender &&
      sprite.picture === picture
  );
}

export function isShiningWarriorSprite(
  warriorClass: WarriorClass,
  gender: WarriorGender,
  picture: number
): boolean {
  return getWarriorShiningSprite(warriorClass, gender, picture) !== undefined;
}
