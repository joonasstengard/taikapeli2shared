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
      skillIds: [SKILL_ID.trample, SKILL_ID.overrun],
    },
    4: {
      skillIds: [SKILL_ID.cavalryOnslaught, SKILL_ID.stampede],
    },
  },
  Knight: {
    1: {
      skillIds: [SKILL_ID.decisiveStrike, SKILL_ID.repellingBlow],
    },
    2: {
      skillIds: [SKILL_ID.protect],
    },
    3: {
      skillIds: [SKILL_ID.martyrdom, SKILL_ID.guardianLeap],
    },
    4: {
      skillIds: [SKILL_ID.repellingSlam, SKILL_ID.stunningSlam],
    },
  },
  Infiltrator: {
    1: {
      skillIds: [SKILL_ID.stealthStrike],
    },
    2: {
      skillIds: [SKILL_ID.camouflage],
    },
    3: {
      skillIds: [SKILL_ID.shadowStrike],
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
      ],
    },
    3: {
      skillIds: [
        SKILL_ID.swiftDecree, SKILL_ID.warDecree,
      ],
    },
    4: {
      skillIds: [
        SKILL_ID.commandWar,
      ],
    },
  },
  Marksman: {
    1: {
      skillIds: [SKILL_ID.crowsBolt, SKILL_ID.longShot],
      skipChancePercent: 50,
    },
    2: {
      skillIds: [SKILL_ID.crowsBolt, SKILL_ID.longShot, SKILL_ID.takeAim],
    },
    4: {
      skillIds: [SKILL_ID.repellingBolt],
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
      skillIds: [SKILL_ID.blessHammer, SKILL_ID.hammerPummel],
      skipChancePercent: 1,
      },
    2: {
      skillIds: [SKILL_ID.frontlineOath],
    },
    3: {
      skillIds: [SKILL_ID.crusade],
      skipChancePercent: 1,
    },
  },
  Berserker: {
    1: {
      skillIds: [SKILL_ID.eviscerate],
    },
    2: {
      skillIds: [SKILL_ID.lunge],
    },
    3: {
      skillIds: [SKILL_ID.cutthroat, SKILL_ID.berserk,],
    },
    4: {
      skillIds: [ SKILL_ID.berserkCharge],
    },
  },
  Brutalizer: {
    1: {
      skillIds: [SKILL_ID.kneeCrack, SKILL_ID.skullCrack],
    },
    2: {
      skillIds: [SKILL_ID.brutalCharge],
    },
    3: {
      skillIds: [SKILL_ID.ribShatter, SKILL_ID.spineCrack],
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
        SKILL_ID.transformSkarWolf,
        SKILL_ID.transformThalenStag,
        SKILL_ID.transformAeronorBear,
      ],
    },
    2: {
      skillIds: [
        SKILL_ID.primalSlam,
        SKILL_ID.spiritMaul
      ],
    },
    3: {
      skillIds: [SKILL_ID.bogPotion],
    },
  },
  Peasant: {
    2: {
      skillIds: [SKILL_ID.jab, SKILL_ID.desperateSwing, SKILL_ID.fieldScavenge, SKILL_ID.panicStrike],
    },
    4: {
      skillIds: [SKILL_ID.jab, SKILL_ID.desperateSwing, SKILL_ID.panicStrike],
    },
  },
};
