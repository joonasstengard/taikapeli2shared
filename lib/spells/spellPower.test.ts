import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateDrainHealAmount,
  calculateHolyFaithScalingBonus,
  calculateResourceReduceAmount,
  calculateSkillDamageBonus,
  calculateSkillHealAmount,
  calculateSkillStatScalingBonus,
  calculateSpellDamageBonus,
  calculateSpellHealAmount,
  calculateSpellHealBonus,
  calculateSpellManaRestoreAmount,
  calculateSpellManaRestoreBonus,
  calculateStaminaRestoreAmount,
  calculateStatScalingBonus,
  DEFAULT_SKILL_DAMAGE_SCALING_STAT,
  getSkillDamageScalingStat,
  getSkillScalingStatValue,
  hasManaRestoreEffect,
  toSkillCasterCombatStats,
} from "./spellPower";

const healingPrayer = {
  baseDamageTarget: 0,
  baseHealTarget: 5,
  baseManaRestore: 0,
  scalingFactor: 0.5,
  type: "Holy",
};

const manaPrayer = {
  baseDamageTarget: 0,
  baseHealTarget: 0,
  baseManaRestore: 4,
  scalingFactor: 0.5,
  type: "Holy",
};

const flamewheel = {
  baseDamageTarget: 5,
  baseHealTarget: 0,
  scalingFactor: 0.5,
  type: "Fire",
};

describe("calculateResourceReduceAmount", () => {
  it("caps a reduction at the target's current resource", () => {
    assert.equal(calculateResourceReduceAmount(10, 6), 6);
    assert.equal(calculateResourceReduceAmount(4, 10), 4);
    assert.equal(calculateResourceReduceAmount(undefined, 10), 0);
    assert.equal(calculateResourceReduceAmount(10, 0), 0);
  });
});

describe("calculateStatScalingBonus", () => {
  it("floors stat times scaling factor", () => {
    assert.equal(calculateStatScalingBonus(5, 0.5), 2);
    assert.equal(calculateStatScalingBonus(7, 0.5), 3);
  });

  it("returns zero for non-positive inputs", () => {
    assert.equal(calculateStatScalingBonus(0, 0.5), 0);
    assert.equal(calculateStatScalingBonus(5, 0), 0);
  });
});

describe("calculateHolyFaithScalingBonus", () => {
  it("applies only to holy spells", () => {
    assert.equal(calculateHolyFaithScalingBonus(healingPrayer, 5), 2);
    assert.equal(calculateHolyFaithScalingBonus(flamewheel, 5), 0);
  });
});

describe("calculateSpellHealBonus", () => {
  it("adds faith scaling only when the spell heals", () => {
    assert.equal(
      calculateSpellHealBonus(healingPrayer, { faith: 5, spellDamage: 0 }),
      2
    );
    assert.equal(calculateSpellHealBonus(flamewheel, { faith: 5, spellDamage: 10 }), 0);
  });
});

describe("calculateSpellManaRestoreBonus", () => {
  it("adds faith scaling only when the spell restores mana", () => {
    assert.equal(
      calculateSpellManaRestoreBonus(manaPrayer, { faith: 5, spellDamage: 0 }),
      2
    );
    assert.equal(
      calculateSpellManaRestoreBonus(flamewheel, { faith: 5, spellDamage: 10 }),
      0
    );
  });
});

describe("calculateSpellDamageBonus", () => {
  it("adds faith scaling only when the spell deals damage", () => {
    const ilyrsSmite = {
      baseDamageTarget: 4,
      baseHealTarget: 0,
      scalingFactor: 0.5,
      type: "Holy",
    };

    assert.equal(calculateSpellDamageBonus(ilyrsSmite, { faith: 5, spellDamage: 0 }), 2);
    assert.equal(calculateSpellDamageBonus(ilyrsSmite, { faith: 0, spellDamage: 10 }), 5);
    assert.equal(calculateSpellDamageBonus(ilyrsSmite, { faith: 5, spellDamage: 6 }), 5);
    assert.equal(calculateSpellDamageBonus(healingPrayer, { faith: 5, spellDamage: 10 }), 0);
  });

  it("adds spellDamage scaling to all damage spells", () => {
    assert.equal(
      calculateSpellDamageBonus(flamewheel, { faith: 0, spellDamage: 6 }),
      3
    );
    assert.equal(
      calculateSpellDamageBonus(flamewheel, { faith: 10, spellDamage: 6 }),
      3
    );
  });
});

describe("getSkillDamageScalingStat", () => {
  it("defaults to strength when damageScalingStat is omitted", () => {
    assert.equal(
      getSkillDamageScalingStat({}),
      DEFAULT_SKILL_DAMAGE_SCALING_STAT
    );
  });

  it("returns the configured scaling stat", () => {
    assert.equal(
      getSkillDamageScalingStat({
        damageScalingStat: "speed",
      }),
      "speed"
    );
  });
});

describe("getSkillScalingStatValue", () => {
  const caster = toSkillCasterCombatStats({
    strength: 10,
    speed: 4,
    faith: 2,
    spellDamage: 3,
  });

  it("reads each combat stat from caster stats", () => {
    assert.equal(getSkillScalingStatValue(caster, "strength"), 10);
    assert.equal(getSkillScalingStatValue(caster, "speed"), 4);
    assert.equal(getSkillScalingStatValue(caster, "faith"), 2);
    assert.equal(getSkillScalingStatValue(caster, "spellDamage"), 3);
  });
});

describe("calculateSkillStatScalingBonus", () => {
  it("floors stat times scaling factor", () => {
    assert.equal(
      calculateSkillStatScalingBonus({ scalingFactor: 0.5 }, 7),
      3
    );
  });
});

describe("calculateSkillDamageBonus", () => {
  const caster = toSkillCasterCombatStats({
    strength: 6,
    speed: 9,
    faith: 4,
    spellDamage: 8,
  });

  it("adds strength scaling to damaging skills by default", () => {
    assert.equal(
      calculateSkillDamageBonus(flamewheel, caster),
      3
    );
  });

  it("adds speed scaling when damageScalingStat is speed", () => {
    assert.equal(
      calculateSkillDamageBonus(
        { ...flamewheel, damageScalingStat: "speed" },
        caster
      ),
      4
    );
  });

  it("does not use strength when damageScalingStat is speed", () => {
    assert.equal(
      calculateSkillDamageBonus(
        {
          baseDamageTarget: 5,
          baseHealTarget: 0,
          scalingFactor: 1,
          damageScalingStat: "speed",
        },
        toSkillCasterCombatStats({ strength: 20, speed: 3 })
      ),
      3
    );
  });

  it("does not use speed when damageScalingStat is omitted", () => {
    assert.equal(
      calculateSkillDamageBonus(
        { baseDamageTarget: 5, baseHealTarget: 0, scalingFactor: 1 },
        toSkillCasterCombatStats({ strength: 3, speed: 20 })
      ),
      3
    );
  });

  it("supports faith and spellDamage scaling stats", () => {
    assert.equal(
      calculateSkillDamageBonus(
        {
          baseDamageTarget: 2,
          baseHealTarget: 0,
          scalingFactor: 0.5,
          damageScalingStat: "faith",
        },
        caster
      ),
      2
    );
    assert.equal(
      calculateSkillDamageBonus(
        {
          baseDamageTarget: 2,
          baseHealTarget: 0,
          scalingFactor: 0.5,
          damageScalingStat: "spellDamage",
        },
        caster
      ),
      4
    );
  });

  it("does not scale healing skills", () => {
    assert.equal(
      calculateSkillDamageBonus(healingPrayer, caster),
      0
    );
  });
});

describe("calculateSpellHealAmount", () => {
  it("includes faith bonus and caps at missing health", () => {
    assert.equal(
      calculateSpellHealAmount(healingPrayer, { faith: 5, spellDamage: 0 }, 10, 20),
      7
    );
    assert.equal(
      calculateSpellHealAmount(healingPrayer, { faith: 5, spellDamage: 0 }, 18, 20),
      2
    );
  });

  it("returns zero for dead or full-health targets", () => {
    assert.equal(
      calculateSpellHealAmount(healingPrayer, { faith: 5, spellDamage: 0 }, 0, 20),
      0
    );
    assert.equal(
      calculateSpellHealAmount(healingPrayer, { faith: 5, spellDamage: 0 }, 20, 20),
      0
    );
  });

  it("adds Devotion bonus for Priestess healing spells", () => {
    assert.equal(
      calculateSpellHealAmount(
        healingPrayer,
        { faith: 5, spellDamage: 0 },
        10,
        20,
        "Priestess"
      ),
      8
    );
    assert.equal(
      calculateSpellHealAmount(
        healingPrayer,
        { faith: 5, spellDamage: 0 },
        10,
        20,
        "Paladin"
      ),
      7
    );
  });
});

describe("calculateSkillHealAmount", () => {
  it("uses only base healing and caps at missing health", () => {
    assert.equal(calculateSkillHealAmount(healingPrayer, 10, 20), 5);
    assert.equal(calculateSkillHealAmount(healingPrayer, 18, 20), 2);
  });
});

describe("calculateStaminaRestoreAmount", () => {
  it("restores up to the base amount, capped by missing stamina", () => {
    assert.equal(calculateStaminaRestoreAmount(3, 5, 12), 3);
    assert.equal(calculateStaminaRestoreAmount(3, 11, 12), 1);
    assert.equal(calculateStaminaRestoreAmount(3, 12, 12), 0);
  });

  it("restores stamina from zero current stamina", () => {
    assert.equal(calculateStaminaRestoreAmount(6, 0, 12), 6);
    assert.equal(calculateStaminaRestoreAmount(8, 0, 5), 5);
  });

  it("returns zero when there is nothing to restore", () => {
    assert.equal(calculateStaminaRestoreAmount(0, 0, 12), 0);
    assert.equal(calculateStaminaRestoreAmount(3, 5, 0), 0);
  });
});

describe("hasManaRestoreEffect", () => {
  it("detects mana restore spells", () => {
    assert.equal(hasManaRestoreEffect(manaPrayer), true);
    assert.equal(hasManaRestoreEffect(healingPrayer), false);
    assert.equal(hasManaRestoreEffect({}), false);
  });
});

describe("calculateSpellManaRestoreAmount", () => {
  it("includes faith bonus and caps at missing mana", () => {
    assert.equal(
      calculateSpellManaRestoreAmount(
        manaPrayer,
        { faith: 5, spellDamage: 0 },
        2,
        12,
        10
      ),
      6
    );
    assert.equal(
      calculateSpellManaRestoreAmount(
        manaPrayer,
        { faith: 5, spellDamage: 0 },
        10,
        12,
        10
      ),
      2
    );
  });

  it("returns zero for dead allies, full mana, or no mana pool", () => {
    assert.equal(
      calculateSpellManaRestoreAmount(
        manaPrayer,
        { faith: 5, spellDamage: 0 },
        2,
        12,
        0
      ),
      0
    );
    assert.equal(
      calculateSpellManaRestoreAmount(
        manaPrayer,
        { faith: 5, spellDamage: 0 },
        12,
        12,
        10
      ),
      0
    );
    assert.equal(
      calculateSpellManaRestoreAmount(
        manaPrayer,
        { faith: 5, spellDamage: 0 },
        0,
        0,
        10
      ),
      0
    );
  });
});

describe("calculateDrainHealAmount", () => {
  it("heals up to damage dealt, capped by missing health", () => {
    assert.equal(calculateDrainHealAmount(8, 10, 20), 8);
    assert.equal(calculateDrainHealAmount(8, 17, 20), 3);
  });

  it("returns zero when no damage was dealt or caster is full", () => {
    assert.equal(calculateDrainHealAmount(0, 10, 20), 0);
    assert.equal(calculateDrainHealAmount(5, 20, 20), 0);
  });
});
