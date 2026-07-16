import type {
  WarriorClass,
  WarriorGender,
} from "../warriors/warriorPictureVariants";
import type { WarriorRace } from "../warriors/warriorRaces";
import { formatWarriorClassLabel } from "../warriors/warriorRaces";
import {
  getShiningWarriorCollectionKey,
  getShiningWarriorCollectionKeyForSprite,
  WARRIOR_SHINING_SPRITES,
  type WarriorShiningSprite,
} from "../warriors/warriorShiningSprites";

export interface ShiningWarriorCollectionIdentity {
  warriorClass: WarriorClass;
  gender: WarriorGender;
  picture: number;
}

export interface ShiningWarriorCollectionEntry
  extends ShiningWarriorCollectionIdentity {
  race: WarriorRace;
  collected: boolean;
  /** ISO timestamp when collected; null when locked. */
  collectedAt: string | null;
}

export interface ShiningWarriorCollection {
  collectedCount: number;
  totalCount: number;
  entries: ShiningWarriorCollectionEntry[];
}

export function formatShiningWarriorCollectionLabel(
  sprite: Pick<WarriorShiningSprite, "warriorClass" | "gender" | "picture">
): string {
  return `Shining ${formatWarriorClassLabel(
    sprite.warriorClass,
    sprite.gender,
    sprite.picture
  )}`;
}

export function buildShiningWarriorCollection(
  collected: ReadonlyArray<
    ShiningWarriorCollectionIdentity & { collectedAt?: string | Date | null }
  >
): ShiningWarriorCollection {
  const collectedAtByKey = new Map<string, string | null>();

  for (const row of collected) {
    const key = getShiningWarriorCollectionKey(
      row.warriorClass,
      row.gender,
      row.picture
    );
    if (collectedAtByKey.has(key)) {
      continue;
    }

    const collectedAt =
      row.collectedAt === undefined || row.collectedAt === null
        ? null
        : typeof row.collectedAt === "string"
          ? row.collectedAt
          : new Date(row.collectedAt).toISOString();

    collectedAtByKey.set(key, collectedAt);
  }

  const entries = WARRIOR_SHINING_SPRITES.map((sprite) => {
    const key = getShiningWarriorCollectionKeyForSprite(sprite);
    const isCollected = collectedAtByKey.has(key);

    return {
      warriorClass: sprite.warriorClass,
      gender: sprite.gender,
      picture: sprite.picture,
      race: sprite.race,
      collected: isCollected,
      collectedAt: isCollected ? (collectedAtByKey.get(key) ?? null) : null,
    };
  });

  return {
    collectedCount: entries.filter((entry) => entry.collected).length,
    totalCount: WARRIOR_SHINING_SPRITES.length,
    entries,
  };
}
