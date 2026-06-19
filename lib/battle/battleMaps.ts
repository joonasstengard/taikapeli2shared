import {
  BATTLE_MAP_DEFAULT_HEIGHT,
  BATTLE_MAP_DEFAULT_WIDTH,
} from "./battleMapSizing";

export const BATTLE_MAP_KEYS = [
  "stonegarden1",
  "stonegarden2",
  "stonegarden3",
  "stonegarden4",
  "fantasyforest1",
  "fantasyforest2",
  "fantasyGrasslands",
] as const;

export type BattleMapKey = (typeof BATTLE_MAP_KEYS)[number];

export const DEFAULT_BATTLE_MAP_KEY: BattleMapKey = "fantasyforest1";

export interface BattleMapTemplate {
  blockedTiles?: string[];
}

export interface BattleMapConfig extends BattleMapTemplate {
  width: number;
  height: number;
}

export const BATTLE_MAPS: Record<BattleMapKey, BattleMapTemplate> = {
  stonegarden1: {
    blockedTiles: ["A4", "D4"],
  },
  stonegarden2: {},
  stonegarden3: {},
  stonegarden4: {blockedTiles: ["B1"]},
  fantasyforest1: {
    blockedTiles: ["A4", "E4", "A2", "E2"],
  },
  fantasyforest2: {},
  fantasyGrasslands: {
    blockedTiles: ["C3", "D3"],
  },
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
