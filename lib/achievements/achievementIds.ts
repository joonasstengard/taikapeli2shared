export const ACHIEVEMENT_ID = {
  firstCampaignWin: 1,
  tenCampaignWins: 2,
  hundredCampaignWins: 3,
  fiveHundredCampaignWins: 4,
  maxThreeWarriorsCampaignWin: 5,
  maxTwoWarriorsCampaignWin: 6,
  maxOneWarriorCampaignWin: 7,
  peasantsOnlyCampaignWin: 8,
  undefeatedCampaignWin: 9,
  goldHoarderCampaignWin: 10,
  goldSaverCampaignWin: 11,
  holyOrderCampaignWin: 12,
  arcaneCircleCampaignWin: 13,
  diverseCompanyCampaignWin: 14,
  ismoCampaignWin: 15,
  arcaneMysteriesCampaignWin: 16,
} as const;

export type AchievementId =
  (typeof ACHIEVEMENT_ID)[keyof typeof ACHIEVEMENT_ID];
