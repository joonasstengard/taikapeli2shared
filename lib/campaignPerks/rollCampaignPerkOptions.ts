import {
  ALL_CAMPAIGN_PERK_IDS,
  type CampaignPerkId,
} from "./campaignPerkIds";
import { CAMPAIGN_PERK_OPTIONS_COUNT } from "./campaignPerkConstants";

/** Fisher–Yates partial shuffle. Pass a custom `random` for deterministic tests. */
export function rollCampaignPerkOptions(
  count: number = CAMPAIGN_PERK_OPTIONS_COUNT,
  random: () => number = Math.random
): CampaignPerkId[] {
  const pool = [...ALL_CAMPAIGN_PERK_IDS];
  const pickCount = Math.min(count, pool.length);

  for (let i = 0; i < pickCount; i++) {
    const j = i + Math.floor(random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, pickCount);
}

export function rollRandomCampaignPerk(
  random: () => number = Math.random
): CampaignPerkId {
  const index = Math.floor(random() * ALL_CAMPAIGN_PERK_IDS.length);
  return ALL_CAMPAIGN_PERK_IDS[index];
}
