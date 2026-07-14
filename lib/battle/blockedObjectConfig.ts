export const BLOCKED_OBJECT_SPRITE_SHEET_BASE_PATH =
  "/objects/SpriteSheets";

export const BLOCKED_OBJECT_KEYS = ["campfire", "deerHorn2", "deer6", "deerHorn6", "rock2"] as const;

export type BlockedObjectKey = (typeof BLOCKED_OBJECT_KEYS)[number];

/** Matches warrior ground shadow variants on the battle map. */
export type BlockedObjectGroundShadow = "default" | "wide";

interface BlockedObjectConfigBase {
  groundShadow?: BlockedObjectGroundShadow;
}

export interface BlockedObjectSpriteSheetConfig extends BlockedObjectConfigBase {
  type: "spritesheet";
  fileName: string;
  /** 1-based row in the spritesheet. */
  row: number;
  /** Frame count; also the sheet width in columns for single-row sheets. */
  frames: number;
  columns: number;
  sheetRows: number;
  /** Per-frame duration in ms; falls back to the battle map default when omitted. */
  frameMs?: number;
}

export interface BlockedObjectStaticConfig extends BlockedObjectConfigBase {
  type: "static";
  path: string;
}

export type BlockedObjectConfig =
  | BlockedObjectSpriteSheetConfig
  | BlockedObjectStaticConfig;

export const BLOCKED_OBJECTS: Record<BlockedObjectKey, BlockedObjectConfig> = {
  campfire: {
    type: "spritesheet",
    fileName: "Campfire.png",
    row: 1,
    frames: 6,
    columns: 6,
    sheetRows: 1,
  },
  rock2: {
    type: "static",
    path: "/objects/Rock2.png",
  },
  deerHorn2: {
    type: "spritesheet",
    fileName: "DeerHorn2.png",
    row: 5,
    frames: 6,
    columns: 6,
    sheetRows: 6,
    frameMs: 1000,
    groundShadow: "wide",
  },
  deer6: {
    type: "spritesheet",
    fileName: "Deer6.png",
    row: 2,
    frames: 6,
    columns: 6,
    sheetRows: 6,
    frameMs: 800,
    groundShadow: "wide",
  },
  deerHorn6: {
    type: "spritesheet",
    fileName: "DeerHorn6.png",
    row: 2,
    frames: 6,
    columns: 6,
    sheetRows: 6,
    frameMs: 800,
    groundShadow: "wide",
  },
};

export function getBlockedObjectConfig(
  objectKey: BlockedObjectKey
): BlockedObjectConfig {
  return BLOCKED_OBJECTS[objectKey];
}

export function getBlockedObjectGroundShadow(
  objectKey: BlockedObjectKey
): BlockedObjectGroundShadow | undefined {
  return BLOCKED_OBJECTS[objectKey].groundShadow;
}

export function isBlockedObjectSpriteSheet(
  config: BlockedObjectConfig
): config is BlockedObjectSpriteSheetConfig {
  return config.type === "spritesheet";
}

export function getBlockedObjectSpriteSheetPath(fileName: string): string {
  return `${BLOCKED_OBJECT_SPRITE_SHEET_BASE_PATH}/${fileName}`;
}
