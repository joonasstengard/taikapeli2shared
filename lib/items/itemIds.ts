export const ITEM_ID = {
  wornBand: 1,
  bloodseal: 2,
  moonshardRing: 3,
  emberdelveSignet: 4,
} as const;

export type ItemId = (typeof ITEM_ID)[keyof typeof ITEM_ID];
