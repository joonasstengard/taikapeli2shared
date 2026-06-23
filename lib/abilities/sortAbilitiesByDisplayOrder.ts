import type { OwnedSkill } from "../skills/skillTypes";
import type { OwnedSpell } from "../spells/spellTypes";

function compareRequiredLevel(
  a: { requiredLevel?: number },
  b: { requiredLevel?: number }
): number {
  return (a.requiredLevel ?? 1) - (b.requiredLevel ?? 1);
}

export function sortSpellsByDisplayOrder<T extends OwnedSpell>(
  spells: readonly T[]
): T[] {
  return [...spells].sort((a, b) => {
    const levelDiff = compareRequiredLevel(a, b);
    if (levelDiff !== 0) {
      return levelDiff;
    }

    return a.manaCost - b.manaCost;
  });
}

export function sortSkillsByDisplayOrder<T extends OwnedSkill>(
  skills: readonly T[]
): T[] {
  return [...skills].sort((a, b) => {
    const levelDiff = compareRequiredLevel(a, b);
    if (levelDiff !== 0) {
      return levelDiff;
    }

    return a.staminaCost - b.staminaCost;
  });
}
