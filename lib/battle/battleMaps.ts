export const BATTLE_MAP_KEYS = ["stonegarden1",
  "stonegarden2",
  "stonegarden3",
  "fantasyforest1",
  "fantasyforest2",
  "fantasyGrasslands",
] as const;

export type BattleMapKey = (typeof BATTLE_MAP_KEYS)[number];

export const DEFAULT_BATTLE_MAP_KEY: BattleMapKey = "fantasyforest1";

export interface BattleMapConfig {
  width: number;
  height: number;
  blockedTiles?: string[];
}

export const BATTLE_MAPS: Record<BattleMapKey, BattleMapConfig> = {
  stonegarden1: {
    width: 6,
    height: 5,
    blockedTiles: ["A4", "D4"],
  },
  stonegarden2: {
    width: 6,
    height: 5,
  },
  stonegarden3: {
    width: 6,
    height: 5
  },
  fantasyforest1: {
    width: 6,
    height: 5,
    blockedTiles: ["A4", "E4", "F4", "A2", "E2", "F2"],
  },
  fantasyforest2: {
    width: 6,
    height: 5,
  },  
  fantasyGrasslands: {
    width: 6,
    height: 5,
    blockedTiles: ["C3", "D3"],
  }
};

export function getBattleMapConfig(
  battleMapKey: string | null | undefined
): BattleMapConfig {
  const key = battleMapKey as BattleMapKey;
  return BATTLE_MAPS[key] ?? BATTLE_MAPS[DEFAULT_BATTLE_MAP_KEY];
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
  battleMap: BattleMapConfig
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
