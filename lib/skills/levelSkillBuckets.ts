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
    1: {
      skillIds: [SKILL_ID.cavalryCharge],
    },
    2: {
      skillIds: [SKILL_ID.stomp, SKILL_ID.overrun],
    },
    3: {
      skillIds: [SKILL_ID.stomp, SKILL_ID.overrun],
    },
  },
  Knight: {
    1: {
      skillIds: [SKILL_ID.decisiveStrike, SKILL_ID.protect, SKILL_ID.repellingBlow],
    },
    2: {
      skillIds: [SKILL_ID.decisiveStrike, SKILL_ID.martyrdom, SKILL_ID.protect, SKILL_ID.repellingBlow],
    },
    4: {
      skillIds: [SKILL_ID.lastStand, SKILL_ID.martyrdom, SKILL_ID.repellingSlam],
    },
  },
  King: {
    1: {
      skillIds: [SKILL_ID.commandAttack, SKILL_ID.battleDecree],
    },
    2: {
      skillIds: [
        SKILL_ID.lastStand,
        SKILL_ID.raiseMorale,
        SKILL_ID.rallyTroops,
        SKILL_ID.commandAttack,
        SKILL_ID.battleDecree,
      ],
    },
    3: {
      skillIds: [
        SKILL_ID.lastStand,
        SKILL_ID.commandAttack,
        SKILL_ID.battleDecree,
      ],
    },
    4: {
      skillIds: [
        SKILL_ID.lastStand,
        SKILL_ID.commandAttack,
        SKILL_ID.warDecree,
      ],
    },
  },
  Marksman: {
    1: {
      skillIds: [SKILL_ID.criticalBolt, SKILL_ID.longShot],
      skipChancePercent: 50,
    },
    2: {
      skillIds: [SKILL_ID.criticalBolt, SKILL_ID.longShot, SKILL_ID.takeAim],
    },
    4: {
      skillIds: [SKILL_ID.criticalBolt, SKILL_ID.longShot, SKILL_ID.takeAim],
    },
  },
  Moonblade: {
    1: {
      skillIds: [SKILL_ID.lifeSteal, SKILL_ID.crescentSlash],
    },
    2: {
      skillIds: [SKILL_ID.eclipseHarvest, SKILL_ID.crescentSlash, SKILL_ID.lifeSteal],
    },
    3: {
      skillIds: [SKILL_ID.moonlitVeil],
      skipChancePercent: 50,
    },
    4: {
      skillIds: [
        SKILL_ID.fullMoonHarvest,
        SKILL_ID.bladeDance,
      ],
    },
  },
  Paladin: {
    1: {
      skillIds: [SKILL_ID.blessHammer],
    },
    3: {
      skillIds: [SKILL_ID.crusade],
    },
  },
  Berserker: {
    1: {
      skillIds: [SKILL_ID.eviscerate],
    },
    2: {
      skillIds: [SKILL_ID.lunge],
    },
    4: {
      skillIds: [SKILL_ID.cutthroat, SKILL_ID.berserk],
    },
  },
  Ranger: {
    1: {
      skillIds: [
        SKILL_ID.frozenArrow,
        SKILL_ID.arrowVolley,
        SKILL_ID.fadeArrow,
      ],
      skipChancePercent: 20,
    },
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
  Shaman: {
    1: {
      skillIds: [
        SKILL_ID.transformWolf,
        SKILL_ID.transformDeer,
        SKILL_ID.transformBear,
      ],
    },
    2: {
      skillIds: [
        SKILL_ID.primalSlam,
        SKILL_ID.bogPotion,
      ],
    },
  },
  Peasant: {
    2: {
      skillIds: [SKILL_ID.jab, SKILL_ID.desperateSwing, SKILL_ID.scrounge, SKILL_ID.panicStrike],
    },
    4: {
      skillIds: [SKILL_ID.jab, SKILL_ID.desperateSwing, SKILL_ID.panicStrike],
    },
  },
};
