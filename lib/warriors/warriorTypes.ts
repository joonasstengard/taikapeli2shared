import type { OwnedSkill } from "../skills/skillTypes";
import type { OwnedSpell } from "../spells/spellTypes";
import type { WarriorStatBuff } from "@taikapeli2/shared/lib/statBuffs/statBuffTypes";
import type { WarriorStatusEffect } from "../statusEffects/warriorStatusEffect";

/** Warrior columns shared between DB rows and API responses. */
export interface WarriorBase {
  id: number;
  armyId: number | null;
  name: string;
  warriorClass: string;
  health: number;
  mana: number;
  stamina: number;
  picture: number;
  gender: string;
  strength: number;
  speed: number;
  faith: number;
  spellDamage: number;
  battleTileCurrent: string | null;
  hasActedThisRound: boolean;
  hasUsedMoveThisTurn: boolean;
  attackRange: number;
  currentStamina: number;
  currentHealth: number;
  currentMana: number;
  experience: number;
  level: number;
  takedowns: number;
  isDeleted: boolean;
}

/** Warrior as returned by game APIs (army, battle, market). */
export interface Warrior extends WarriorBase {
  spells: OwnedSpell[];
  skills: OwnedSkill[];
  statusEffects?: WarriorStatusEffect[];
  statBuffs?: WarriorStatBuff[];
  /** Recruitment cost; only present for market free agents */
  price?: number;
}
