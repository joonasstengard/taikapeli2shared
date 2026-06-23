import { SPELL_ID } from "./spellIds";

export interface SpellSpriteSheetConfig {
  fileName: string;
  /** 1-based row in a 9-row spritesheet. */
  row: number;
  /** Frame count for this spell; also the sheet width in columns. */
  frames: number;
}

export const SPELL_SPRITE_ROWS = 9;
export const SPELL_SPRITE_FRAME_SIZE = 64;
export const SPELL_SPRITE_SHEET_BASE_PATH = "/effects/spells/SpriteSheets";

export const SPELL_SPRITE_BY_ID: Record<number, SpellSpriteSheetConfig> = {
  [SPELL_ID.flamewheel]: { fileName: "664.png", row: 1, frames: 16 },
  [SPELL_ID.hellflame]: { fileName: "528.png", row: 1, frames: 13 },
  [SPELL_ID.healingPrayer]: { fileName: "24.png", row: 5, frames: 14 },
  [SPELL_ID.frostball]: { fileName: "336.png", row: 3, frames: 8 },
  [SPELL_ID.icebolt]: { fileName: "77.png", row: 3, frames: 12 },
  [SPELL_ID.thunderball]: { fileName: "506.png", row: 6, frames: 11 },
  [SPELL_ID.thunder]: { fileName: "241.png", row: 6, frames: 8 },
  [SPELL_ID.desperateRune]: { fileName: "710.png", row: 2, frames: 18 },
  [SPELL_ID.holySmite]: { fileName: "577.png", row: 5, frames: 14 },
  [SPELL_ID.shadowBlink]: { fileName: "722.png", row: 2, frames: 23 },
  [SPELL_ID.teleport]: { fileName: "713.png", row: 2, frames: 23 },
  [SPELL_ID.freezingWhisper]: { fileName: "654.png", row: 3, frames: 18 },
  [SPELL_ID.protect]: { fileName: "655.png", row: 5, frames: 15 },
  [SPELL_ID.rottingTouch]: { fileName: "633.png", row: 8, frames: 15 },
  [SPELL_ID.bloodCurse]: { fileName: "508.png", row: 8, frames: 13 },
  [SPELL_ID.lifeDrain]: { fileName: "625.png", row: 8, frames: 15 },
  [SPELL_ID.lifeDevour]: { fileName: "625.png", row: 8, frames: 15 },
  [SPELL_ID.massHealing]: { fileName: "439.png", row: 5, frames: 10 },
  [SPELL_ID.beaconOfLight]: { fileName: "64.png", row: 5, frames: 8 },
  [SPELL_ID.deathRitual]: { fileName: "615.png", row: 8, frames: 14 },
  [SPELL_ID.consecrate]: { fileName: "663.png", row: 5, frames: 16 },
  [SPELL_ID.penance]: { fileName: "316.png", row: 5, frames: 8 },
  [SPELL_ID.moonBlast]: { fileName: "388.png", row: 6, frames: 9 },
};

export function getSpellSpriteSheetPath(fileName: string): string {
  return `${SPELL_SPRITE_SHEET_BASE_PATH}/${fileName}`;
}

export function getSpellSpriteConfig(
  spellId: number
): SpellSpriteSheetConfig | undefined {
  return SPELL_SPRITE_BY_ID[spellId];
}

export function getSpellSpriteDurationMs(
  spellId: number,
  frameMs: number
): number {
  const config = getSpellSpriteConfig(spellId);
  if (!config) {
    return 0;
  }

  return config.frames * frameMs;
}

export function spellSpriteFields(spellId: number): {
  SpriteSheetFileName: string;
  SpriteSheetRow: number;
  SpriteSheetFrames: number;
} {
  const config = getSpellSpriteConfig(spellId);
  if (!config) {
    throw new Error(`Missing spell sprite config for spell id ${spellId}`);
  }

  return {
    SpriteSheetFileName: config.fileName,
    SpriteSheetRow: config.row,
    SpriteSheetFrames: config.frames,
  };
}
