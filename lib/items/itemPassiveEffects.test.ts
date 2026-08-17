import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ITEM_ID } from "./itemIds";
import { getItemById } from "./itemCatalog";
import {
  applyPrimalAbilityHealthRestoreToWarrior,
  applySpellCastManaMasteryRestoreToWarrior,
  applyTakedownVictimHealthRestoreToWarrior,
  grantsPrimalAbilityHealthRestore,
  grantsSpellCastManaMasteryRestore,
  grantsTakedownVictimHealthRestore,
} from "./itemPassiveEffects";
import { ITEM_PASSIVE_EFFECT_KEY } from "./itemTypes";

describe("grantsSpellCastManaMasteryRestore", () => {
  it("applies when Arkenfall Crystals are equipped", () => {
    const crystals = getItemById(ITEM_ID.arkenfallCrystals);
    assert.equal(grantsSpellCastManaMasteryRestore(crystals), true);
  });

  it("does not apply without the item effect", () => {
    assert.equal(grantsSpellCastManaMasteryRestore(null), false);
    assert.equal(
      grantsSpellCastManaMasteryRestore(getItemById(ITEM_ID.wornBand)),
      false
    );
  });
});

describe("applySpellCastManaMasteryRestoreToWarrior", () => {
  it("restores 1 mana when Mana Mastery is equipped", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        item: {
          effects: [ITEM_PASSIVE_EFFECT_KEY.manaMastery],
        },
        currentMana: 4,
        mana: 12,
      }),
      { currentMana: 5 }
    );
  });

  it("does not restore mana without Mana Mastery", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        item: null,
        currentMana: 4,
        mana: 12,
      }),
      { currentMana: 4 }
    );
  });

  it("does not exceed max mana", () => {
    assert.deepEqual(
      applySpellCastManaMasteryRestoreToWarrior({
        item: {
          effects: [ITEM_PASSIVE_EFFECT_KEY.manaMastery],
        },
        currentMana: 12,
        mana: 12,
      }),
      { currentMana: 12 }
    );
  });
});

describe("grantsPrimalAbilityHealthRestore", () => {
  it("applies when Aeronor Mandrake is equipped for Primal abilities", () => {
    const mandrake = getItemById(ITEM_ID.aeronorMandrake);
    assert.equal(grantsPrimalAbilityHealthRestore(mandrake, "Primal"), true);
  });

  it("does not apply to non-Primal abilities or without the item", () => {
    const mandrake = getItemById(ITEM_ID.aeronorMandrake);
    assert.equal(grantsPrimalAbilityHealthRestore(mandrake, "Holy"), false);
    assert.equal(grantsPrimalAbilityHealthRestore(mandrake, null), false);
    assert.equal(grantsPrimalAbilityHealthRestore(null, "Primal"), false);
    assert.equal(
      grantsPrimalAbilityHealthRestore(getItemById(ITEM_ID.wornBand), "Primal"),
      false
    );
  });
});

describe("applyPrimalAbilityHealthRestoreToWarrior", () => {
  it("restores 5 health after a Primal ability when Primal Mending is equipped", () => {
    assert.deepEqual(
      applyPrimalAbilityHealthRestoreToWarrior(
        {
          item: {
            effects: [ITEM_PASSIVE_EFFECT_KEY.primalMending],
          },
          currentHealth: 4,
          health: 12,
        },
        "Primal"
      ),
      { currentHealth: 9 }
    );
  });

  it("does not restore health without Primal Mending or for non-Primal abilities", () => {
    assert.deepEqual(
      applyPrimalAbilityHealthRestoreToWarrior(
        {
          item: null,
          currentHealth: 4,
          health: 12,
        },
        "Primal"
      ),
      { currentHealth: 4 }
    );
    assert.deepEqual(
      applyPrimalAbilityHealthRestoreToWarrior(
        {
          item: {
            effects: [ITEM_PASSIVE_EFFECT_KEY.primalMending],
          },
          currentHealth: 4,
          health: 12,
        },
        "Holy"
      ),
      { currentHealth: 4 }
    );
  });

  it("does not exceed max health", () => {
    assert.deepEqual(
      applyPrimalAbilityHealthRestoreToWarrior(
        {
          item: {
            effects: [ITEM_PASSIVE_EFFECT_KEY.primalMending],
          },
          currentHealth: 10,
          health: 12,
        },
        "Primal"
      ),
      { currentHealth: 12 }
    );
  });

  it("does not restore health for defeated warriors", () => {
    assert.deepEqual(
      applyPrimalAbilityHealthRestoreToWarrior(
        {
          item: {
            effects: [ITEM_PASSIVE_EFFECT_KEY.primalMending],
          },
          currentHealth: 0,
          health: 12,
        },
        "Primal"
      ),
      { currentHealth: 0 }
    );
  });
});

describe("grantsTakedownVictimHealthRestore", () => {
  it("applies when Thalen Antlered Skull is equipped", () => {
    const skull = getItemById(ITEM_ID.thalenAntleredSkull);
    assert.equal(grantsTakedownVictimHealthRestore(skull), true);
  });

  it("does not apply without the item effect", () => {
    assert.equal(grantsTakedownVictimHealthRestore(null), false);
    assert.equal(
      grantsTakedownVictimHealthRestore(getItemById(ITEM_ID.wornBand)),
      false
    );
  });
});

describe("applyTakedownVictimHealthRestoreToWarrior", () => {
  it("restores half of the victim's max health when Trophy Harvest is equipped", () => {
    assert.deepEqual(
      applyTakedownVictimHealthRestoreToWarrior(
        {
          item: {
            effects: [ITEM_PASSIVE_EFFECT_KEY.trophyHarvest],
          },
          currentHealth: 4,
          health: 20,
        },
        10
      ),
      { currentHealth: 9 }
    );
  });

  it("rounds half of odd victim max health", () => {
    assert.deepEqual(
      applyTakedownVictimHealthRestoreToWarrior(
        {
          item: {
            effects: [ITEM_PASSIVE_EFFECT_KEY.trophyHarvest],
          },
          currentHealth: 4,
          health: 20,
        },
        11
      ),
      { currentHealth: 10 }
    );
  });

  it("does not restore health without Trophy Harvest", () => {
    assert.deepEqual(
      applyTakedownVictimHealthRestoreToWarrior(
        {
          item: null,
          currentHealth: 4,
          health: 20,
        },
        10
      ),
      { currentHealth: 4 }
    );
  });

  it("does not exceed max health", () => {
    assert.deepEqual(
      applyTakedownVictimHealthRestoreToWarrior(
        {
          item: {
            effects: [ITEM_PASSIVE_EFFECT_KEY.trophyHarvest],
          },
          currentHealth: 18,
          health: 20,
        },
        10
      ),
      { currentHealth: 20 }
    );
  });

  it("does not restore health for defeated warriors", () => {
    assert.deepEqual(
      applyTakedownVictimHealthRestoreToWarrior(
        {
          item: {
            effects: [ITEM_PASSIVE_EFFECT_KEY.trophyHarvest],
          },
          currentHealth: 0,
          health: 20,
        },
        10
      ),
      { currentHealth: 0 }
    );
  });
});
