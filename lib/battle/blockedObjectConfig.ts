export const BLOCKED_OBJECT_SPRITE_SHEET_BASE_PATH =
  "/objects/SpriteSheets";

export const BLOCKED_OBJECT_KEYS = ["campfire", "rock2"] as const;

export type BlockedObjectKey = (typeof BLOCKED_OBJECT_KEYS)[number];

export interface BlockedObjectSpriteSheetConfig {
  type: "spritesheet";
  fileName: string;
  /** 1-based row in the spritesheet. */
  row: number;
  /** Frame count; also the sheet width in columns for single-row sheets. */
  frames: number;
  columns: number;
  sheetRows: number;
}

export interface BlockedObjectStaticConfig {
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
};

export function getBlockedObjectConfig(
  objectKey: BlockedObjectKey
): BlockedObjectConfig {
  return BLOCKED_OBJECTS[objectKey];
}

export function isBlockedObjectSpriteSheet(
  config: BlockedObjectConfig
): config is BlockedObjectSpriteSheetConfig {
  return config.type === "spritesheet";
}

export function getBlockedObjectSpriteSheetPath(fileName: string): string {
  return `${BLOCKED_OBJECT_SPRITE_SHEET_BASE_PATH}/${fileName}`;
}
