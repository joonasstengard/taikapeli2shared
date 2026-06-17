export function isAbilityUnlocked(
  warriorLevel: number,
  requiredLevel: number
): boolean {
  return warriorLevel >= requiredLevel;
}

export function filterUnlockedAbilities<T extends { requiredLevel: number }>(
  abilities: T[],
  warriorLevel: number
): T[] {
  return abilities.filter((ability) =>
    isAbilityUnlocked(warriorLevel, ability.requiredLevel)
  );
}
