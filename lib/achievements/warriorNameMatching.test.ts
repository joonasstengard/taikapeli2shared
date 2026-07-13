import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ISMO_WARRIOR_NAME_SUBSTRING } from "./achievementDefinitions";
import {
  extractWarriorNames,
  hasWarriorNameContaining,
  resolvePlayerWarriorNamesForAchievements,
} from "./warriorNameMatching";

describe("extractWarriorNames", () => {
  it("returns an empty array when the army has no warriors", () => {
    assert.deepEqual(extractWarriorNames([]), []);
  });

  it("maps warrior rows to their display names in roster order", () => {
    assert.deepEqual(
      extractWarriorNames([
        { name: "Aragorn" },
        { name: "Ismo Knight" },
        { name: "Legolas" },
      ]),
      ["Aragorn", "Ismo Knight", "Legolas"]
    );
  });

  it("does not mutate the source warrior list", () => {
    const warriors = [{ name: "Ismo" }];
    const names = extractWarriorNames(warriors);

    assert.deepEqual(names, ["Ismo"]);
    assert.deepEqual(warriors, [{ name: "Ismo" }]);
  });
});

describe("resolvePlayerWarriorNamesForAchievements", () => {
  it("returns undefined when there is no active player army", () => {
    assert.equal(
      resolvePlayerWarriorNamesForAchievements(false, [{ name: "Ismo" }]),
      undefined
    );
  });

  it("returns an empty array when the player army exists but has no warriors", () => {
    assert.deepEqual(resolvePlayerWarriorNamesForAchievements(true, []), []);
  });

  it("returns warrior names when the player army exists", () => {
    assert.deepEqual(
      resolvePlayerWarriorNamesForAchievements(true, [
        { name: "Ismo" },
        { name: "Aldric" },
      ]),
      ["Ismo", "Aldric"]
    );
  });
});

describe("hasWarriorNameContaining", () => {
  it("returns false for an empty roster", () => {
    assert.equal(
      hasWarriorNameContaining([], ISMO_WARRIOR_NAME_SUBSTRING),
      false
    );
  });

  it("matches the exact first name Ismo", () => {
    assert.equal(
      hasWarriorNameContaining(["Ismo"], ISMO_WARRIOR_NAME_SUBSTRING),
      true
    );
  });

  it("matches Ismo when a class suffix is appended", () => {
    assert.equal(
      hasWarriorNameContaining(["Ismo Knight"], ISMO_WARRIOR_NAME_SUBSTRING),
      true
    );
  });

  it("matches when Ismo appears among several warriors", () => {
    assert.equal(
      hasWarriorNameContaining(
        ["Aragorn", "Legolas", "Ismo the Bold"],
        ISMO_WARRIOR_NAME_SUBSTRING
      ),
      true
    );
  });

  it("matches when only the last warrior in a large roster is Ismo", () => {
    assert.equal(
      hasWarriorNameContaining(
        [
          "Aldric",
          "Bjorn",
          "Cedric",
          "Darian",
          "Eldric",
          "Ismo",
        ],
        ISMO_WARRIOR_NAME_SUBSTRING
      ),
      true
    );
  });

  it("does not match warriors whose names lack the substring", () => {
    assert.equal(
      hasWarriorNameContaining(
        ["Aragorn", "Legolas", "Gimli"],
        ISMO_WARRIOR_NAME_SUBSTRING
      ),
      false
    );
  });

  it("is case-sensitive and rejects lowercase ismo", () => {
    assert.equal(
      hasWarriorNameContaining(["ismo"], ISMO_WARRIOR_NAME_SUBSTRING),
      false
    );
  });

  it("is case-sensitive and rejects uppercase ISMO", () => {
    assert.equal(
      hasWarriorNameContaining(["ISMO"], ISMO_WARRIOR_NAME_SUBSTRING),
      false
    );
  });

  it("does not match names that merely share letters without the exact substring", () => {
    assert.equal(
      hasWarriorNameContaining(
        ["Prismo", "Chrismo", "Ism"],
        ISMO_WARRIOR_NAME_SUBSTRING
      ),
      false
    );
  });

  it("matches Ismo embedded in a longer generated name", () => {
    assert.equal(
      hasWarriorNameContaining(
        ["Sir Ismo of the Vale"],
        ISMO_WARRIOR_NAME_SUBSTRING
      ),
      true
    );
  });

  it("uses the provided substring literally", () => {
    assert.equal(hasWarriorNameContaining(["Test Name"], "Test"), true);
    assert.equal(hasWarriorNameContaining(["Test Name"], "test"), false);
  });
});

describe("legends of ismo campaign roster scenarios", () => {
  it("qualifies when the starting champion alone is Ismo", () => {
    const rosterNames = extractWarriorNames([{ name: "Ismo" }]);

    assert.equal(
      hasWarriorNameContaining(rosterNames, ISMO_WARRIOR_NAME_SUBSTRING),
      true
    );
  });

  it("qualifies when Ismo is one recruit in a full company", () => {
    const rosterNames = extractWarriorNames([
      { name: "Aldric Paladin" },
      { name: "Bjorn Ranger" },
      { name: "Ismo Berserker" },
      { name: "Cedric Sorcerer" },
    ]);

    assert.equal(
      hasWarriorNameContaining(rosterNames, ISMO_WARRIOR_NAME_SUBSTRING),
      true
    );
  });

  it("does not qualify when Ismo was never part of the winning roster", () => {
    const rosterNames = extractWarriorNames([
      { name: "Aldric Paladin" },
      { name: "Bjorn Ranger" },
      { name: "Cedric Sorcerer" },
    ]);

    assert.equal(
      hasWarriorNameContaining(rosterNames, ISMO_WARRIOR_NAME_SUBSTRING),
      false
    );
  });
});
