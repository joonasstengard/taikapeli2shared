export const CAMPAIGN_PERK_ID = {
  warChest: "war_chest",
  runicWisdom: "runic_wisdom",
  resilientNation: "resilient_nation",
  lightInTheDarkness: "light_in_the_darkness",
  umbralGrace: "umbral_grace",
  heregeld: "heregeld",
  expandedGrimoire: "expanded_grimoire",
  durnKharadDrill: "durn_kharad_drill",
  abilityMastery: "ability_mastery",
  pressedIntoService: "pressed_into_service",
} as const;

export type CampaignPerkId =
  (typeof CAMPAIGN_PERK_ID)[keyof typeof CAMPAIGN_PERK_ID];

export const ALL_CAMPAIGN_PERK_IDS: readonly CampaignPerkId[] = Object.values(
  CAMPAIGN_PERK_ID
);

export function isCampaignPerkId(value: string): value is CampaignPerkId {
  return (ALL_CAMPAIGN_PERK_IDS as readonly string[]).includes(value);
}
