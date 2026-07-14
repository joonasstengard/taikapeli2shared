import type { AbilityTargetingType } from "../battle/abilityTargeting";
import {
  getSkillDamageScalingStat,
  type SkillScalingValues,
} from "../spells/spellPower";
import type { SkillDefinition, SkillDamageScalingStat } from "../skills/skillTypes";
import type { SpellDefinition } from "../spells/spellTypes";

export type AbilityDisplayKind = "skill" | "spell";

export type AbilityDefinitionForDisplay = Pick<
  SkillDefinition,
  | "description"
  | "baseDamageTarget"
  | "baseHealTarget"
  | "scalingFactor"
  | "damageScalingStat"
  | "type"
  | "range"
  | "targetingType"
> & {
  staminaCost?: number;
  manaCost?: number;
  baseStaminaRestore?: number;
  baseManaRestore?: number;
};

export interface AbilityCombatDisplayValues {
  damage: number | null;
  heal: number | null;
  staminaRestore: number | null;
  manaRestore: number | null;
}

export interface GetAbilityDisplayRowsOptions {
  kind: AbilityDisplayKind;
  isLocked?: boolean;
  requiredLevel?: number;
  includeDescription?: boolean;
  includeUnlock?: boolean;
  includeCost?: boolean;
  combatValues?: Partial<AbilityCombatDisplayValues>;
  notes?: string[];
}

export type AbilityScalingStatKey = SkillDamageScalingStat | "spellDamage";

export type AbilityDisplayRow =
  | { kind: "unlock"; requiredLevel: number }
  | { kind: "description"; text: string }
  | { kind: "cost"; resource: "mana" | "stamina"; amount: number }
  | { kind: "stat"; label: string; value: string }
  | { kind: "scaling"; factor: number; statKeys: AbilityScalingStatKey[] }
  | { kind: "note"; text: string };

const TARGETING_LABELS: Record<AbilityTargetingType, string> = {
  self: "Self",
  ally: "Ally",
  enemy: "Enemy",
  enemyAoE: "Enemy (area splash)",
  enemyChain: "Enemy (chain)",
  allAllies: "All allies in range",
  allEnemies: "All enemies in range",
};

const SCALING_STAT_LABELS = {
  strength: "Strength",
  speed: "Speed",
  faith: "Faith",
  spellDamage: "Spell Damage",
} as const;

export function formatAbilityTargetingType(
  targetingType: AbilityTargetingType
): string {
  return TARGETING_LABELS[targetingType];
}

export function shouldShowAbilityType(type: string | null | undefined): boolean {
  return type !== null && type !== undefined && type !== "null" && type !== "";
}

export function formatAbilityType(type: string | null | undefined): string | null {
  if (!shouldShowAbilityType(type)) {
    return null;
  }

  return type!;
}

export function formatScalingStatLabel(
  stat: keyof typeof SCALING_STAT_LABELS
): string {
  return SCALING_STAT_LABELS[stat];
}

export function formatSkillScalingLabel(
  skill: Pick<SkillScalingValues, "scalingFactor" | "damageScalingStat">
): string | null {
  if (skill.scalingFactor <= 0) {
    return null;
  }

  const scalingStat = getSkillDamageScalingStat(skill);
  return `${skill.scalingFactor} (${formatScalingStatLabel(scalingStat)})`;
}

export function formatSpellScalingLabel(
  spell: Pick<SpellDefinition, "scalingFactor" | "type">
): string | null {
  if (spell.scalingFactor <= 0) {
    return null;
  }

  const statLabels = getSpellScalingStatKeys(spell).map((statKey) =>
    formatScalingStatLabel(statKey)
  );

  return `${spell.scalingFactor} (${statLabels.join(", ")})`;
}

export function getSkillScalingStatKeys(
  skill: Pick<SkillScalingValues, "damageScalingStat">
): AbilityScalingStatKey[] {
  return [getSkillDamageScalingStat(skill)];
}

export function getSpellScalingStatKeys(
  spell: Pick<SpellDefinition, "type">
): AbilityScalingStatKey[] {
  if (spell.type === "Holy") {
    return ["spellDamage", "faith"];
  }

  return ["spellDamage"];
}

function resolveCombatValue(
  override: number | null | undefined,
  base: number
): number | null {
  if (override !== undefined) {
    return override;
  }

  return base > 0 ? base : null;
}

export function getAbilityDisplayRows(
  ability: AbilityDefinitionForDisplay,
  options: GetAbilityDisplayRowsOptions
): AbilityDisplayRow[] {
  const {
    kind,
    isLocked = false,
    requiredLevel,
    includeDescription = false,
    includeUnlock = false,
    includeCost = false,
    combatValues,
    notes = [],
  } = options;

  const rows: AbilityDisplayRow[] = [];

  if (includeUnlock && isLocked && requiredLevel !== undefined) {
    rows.push({ kind: "unlock", requiredLevel });
  }

  if (includeDescription) {
    rows.push({ kind: "description", text: ability.description });
  }

  if (includeCost) {
    rows.push({
      kind: "cost",
      resource: kind === "skill" ? "stamina" : "mana",
      amount: kind === "skill" ? (ability.staminaCost ?? 0) : (ability.manaCost ?? 0),
    });
  }

  const damage = resolveCombatValue(
    combatValues?.damage,
    ability.baseDamageTarget
  );
  if (damage !== null) {
    rows.push({ kind: "stat", label: "Damage", value: String(damage) });
  }

  const heal = resolveCombatValue(combatValues?.heal, ability.baseHealTarget);
  if (heal !== null) {
    rows.push({ kind: "stat", label: "Healing", value: String(heal) });
  }

  const staminaRestore = resolveCombatValue(
    combatValues?.staminaRestore,
    ability.baseStaminaRestore ?? 0
  );
  if (kind === "skill" && staminaRestore !== null) {
    rows.push({
      kind: "stat",
      label: "Stamina restore",
      value: String(staminaRestore),
    });
  }

  const manaRestore = resolveCombatValue(
    combatValues?.manaRestore,
    ability.baseManaRestore ?? 0
  );
  if (kind === "spell" && manaRestore !== null) {
    rows.push({
      kind: "stat",
      label: "Mana restore",
      value: String(manaRestore),
    });
  }

  for (const note of notes) {
    rows.push({ kind: "note", text: note });
  }

  if (ability.scalingFactor > 0) {
    rows.push({
      kind: "scaling",
      factor: ability.scalingFactor,
      statKeys:
        kind === "skill"
          ? getSkillScalingStatKeys(ability)
          : getSpellScalingStatKeys(ability),
    });
  }

  const typeLabel = formatAbilityType(ability.type);
  if (typeLabel !== null) {
    rows.push({ kind: "stat", label: "Type", value: typeLabel });
  }

  rows.push({
    kind: "stat",
    label: "Targeting",
    value: formatAbilityTargetingType(ability.targetingType),
  });

  if (ability.range > 0) {
    rows.push({ kind: "stat", label: "Range", value: String(ability.range) });
  }

  return rows;
}
