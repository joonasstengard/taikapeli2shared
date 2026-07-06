export const ACHIEVEMENT_ID = {
  firstCampaignWin: 1,
  tenCampaignWins: 2,
  hundredCampaignWins: 3,
  fiveHundredCampaignWins: 4,
  maxThreeWarriorsCampaignWin: 5,
  maxTwoWarriorsCampaignWin: 6,
  maxOneWarriorCampaignWin: 7,
  peasantsOnlyCampaignWin: 8,
} as const;

export type AchievementId =
  (typeof ACHIEVEMENT_ID)[keyof typeof ACHIEVEMENT_ID];
