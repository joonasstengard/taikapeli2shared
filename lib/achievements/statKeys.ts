export const STAT_KEY = {
  campaignsWon: "campaigns_won",
} as const;

export type StatKey = (typeof STAT_KEY)[keyof typeof STAT_KEY];
