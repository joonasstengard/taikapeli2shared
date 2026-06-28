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
  Charger: {
    3: {
      skillIds: [SKILL_ID.stomp, SKILL_ID.cavalryCharge],
    }
  },
  Knight: {
    2: {
      skillIds: [SKILL_ID.decisiveStrike, SKILL_ID.martyrdom],
      skipChancePercent: 10,
    },
    4: {
      skillIds: [SKILL_ID.lastStand, SKILL_ID.lunge, SKILL_ID.martyrdom],
      skipChancePercent: 10,
    },
  },
  King: {
    2: {
      skillIds: [SKILL_ID.lastStand, SKILL_ID.raiseMorale, SKILL_ID.rallyTroops, SKILL_ID.commandAttack]
    },
    4: {
      skillIds: [SKILL_ID.rallyTroops, SKILL_ID.lastStand, SKILL_ID.commandAttack]
    },
  },
  Marksman: {
    3: {
      skillIds: [SKILL_ID.criticalBolt, SKILL_ID.longShot],
      skipChancePercent: 10
    },
  },
  Moonblade: {
    3: {
      skillIds: [SKILL_ID.moonHarvest],
      skipChancePercent: 33
    }
  },
  Paladin: {
    3: {
      skillIds: [SKILL_ID.raiseMorale]
    },
  },
  Raider: {
    2: {
      skillIds: [SKILL_ID.lunge],
    },
    4: {
      skillIds: [SKILL_ID.cutthroat],
    },
  },
  Ranger: {
    2: {
      skillIds: [
        SKILL_ID.frozenArrow,
        SKILL_ID.arrowVolley,
        SKILL_ID.fadeArrow,
      ],
      skipChancePercent: 10,
    },
    4: {
      skillIds: [
        SKILL_ID.frozenArrow,
        SKILL_ID.arrowVolley,
        SKILL_ID.fadeArrow,
      ],
      skipChancePercent: 10,
    },
  },
};
