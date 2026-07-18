import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatAbilityTargetingType,
  formatAbilityType,
  formatSkillScalingLabel,
  formatSpellScalingLabel,
  getAbilityDisplayRows,
  shouldShowAbilityType,
} from "./formatAbilityDisplay";

const baseSkill = {
  description: "Deal damage to an enemy.",
  staminaCost: 4,
  baseDamageTarget: 2,
  baseHealTarget: 0,
  baseStaminaRestore: 0,
  scalingFactor: 0.8,
  type: null,
  range: 1,
  targetingType: "enemy" as const,
  manaCost: 0,
  baseManaRestore: 0,
};

const baseSpell = {
  description: "Restore mana to an ally.",
  manaCost: 3,
  baseDamageTarget: 0,
  baseHealTarget: 0,
  baseManaRestore: 4,
  scalingFactor: 0.5,
  type: "Holy" as const,
  range: 2,
  targetingType: "ally" as const,
  staminaCost: 0,
  baseStaminaRestore: 0,
};

describe("formatAbilityTargetingType", () => {
  it("maps every targeting type to a readable label", () => {
    assert.equal(formatAbilityTargetingType("self"), "Self");
    assert.equal(formatAbilityTargetingType("enemyAoE"), "Enemy (area splash)");
    assert.equal(
      formatAbilityTargetingType("allAllies"),
      "All allies in range (including self)"
    );
    assert.equal(
      formatAbilityTargetingType("otherAllies"),
      "Other allies in range"
    );
    assert.equal(formatAbilityTargetingType("otherAlly"), "Other ally");
    assert.equal(formatAbilityTargetingType("allEnemies"), "All enemies in range");
  });
});

describe("formatAbilityType", () => {
  it("returns null for empty or null types", () => {
    assert.equal(shouldShowAbilityType(null), false);
    assert.equal(shouldShowAbilityType("null"), false);
    assert.equal(formatAbilityType(null), null);
    assert.equal(formatAbilityType("null"), null);
  });

  it("returns the type label when present", () => {
    assert.equal(formatAbilityType("Holy"), "Holy");
  });
});

describe("formatSkillScalingLabel", () => {
  it("returns null when scaling factor is zero", () => {
    assert.equal(
      formatSkillScalingLabel({ scalingFactor: 0, damageScalingStat: "speed" }),
      null
    );
  });

  it("includes the scaling stat label", () => {
    assert.equal(
      formatSkillScalingLabel({ scalingFactor: 0.8, damageScalingStat: "speed" }),
      "0.8 (Speed)"
    );
    assert.equal(formatSkillScalingLabel({ scalingFactor: 1 }), "1 (Strength)");
  });
});

describe("formatSpellScalingLabel", () => {
  it("returns null when scaling factor is zero", () => {
    assert.equal(
      formatSpellScalingLabel({ scalingFactor: 0, type: "Holy" }),
      null
    );
  });

  it("includes faith for holy spells", () => {
    assert.equal(
      formatSpellScalingLabel({ scalingFactor: 0.5, type: "Holy" }),
      "0.5 (Spell Damage, Faith)"
    );
    assert.equal(
      formatSpellScalingLabel({ scalingFactor: 0.5, type: "Fire" }),
      "0.5 (Spell Damage)"
    );
  });
});

describe("getAbilityDisplayRows", () => {
  it("includes unlock, description, and cost rows for locked warrior abilities", () => {
    const rows = getAbilityDisplayRows(baseSkill, {
      kind: "skill",
      isLocked: true,
      requiredLevel: 3,
      includeDescription: true,
      includeUnlock: true,
      includeCost: true,
    });

    assert.deepEqual(rows.slice(0, 3), [
      { kind: "unlock", requiredLevel: 3 },
      { kind: "description", text: baseSkill.description },
      { kind: "cost", resource: "stamina", amount: 4 },
    ]);
  });

  it("includes skill-only stamina restore and omits mana restore", () => {
    const rows = getAbilityDisplayRows(
      {
        ...baseSkill,
        baseDamageTarget: 0,
        baseStaminaRestore: 2,
        scalingFactor: 0,
      },
      {
        kind: "skill",
        includeCost: true,
      }
    );

    assert.ok(
      rows.some(
        (row) =>
          row.kind === "stat" &&
          row.label === "Stamina restore" &&
          row.value === "2"
      )
    );
    assert.ok(
      !rows.some(
        (row) => row.kind === "stat" && row.label === "Mana restore"
      )
    );
  });

  it("includes spell-only mana restore and omits stamina restore", () => {
    const rows = getAbilityDisplayRows(baseSpell, {
      kind: "spell",
      includeCost: true,
    });

    assert.ok(
      rows.some(
        (row) =>
          row.kind === "stat" &&
          row.label === "Mana restore" &&
          row.value === "4"
      )
    );
    assert.ok(
      !rows.some(
        (row) => row.kind === "stat" && row.label === "Stamina restore"
      )
    );
  });

  it("hides type, scaling, and range when configured values are empty", () => {
    const rows = getAbilityDisplayRows(
      {
        ...baseSkill,
        baseDamageTarget: 0,
        scalingFactor: 0,
        range: 0,
        type: null,
      },
      {
        kind: "skill",
        includeCost: true,
      }
    );

    assert.ok(!rows.some((row) => row.kind === "stat" && row.label === "Type"));
    assert.ok(
      !rows.some((row) => row.kind === "stat" && row.label === "Scaling")
    );
    assert.ok(!rows.some((row) => row.kind === "scaling"));
    assert.ok(!rows.some((row) => row.kind === "stat" && row.label === "Range"));
    assert.ok(
      rows.some(
        (row) =>
          row.kind === "stat" &&
          row.label === "Targeting" &&
          row.value === "Enemy"
      )
    );
  });

  it("uses combat value overrides when provided", () => {
    const rows = getAbilityDisplayRows(baseSkill, {
      kind: "skill",
      includeCost: true,
      combatValues: {
        damage: 7,
        heal: null,
      },
    });

    assert.ok(
      rows.some(
        (row) => row.kind === "stat" && row.label === "Damage" && row.value === "7"
      )
    );
  });

  it("appends note rows after combat stats", () => {
    const rows = getAbilityDisplayRows(baseSkill, {
      kind: "skill",
      includeCost: true,
      notes: ["Up to 2× at low health"],
    });

    const noteIndex = rows.findIndex((row) => row.kind === "note");
    const scalingIndex = rows.findIndex((row) => row.kind === "scaling");

    assert.ok(noteIndex >= 0);
    assert.ok(noteIndex < scalingIndex);
  });
});
