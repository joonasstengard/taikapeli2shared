export function extractWarriorNames(
  warriors: readonly { name: string }[]
): string[] {
  return warriors.map((warrior) => warrior.name);
}

export function resolvePlayerWarriorNamesForAchievements(
  hasPlayerArmy: boolean,
  warriors: readonly { name: string }[]
): string[] | undefined {
  if (!hasPlayerArmy) {
    return undefined;
  }

  return extractWarriorNames(warriors);
}

export function hasWarriorNameContaining(
  warriorNames: readonly string[],
  substring: string
): boolean {
  return warriorNames.some((name) => name.includes(substring));
}
