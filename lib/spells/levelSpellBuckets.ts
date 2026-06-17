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
    3: {
      spellIds: [
        SPELL_ID.fireball,
        SPELL_ID.frostball,
        SPELL_ID.thunderball,
        SPELL_ID.desperateRune
      ],
      skipChancePercent: 10
    },
    5: {
      spellIds: [SPELL_ID.teleport, SPELL_ID.icebolt,
      SPELL_ID.hellflame,
      SPELL_ID.freezingWhisper,],
      skipChancePercent: 10
    },
  },
  Priestess: {
    3: {
      spellIds: [SPELL_ID.healingPrayer, SPELL_ID.holySmite],
      skipChancePercent: 20,
    },
    5: {
      spellIds: [SPELL_ID.protect, SPELL_ID.massHealing],
      skipChancePercent: 25
    },
  },
  Paladin: {
    4: {
      spellIds: [SPELL_ID.protect, SPELL_ID.holySmite, SPELL_ID.healingPrayer, SPELL_ID.beaconOfLight]
    }
  },
  Necromancer: {
    3: {
      spellIds: [SPELL_ID.bloodCurse, SPELL_ID.rottingTouch, SPELL_ID.lifeDrain],
      skipChancePercent: 10
    },
    5: {
      spellIds: [SPELL_ID.lifeDevour],
      skipChancePercent: 10
    },
  },
  Moonblade: {
    4: {
      spellIds: [SPELL_ID.shadowBlink, SPELL_ID.teleport],
      skipChancePercent: 66
    },
  },
};
