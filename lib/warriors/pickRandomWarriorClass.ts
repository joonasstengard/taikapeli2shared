import {
  COMMON_WARRIOR_CLASSES,
  RARE_WARRIOR_CLASSES,
  RARE_WARRIOR_CLASS_ROLL_CHANCE,
  type WarriorClass,
} from "./warriorPictureVariants";

function pickRandomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Roll a warrior class for recruitment / free-agent generation. */
export function pickRandomWarriorClass(): WarriorClass {
  if (
    RARE_WARRIOR_CLASSES.length > 0 &&
    Math.random() < RARE_WARRIOR_CLASS_ROLL_CHANCE
  ) {
    return pickRandomItem(RARE_WARRIOR_CLASSES);
  }

  return pickRandomItem(COMMON_WARRIOR_CLASSES);
}
