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
        SPELL_ID.freezingWhisper
      ]
    },
    4: {
      spellIds: [SPELL_ID.desperateRune, SPELL_ID.icebolt,
      SPELL_ID.hellflame,
      SPELL_ID.thunder,]
    },
    5: {
      spellIds: [SPELL_ID.icebolt,
      SPELL_ID.hellflame,
      SPELL_ID.thunder,],
      skipChancePercent: 10
    },
  },
  Priestess: {
    2: {
      spellIds: [SPELL_ID.healingPrayer, SPELL_ID.holySmite]
    },
    4: {
      spellIds: [
        SPELL_ID.divineAegis,
        SPELL_ID.penance,
        SPELL_ID.sacredInvocation,
      ]
    },
    5: {
      spellIds: [SPELL_ID.massHealing,]
    },
  },
  Paladin: {
    2: {
      spellIds: [SPELL_ID.divineAegis, SPELL_ID.holySmite, SPELL_ID.consecrate]
    },
    4: {
      spellIds: [SPELL_ID.penance, SPELL_ID.consecrate],
      skipChancePercent: 10
    },
  },
  Warlock: {
    2: {
      spellIds: [SPELL_ID.bloodCurse, SPELL_ID.rottingTouch, SPELL_ID.lifeDrain]
    },
    4: {
      spellIds: [SPELL_ID.lifeDevour, SPELL_ID.deathRitual]
    },
  },
  Moonblade: {
    2: {
      spellIds: [SPELL_ID.shadowBlink],
      skipChancePercent: 99
    },
    3: {
      spellIds: [SPELL_ID.teleport],
      skipChancePercent: 99
    },
  },
  Shaman: {
    3: {
      spellIds: [SPELL_ID.spiritRend],
      skipChancePercent: 5
    },
  },
};
