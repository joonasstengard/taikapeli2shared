/** Extra starting gold granted by the War Chest perk. */
export const WAR_CHEST_STARTING_GOLD_BONUS = 20;

/** Extra gold granted each week by the Heregeld perk. */
export const HEREGELD_WEEKLY_GOLD_BONUS = 5;

/** Weekly market spell options granted by the Expanded Grimoire perk. */
export const EXPANDED_GRIMOIRE_MARKET_SPELLS_PER_WEEK = 8;

/** Market spell price multiplier granted by the Expanded Grimoire perk (0.8 = 20% less). */
export const EXPANDED_GRIMOIRE_MARKET_SPELL_PRICE_MULTIPLIER = 0.8;

/** Experience multiplier for the Runic Wisdom perk (1.1 = +10%). */
export const RUNIC_WISDOM_XP_MULTIPLIER = 1.1;

/** Nation health loss reduction from the Resilient Nation perk. */
export const RESILIENT_NATION_HEALTH_LOSS_REDUCTION = 10;

/** Faith bonus granted to warriors when recruited with Light In The Darkness. */
export const LIGHT_IN_THE_DARKNESS_RECRUIT_FAITH_BONUS = 3;

/** Speed bonus granted to warriors when recruited with Umbral Grace. */
export const UMBRAL_GRACE_RECRUIT_SPEED_BONUS = 3;

/** Training cost multiplier for Durn Kharad Drill (0.8 = 20% less). */
export const DURN_KHARAD_DRILL_TRAINING_COST_MULTIPLIER = 0.8;

/**
 * Required-level offset for Ability Mastery (-1 = unlock one level earlier).
 * Applied to warrior skill/spell grants at recruitment.
 */
export const ABILITY_MASTERY_REQUIRED_LEVEL_OFFSET = -1;

/** Extra Peasants granted at campaign start by Pressed Into Service. */
export const PRESSED_INTO_SERVICE_STARTING_PEASANT_COUNT = 1;

/** Maximum recruit market price when the army has Muster Edict. */
export const MUSTER_EDICT_MAX_RECRUIT_PRICE = 20;

/**
 * Release-gold multiplier for Grave Tax (1 = full recruit value).
 * Default without this perk is half recruit value.
 */
export const GRAVE_TAX_RELEASE_GOLD_MULTIPLIER = 1;

/** How many perks are offered to the player at campaign start. */
export const CAMPAIGN_PERK_OPTIONS_COUNT = 3;

/** Nation health loss cannot be reduced below this value by perks. */
export const MIN_NATION_HEALTH_LOSS_AFTER_PERK = 1;
