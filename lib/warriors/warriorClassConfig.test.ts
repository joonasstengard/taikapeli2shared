import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classUsesOptionalStat,
  WARRIOR_CLASSES,
  WARRIOR_CLASS_CONFIG,
} from "./warriorClassConfig";

const MANA_CLASSES = new Set([
  "Paladin",
  "Peasant",
  "Warlock",
  "Moonblade",
  "Priestess",
  "Shaman",
  "Sorcerer",
]);
const FAITH_CLASSES = new Set(["Paladin", "Peasant", "Priestess", "Sorcerer"]);
const NO_STAMINA_CLASSES = new Set(["Warlock", "Priestess", "Sorcerer"]);

describe("warrior class conditional stats", () => {
  it("matches the class eligibility matrix", () => {
    for (const warriorClass of WARRIOR_CLASSES) {
      assert.equal(
        classUsesOptionalStat(warriorClass, "mana"),
        MANA_CLASSES.has(warriorClass),
        `${warriorClass} mana`
      );
      assert.equal(
        classUsesOptionalStat(warriorClass, "spellDamage"),
        MANA_CLASSES.has(warriorClass),
        `${warriorClass} spell damage`
      );
      assert.equal(
        classUsesOptionalStat(warriorClass, "faith"),
        FAITH_CLASSES.has(warriorClass),
        `${warriorClass} faith`
      );
      assert.equal(
        classUsesOptionalStat(warriorClass, "stamina"),
        !NO_STAMINA_CLASSES.has(warriorClass),
        `${warriorClass} stamina`
      );
    }
  });

  it("provides a starting range for every enabled conditional stat", () => {
    for (const warriorClass of WARRIOR_CLASSES) {
      const config = WARRIOR_CLASS_CONFIG[warriorClass];
      for (const stat of config.optionalStats) {
        assert.ok(
          config.weightedStats[stat],
          `${warriorClass} is missing a ${stat} starting range`
        );
      }
    }
  });
});
