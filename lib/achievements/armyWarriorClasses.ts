import type { WarriorClass } from "../warriors/warriorPictureVariants";

export function extractWarriorClasses(
  warriors: readonly { warriorClass: string }[]
): WarriorClass[] {
  return warriors.map((warrior) => warrior.warriorClass as WarriorClass);
}

export function resolvePlayerWarriorClassesForAchievements(
  hasPlayerArmy: boolean,
  warriors: readonly { warriorClass: string }[]
): WarriorClass[] | undefined {
  if (!hasPlayerArmy) {
    return undefined;
  }

  return extractWarriorClasses(warriors);
}

export function hasWarriorClassInArmy(
  warriorClasses: readonly WarriorClass[],
  requiredClass: WarriorClass
): boolean {
  return warriorClasses.includes(requiredClass);
}
