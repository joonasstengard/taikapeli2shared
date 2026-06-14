import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyMagicResistance,
  calculateHolyFaithScalingBonus,
  calculateSkillDamageBonus,
  calculateSkillHealAmount,
  calculateSpellDamageBonus,
  calculateSpellHealAmount,
  calculateSpellHealBonus,
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

describe("applyMagicResistance", () => {
  it("reduces damage by magic resistance percentage", () => {
    assert.equal(applyMagicResistance(10, 0), 10);
    assert.equal(applyMagicResistance(10, 50), 5);
  });
});
