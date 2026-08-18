/** Stored on player armies so `armies.nation` can stay NOT NULL. Never shown. */
export const PLAYER_ARMY_NATION_PLACEHOLDER = "Player";

export function armyDisplayName(
  army: { isPlayerArmy?: boolean | null; nation: string },
  username: string
): string {
  return army.isPlayerArmy === true ? username : army.nation;
}

export function withArmyDisplayName<
  T extends { isPlayerArmy?: boolean | null; nation: string },
>(army: T, username: string): T {
  return { ...army, nation: armyDisplayName(army, username) };
}
