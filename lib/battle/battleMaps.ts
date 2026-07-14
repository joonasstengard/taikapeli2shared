import {
  BATTLE_MAP_DEFAULT_HEIGHT,
  BATTLE_MAP_DEFAULT_WIDTH,
} from "./battleMapSizing";

export const BATTLE_MAP_KEYS = [
  "stoneGarden",
  "darkSnow1",
  "duskWoods1",
  "duskWoods2",
  "fantasyForest1",
  "fantasyForest2",
  "fantasyGrasslands",
  "snowLand1",
  "snowLand2",
  "snowValley",
  "decayedTundra",
  "deadCanyon"
] as const;

export type BattleMapKey = (typeof BATTLE_MAP_KEYS)[number];

export const DEFAULT_BATTLE_MAP_KEY: BattleMapKey = "fantasyForest1";

export interface BattleMapTemplate {
  blockedTiles?: string[];
}

export interface BattleMapConfig extends BattleMapTemplate {
  width: number;
  height: number;
}

export const BATTLE_MAPS: Record<BattleMapKey, BattleMapTemplate> = {
  darkSnow1: {blockedTiles: ["A2","E3"]},
  deadCanyon: {
    blockedTiles: ["A2", "E3"],
  },
  decayedTundra: {
    blockedTiles: ["A2", "E3", "C2", "A5"],
  },
  duskWoods1: {blockedTiles: ["A3", "A1", "E2", "A4", "E4", "E5"]},
  duskWoods2: {blockedTiles: ["A1", "A4", "E1"]},
  fantasyForest1: {
    blockedTiles: ["E4", "A2", "E2", "A3", "E3"],
  },
  fantasyForest2: {blockedTiles: ["A1", "E2", "E5"]},
  fantasyGrasslands: {
    blockedTiles: ["A2", "E1", "D3", "E3"],
  },
  snowLand1: {
    blockedTiles: ["A4", "A3", "E1", "E2"],
  },
  snowLand2: {
    blockedTiles: ["A1", "E2", "A3", "E4", "A5"],
  },
  snowValley: {
    blockedTiles: ["B3", "E1", "D3"],
  },
  stoneGarden: {},
};

export interface BattleMapSelection {
  battleMapKey: string;
  battleMapWidth?: number | null;
  battleMapHeight?: number | null;
}

function resolveBattleMapDimensions(
  width?: number | null,
  height?: number | null
): Pick<BattleMapConfig, "width" | "height"> {
  return {
    width: width ?? BATTLE_MAP_DEFAULT_WIDTH,
    height: height ?? BATTLE_MAP_DEFAULT_HEIGHT,
  };
}

function filterBlockedTilesForMap(
  blockedTiles: string[] | undefined,
  dimensions: Pick<BattleMapConfig, "width" | "height">
): string[] | undefined {
  if (!blockedTiles?.length) {
    return undefined;
  }

  const visibleBlockedTiles = blockedTiles.filter((tileId) =>
    isTileWithinBattleMap(tileId, dimensions)
  );

  return visibleBlockedTiles.length > 0 ? visibleBlockedTiles : undefined;
}

export function getBattleMapConfig(
  battleMapKey: string | null | undefined,
  dimensions?: Pick<BattleMapConfig, "width" | "height"> | null
): BattleMapConfig;
export function getBattleMapConfig(
  selection: BattleMapSelection | null | undefined
): BattleMapConfig;
export function getBattleMapConfig(
  battleMapKeyOrSelection:
    | string
    | BattleMapSelection
    | null
    | undefined,
  dimensions?: Pick<BattleMapConfig, "width" | "height"> | null
): BattleMapConfig {
  const battleMapKey =
    typeof battleMapKeyOrSelection === "object" &&
    battleMapKeyOrSelection !== null
      ? battleMapKeyOrSelection.battleMapKey
      : battleMapKeyOrSelection;

  const resolvedDimensions =
    typeof battleMapKeyOrSelection === "object" &&
    battleMapKeyOrSelection !== null
      ? resolveBattleMapDimensions(
          battleMapKeyOrSelection.battleMapWidth,
          battleMapKeyOrSelection.battleMapHeight
        )
      : resolveBattleMapDimensions(dimensions?.width, dimensions?.height);

  const key = (battleMapKey ?? DEFAULT_BATTLE_MAP_KEY) as BattleMapKey;
  const template = BATTLE_MAPS[key] ?? BATTLE_MAPS[DEFAULT_BATTLE_MAP_KEY];

  return {
    ...resolvedDimensions,
    blockedTiles: filterBlockedTilesForMap(
      template.blockedTiles,
      resolvedDimensions
    ),
  };
}

export function isBlockedBattleTile(
  tileId: string,
  battleMap: BattleMapConfig
): boolean {
  return (battleMap.blockedTiles ?? []).some(
    (blockedTile) => blockedTile.toLowerCase() === tileId.toLowerCase()
  );
}

export function isTileWithinBattleMap(
  tileId: string,
  battleMap: Pick<BattleMapConfig, "width" | "height">
): boolean {
  const columnIndex = tileId.charCodeAt(0) - "A".charCodeAt(0);
  const row = parseInt(tileId.slice(1), 10);

  return (
    columnIndex >= 0 &&
    columnIndex < battleMap.width &&
    Number.isInteger(row) &&
    row >= 1 &&
    row <= battleMap.height
  );
}
