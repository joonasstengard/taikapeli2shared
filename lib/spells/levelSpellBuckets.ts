import type { WarriorClass } from "../warriors/warriorPictureVariants";
import { SPELL_ID } from "./spellIds";

export interface LevelSpellBucketConfig {
  spellIds: readonly number[];
  /** If set, this percent chance (0–99) to skip granting a spell from this bucket. */
  skipChancePercent?: number;
}

export type LevelSpellBucketsByLevel = Partial<
  Record<number, LevelSpellBucketConfig>
>;

/**
 * Per-class spell pools granted at warrior creation, unlocked when the warrior
 * reaches the bucket's level. Omit a class or level to grant nothing there.
 */
export const LEVEL_SPELL_BUCKETS_BY_CLASS: Partial<
  Record<WarriorClass, LevelSpellBucketsByLevel>
> = {
  Sorcerer: {
    2: {
      spellIds: [
        SPELL_ID.desperateRune,
        SPELL_ID.freezingWhisper,
        SPELL_ID.teleport
      ],
      skipChancePercent: 10
    },
    4: {
      spellIds: [SPELL_ID.teleport, SPELL_ID.icebolt,
      SPELL_ID.hellflame,
      SPELL_ID.thunder,],
      skipChancePercent: 10
    },
  },
  Priestess: {
    2: {
      spellIds: [SPELL_ID.healingPrayer, SPELL_ID.holySmite],
      skipChancePercent: 10,
    },
    4: {
      spellIds: [SPELL_ID.protect, SPELL_ID.massHealing, SPELL_ID.penance],
      skipChancePercent: 10
    },
  },
  Paladin: {
    2: {
      spellIds: [SPELL_ID.protect, SPELL_ID.holySmite, SPELL_ID.consecrate]
    },
    4: {
      spellIds: [SPELL_ID.penance, SPELL_ID.consecrate],
      skipChancePercent: 50
    },
  },
  Necromancer: {
    2: {
      spellIds: [SPELL_ID.bloodCurse, SPELL_ID.rottingTouch, SPELL_ID.lifeDrain],
      skipChancePercent: 10
    },
    4: {
      spellIds: [SPELL_ID.lifeDevour, SPELL_ID.deathRitual],
      skipChancePercent: 10
    },
  },
  Moonblade: {
    3: {
      spellIds: [SPELL_ID.shadowBlink, SPELL_ID.teleport, SPELL_ID.moonBlast],
    },
  },
  Shaman: {
    2: {
      spellIds: [SPELL_ID.spiritClaw],
      skipChancePercent: 5
    },
    4: {
      spellIds: [SPELL_ID.spiritRend],
      skipChancePercent: 5
    },
  },
};
