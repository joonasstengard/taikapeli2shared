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
    1: {
      spellIds: [
        // SPELL_ID.flamewheel,
        // SPELL_ID.frostball,
        // SPELL_ID.thunderball,
        SPELL_ID.lightningArc,
      ],
    },
    2: {
      spellIds: [
        SPELL_ID.desperateRune,
        SPELL_ID.freezingWhisper,
      ],
    },
    3: {
      spellIds: [
        SPELL_ID.arcaneFocus,
        SPELL_ID.lightningArc,
      ]
    },
    4: {
      spellIds: [
        SPELL_ID.icebolt,
        SPELL_ID.hellflame,
        SPELL_ID.thunder,
      ]
    },
  },
  Priestess: {
    1: {
      spellIds: [SPELL_ID.healingPrayer],
    },
    2: {
      spellIds: [
        SPELL_ID.manaPrayer,
        SPELL_ID.sacredAegis,
        SPELL_ID.holySmite,
      ],
    },
    3: {
      spellIds: [
        SPELL_ID.penance,
        SPELL_ID.sacredInvocation,
        SPELL_ID.manaBenediction,
      ],
    },
    4: {
      spellIds: [
        SPELL_ID.massHealing,
        SPELL_ID.massAegis
      ],
    },
  },
  Paladin: {
    1: {
      spellIds: [SPELL_ID.beaconOfLight, SPELL_ID.holySmite],
      skipChancePercent: 2,
    },
    2: {
      spellIds: [SPELL_ID.sacredAegis, SPELL_ID.consecrate],
    },
    4: {
      spellIds: [SPELL_ID.penance, SPELL_ID.consecrate],
      skipChancePercent: 10,
    },
  },
  Warlock: {
    1: {
      spellIds: [SPELL_ID.bloodCurse, SPELL_ID.rottingTouch, SPELL_ID.lifeDrain],
    },
    2: {
      spellIds: [SPELL_ID.bloodCurse, SPELL_ID.rottingTouch, SPELL_ID.lifeDrain],
    },
    4: {
      spellIds: [SPELL_ID.lifeDevour, SPELL_ID.deathRitual],
    },
  },
  Moonblade: {
    1: {
      spellIds: [SPELL_ID.moonBlast],
      skipChancePercent: 67,
    },
    2: {
      spellIds: [SPELL_ID.shadowBlink],
      skipChancePercent: 99,
    },
    3: {
      spellIds: [SPELL_ID.teleport],
      skipChancePercent: 99,
    },
  },
  Shaman: {
    1: {
      spellIds: [SPELL_ID.spiritClaw],
    },
    3: {
      spellIds: [SPELL_ID.spiritRend],
      skipChancePercent: 5,
    },
  },
};
