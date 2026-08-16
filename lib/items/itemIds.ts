export const ITEM_ID = {
  wornBand: 1,
  bloodseal: 2,
  moonshardRing: 3,
  emberdelveSignet: 4,
  thalenEmeraldRing: 5,
  amberSignet: 6, 
  nightglassRing: 7,
  steelBand: 8,
  threeMarks: 9,
  ritualistsBracelet: 10,
  seresTear: 11,
  graveCharm: 12,
  woundBead: 13,
  palesilverBelt: 14,
  leatherBelt: 15,
  arkenfallCrystals: 16,
} as const;

export type ItemId = (typeof ITEM_ID)[keyof typeof ITEM_ID];
