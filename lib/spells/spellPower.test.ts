import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateDrainHealAmount,
  calculateHolyFaithScalingBonus,
  calculateSkillDamageBonus,
  calculateSkillHealAmount,
  calculateSpellDamageBonus,
  calculateSpellHealAmount,
  calculateSpellHealBonus,
  calculateStaminaRestoreAmount,
  calculateStatScalingBonus,
} from "./spellPower";

const healingPrayer = {
  baseDamageTarget: 0,
  baseHealTarget: 5,
  scalingFactor: 0.5,
  type: "Holy",
};

const fireball = {
  baseDamageTarget: 5,
  baseHealTarget: 0,
  scalingFactor: 0.5,
  type: "Fire",
};

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
    assert.equal(calculateHolyFaithScalingBonus(fireball, 5), 0);
  });
});

describe("calculateSpellHealBonus", () => {
  it("adds faith scaling only when the spell heals", () => {
    assert.equal(
      calculateSpellHealBonus(healingPrayer, { faith: 5, spellDamage: 0 }),
      2
    );
    assert.equal(calculateSpellHealBonus(fireball, { faith: 5, spellDamage: 10 }), 0);
  });
});

describe("calculateSpellDamageBonus", () => {
  it("adds faith scaling only when the spell deals damage", () => {
    const holySmite = {
      baseDamageTarget: 4,
      baseHealTarget: 0,
      scalingFactor: 0.5,
      type: "Holy",
    };

    assert.equal(calculateSpellDamageBonus(holySmite, { faith: 5, spellDamage: 0 }), 2);
    assert.equal(calculateSpellDamageBonus(holySmite, { faith: 0, spellDamage: 10 }), 5);
    assert.equal(calculateSpellDamageBonus(holySmite, { faith: 5, spellDamage: 6 }), 5);
    assert.equal(calculateSpellDamageBonus(healingPrayer, { faith: 5, spellDamage: 10 }), 0);
  });

  it("adds spellDamage scaling to all damage spells", () => {
    assert.equal(
      calculateSpellDamageBonus(fireball, { faith: 0, spellDamage: 6 }),
      3
    );
    assert.equal(
      calculateSpellDamageBonus(fireball, { faith: 10, spellDamage: 6 }),
      3
    );
  });
});

describe("calculateSkillDamageBonus", () => {
  it("adds strength scaling to damaging skills", () => {
    assert.equal(
      calculateSkillDamageBonus(fireball, { strength: 6 }),
      3
    );
  });

  it("does not scale healing skills", () => {
    assert.equal(
      calculateSkillDamageBonus(healingPrayer, { strength: 6 }),
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
