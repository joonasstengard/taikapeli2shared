import type { WarriorClass } from "../warriors/warriorPictureVariants";

export function addRecruitedWarriorClass(
  recruitedClasses: readonly WarriorClass[],
  warriorClass: WarriorClass
): WarriorClass[] {
  if (recruitedClasses.includes(warriorClass)) {
    return [...recruitedClasses];
  }

  return [...recruitedClasses, warriorClass];
}

export function countDistinctRecruitedWarriorClasses(
  recruitedClasses: readonly WarriorClass[]
): number {
  return new Set(recruitedClasses).size;
}

export function hasEnoughDistinctRecruitedWarriorClasses(
  recruitedClasses: readonly WarriorClass[],
  minimum: number
): boolean {
  return countDistinctRecruitedWarriorClasses(recruitedClasses) >= minimum;
}
