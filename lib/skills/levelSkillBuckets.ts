import type { WarriorClass } from "../warriors/warriorPictureVariants";
import { SKILL_ID } from "./skillIds";

export interface LevelSkillBucketConfig {
  skillIds: readonly number[];
  /** If set, this percent chance (0–99) to skip granting a skill from this bucket. */
  skipChancePercent?: number;
}

export type LevelSkillBucketsByLevel = Partial<
  Record<number, LevelSkillBucketConfig>
>;

/**
 * Per-class skill pools granted at warrior creation, unlocked when the warrior
 * reaches the bucket's level. Omit a class or level to grant nothing there.
 */
export const LEVEL_SKILL_BUCKETS_BY_CLASS: Partial<
  Record<WarriorClass, LevelSkillBucketsByLevel>
> = {
  Horseman: {
    4: {
      skillIds: [SKILL_ID.stomp, SKILL_ID.cavalryCharge],
      skipChancePercent: 50,
    }
  },
  Knight: {
    3: {
      skillIds: [SKILL_ID.decisiveStrike],
      skipChancePercent: 50,
    },
    5: {
      skillIds: [SKILL_ID.lastStand, SKILL_ID.lunge],
      skipChancePercent: 50,
    },
  },
  King: {
    3: {
      skillIds: [SKILL_ID.lastStand],
      skipChancePercent: 75,
    }
  },
  Marksman: {
    3: {
      skillIds: [SKILL_ID.longShot, SKILL_ID.frozenArrow],
      skipChancePercent: 50,
    },
    5: {
      skillIds: [SKILL_ID.criticalBolt],
      skipChancePercent: 50,
    },
  },
  Moonblade: {
    4: {
      skillIds: [SKILL_ID.lifeSteal, SKILL_ID.eviscerate],
      skipChancePercent: 50,
    }
  },
  Raider: {
    4: {
      skillIds: [SKILL_ID.decisiveStrike],
      skipChancePercent: 75,
    }
  },
  Ranger: {
    3: {
      skillIds: [SKILL_ID.frozenArrow],
      skipChancePercent: 75,
    },
    5: {
      skillIds: [SKILL_ID.longShot, SKILL_ID.frozenArrow],
      skipChancePercent: 75,
    },
  },
};
