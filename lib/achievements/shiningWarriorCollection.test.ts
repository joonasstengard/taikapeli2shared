import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildShiningWarriorCollection,
  formatShiningWarriorCollectionLabel,
} from "./shiningWarriorCollection";
import {
  getShiningWarriorCollectionKey,
  getShiningWarriorCollectionKeyForSprite,
  WARRIOR_SHINING_SPRITES,
} from "../warriors/warriorShiningSprites";

describe("getShiningWarriorCollectionKey", () => {
  it("uses warriorClass + gender + picture as the stable identity", () => {
    assert.equal(
      getShiningWarriorCollectionKey("Knight", "Male", 999),
      "KnightMale999"
    );
    assert.equal(
      getShiningWarriorCollectionKey("Priestess", "Female", 999),
      "PriestessFemale999"
    );
  });

  it("distinguishes multiple shining variants of the same class", () => {
    assert.notEqual(
      getShiningWarriorCollectionKey("Knight", "Male", 999),
      getShiningWarriorCollectionKey("Knight", "Female", 999)
    );
    assert.notEqual(
      getShiningWarriorCollectionKey("Knight", "Male", 999),
      getShiningWarriorCollectionKey("Knight", "Male", 998)
    );
  });

  it("matches the sprite helper for every catalog entry", () => {
    for (const sprite of WARRIOR_SHINING_SPRITES) {
      assert.equal(
        getShiningWarriorCollectionKeyForSprite(sprite),
        getShiningWarriorCollectionKey(
          sprite.warriorClass,
          sprite.gender,
          sprite.picture
        )
      );
    }
  });
});

describe("formatShiningWarriorCollectionLabel", () => {
  it("prefixes the race+class label with Shining", () => {
    assert.equal(
      formatShiningWarriorCollectionLabel({
        warriorClass: "Knight",
        gender: "Male",
        picture: 999,
      }),
      "Shining Human Knight"
    );
    assert.equal(
      formatShiningWarriorCollectionLabel({
        warriorClass: "Marksman",
        gender: "Male",
        picture: 999,
      }),
      "Shining Dwarf Marksman"
    );
    assert.equal(
      formatShiningWarriorCollectionLabel({
        warriorClass: "Priestess",
        gender: "Female",
        picture: 999,
      }),
      "Shining Human Priestess"
    );
  });
});

describe("buildShiningWarriorCollection", () => {
  it("returns the full catalog with nothing collected by default", () => {
    const collection = buildShiningWarriorCollection([]);

    assert.equal(collection.totalCount, WARRIOR_SHINING_SPRITES.length);
    assert.equal(collection.collectedCount, 0);
    assert.equal(collection.entries.length, WARRIOR_SHINING_SPRITES.length);
    assert.ok(collection.entries.every((entry) => entry.collected === false));
    assert.ok(collection.entries.every((entry) => entry.collectedAt === null));
  });

  it("marks matching catalog entries as collected", () => {
    const knight = WARRIOR_SHINING_SPRITES.find(
      (sprite) => sprite.warriorClass === "Knight"
    );
    const priestess = WARRIOR_SHINING_SPRITES.find(
      (sprite) => sprite.warriorClass === "Priestess"
    );
    assert.ok(knight);
    assert.ok(priestess);

    const collectedAt = "2026-07-17T00:00:00.000Z";
    const collection = buildShiningWarriorCollection([
      {
        warriorClass: knight.warriorClass,
        gender: knight.gender,
        picture: knight.picture,
        collectedAt,
      },
      {
        warriorClass: priestess.warriorClass,
        gender: priestess.gender,
        picture: priestess.picture,
        collectedAt: new Date(collectedAt),
      },
    ]);

    assert.equal(collection.collectedCount, 2);
    assert.equal(collection.totalCount, WARRIOR_SHINING_SPRITES.length);

    const knightEntry = collection.entries.find(
      (entry) => entry.warriorClass === "Knight"
    );
    const priestessEntry = collection.entries.find(
      (entry) => entry.warriorClass === "Priestess"
    );
    const lockedEntry = collection.entries.find(
      (entry) => entry.warriorClass === "Ranger"
    );

    assert.deepEqual(knightEntry, {
      warriorClass: knight.warriorClass,
      gender: knight.gender,
      picture: knight.picture,
      race: knight.race,
      collected: true,
      collectedAt,
    });
    assert.deepEqual(priestessEntry, {
      warriorClass: priestess.warriorClass,
      gender: priestess.gender,
      picture: priestess.picture,
      race: priestess.race,
      collected: true,
      collectedAt,
    });
    assert.equal(lockedEntry?.collected, false);
    assert.equal(lockedEntry?.collectedAt, null);
  });

  it("ignores collected identities that are not in the shining catalog", () => {
    const collection = buildShiningWarriorCollection([
      {
        warriorClass: "Knight",
        gender: "Male",
        picture: 1,
        collectedAt: "2026-07-17T00:00:00.000Z",
      },
    ]);

    assert.equal(collection.collectedCount, 0);
    assert.ok(collection.entries.every((entry) => entry.collected === false));
  });

  it("deduplicates repeated collected rows for the same identity", () => {
    const knight = WARRIOR_SHINING_SPRITES.find(
      (sprite) => sprite.warriorClass === "Knight"
    );
    assert.ok(knight);

    const collection = buildShiningWarriorCollection([
      {
        warriorClass: knight.warriorClass,
        gender: knight.gender,
        picture: knight.picture,
        collectedAt: "2026-07-17T00:00:00.000Z",
      },
      {
        warriorClass: knight.warriorClass,
        gender: knight.gender,
        picture: knight.picture,
        collectedAt: "2026-07-18T00:00:00.000Z",
      },
    ]);

    assert.equal(collection.collectedCount, 1);
    assert.equal(
      collection.entries.filter((entry) => entry.collected).length,
      1
    );
    assert.equal(
      collection.entries.find((entry) => entry.warriorClass === "Knight")
        ?.collectedAt,
      "2026-07-17T00:00:00.000Z"
    );
  });

  it("preserves catalog order and full identity fields for every entry", () => {
    const collection = buildShiningWarriorCollection([]);

    assert.deepEqual(
      collection.entries.map((entry) => ({
        warriorClass: entry.warriorClass,
        gender: entry.gender,
        picture: entry.picture,
        race: entry.race,
      })),
      WARRIOR_SHINING_SPRITES.map((sprite) => ({
        warriorClass: sprite.warriorClass,
        gender: sprite.gender,
        picture: sprite.picture,
        race: sprite.race,
      }))
    );
  });

  it("supports collecting every shining warrior in the catalog", () => {
    const collection = buildShiningWarriorCollection(
      WARRIOR_SHINING_SPRITES.map((sprite) => ({
        warriorClass: sprite.warriorClass,
        gender: sprite.gender,
        picture: sprite.picture,
        collectedAt: "2026-07-17T00:00:00.000Z",
      }))
    );

    assert.equal(collection.collectedCount, WARRIOR_SHINING_SPRITES.length);
    assert.equal(collection.totalCount, WARRIOR_SHINING_SPRITES.length);
    assert.ok(collection.entries.every((entry) => entry.collected));
  });
});
