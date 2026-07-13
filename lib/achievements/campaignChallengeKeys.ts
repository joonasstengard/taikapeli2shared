export const CAMPAIGN_CHALLENGE_KEY = {
  peasantsOnlyRecruitment: "peasants_only_recruitment",
  maxThreeRecruitments: "max_three_recruitments",
  maxTwoRecruitments: "max_two_recruitments",
  maxOneRecruitment: "max_one_recruitment",
  holyOrderRecruitment: "holy_order_recruitment",
  arcaneCircleRecruitment: "arcane_circle_recruitment",
  humanOnlyRecruitment: "human_only_recruitment",
  elfOnlyRecruitment: "elf_only_recruitment",
  dwarfOnlyRecruitment: "dwarf_only_recruitment",
  orcOnlyRecruitment: "orc_only_recruitment",
} as const;

export type CampaignChallengeKey =
  (typeof CAMPAIGN_CHALLENGE_KEY)[keyof typeof CAMPAIGN_CHALLENGE_KEY];
