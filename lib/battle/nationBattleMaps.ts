import type { NationName } from "../../data/nations";
import {
  DEFAULT_BATTLE_MAP_KEY,
  getBattleMapConfig,
  type BattleMapConfig,
  type BattleMapKey,
} from "./battleMaps";

/**
 * Nations not listed here use the default battle map.
 * Add a new map to battleMaps.ts, then assign nations here.
 */
export const NATION_BATTLE_MAP_KEY_OVERRIDES: Partial<
  Record<NationName, BattleMapKey>
> = {
  Kalmalampi: "stonegarden1",
  Hiidenlahti: "fantasyGrasslands",
  Vainola: "fantasyGrasslands",
  Viranta: "stonegarden2",
  Tapiola: "fantasyforest2",
  Pohjamaa: "fantasyforest1",
  Aarnimetsä: "fantasyforest1",
  Hopeavesi: "stonegarden3",
};

export function getBattleMapKeyForNation(nation: string): BattleMapKey {
  return (
    NATION_BATTLE_MAP_KEY_OVERRIDES[nation as NationName] ??
    DEFAULT_BATTLE_MAP_KEY
  );
}

export function getBattleMapForNation(nation: string): BattleMapConfig {
  return getBattleMapConfig(getBattleMapKeyForNation(nation));
}
