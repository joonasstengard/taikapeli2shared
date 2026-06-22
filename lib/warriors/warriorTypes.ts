import type { DbBoolean } from "../db/DbBoolean";
import type { OwnedSkill } from "../skills/skillTypes";
import type { OwnedSpell } from "../spells/spellTypes";
import type { WarriorStatusEffect } from "../statusEffects/warriorStatusEffect";

/** Warrior columns shared between DB rows and API responses. */
export interface WarriorBase {
  id: number;
  armyId: number | null;
  name: string;
  class: string;
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
  hasActedThisRound: DbBoolean;
  hasUsedMoveThisTurn: DbBoolean;
  attackRange: number;
  currentStamina: number;
  currentHealth: number;
  currentMana: number;
  experience: number;
  level: number;
  takedowns: number;
  isDeleted: DbBoolean;
}

/** Warrior as returned by game APIs (army, battle, market). */
export interface Warrior extends WarriorBase {
  spells: OwnedSpell[];
  skills: OwnedSkill[];
  statusEffects?: WarriorStatusEffect[];
  /** Recruitment cost; only present for market free agents */
  price?: number;
}
