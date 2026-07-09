export type BattleVisualEvent =
  | {
      type: "move";
      warriorId: number;
      fromTile: string;
      toTile: string;
    }
  | {
      type: "meleeAttack";
      warriorId: number;
      targetTile: string;
    }
  | {
      type: "castSpell";
      warriorId: number;
      spellId: number;
      effectTiles: string[];
    }
  | {
      type: "useSkill";
      warriorId: number;
      skillId: number;
      effectTiles: string[];
      casterAttackPose: boolean;
      targetSlashFx: boolean;
    }
  | {
      type: "bladeDance";
      warriorId: number;
      skillId: number;
      originTile: string;
      hitTiles: string[];
    }
  | {
      type: "wait";
      warriorId: number;
    };

export interface BattleActionOutcome {
  commentaryLine: string;
  visualEvents: BattleVisualEvent[];
}

export function moveEvent(
  warriorId: number,
  fromTile: string,
  toTile: string
): BattleVisualEvent {
  return { type: "move", warriorId, fromTile, toTile };
}

export function meleeAttackEvent(
  warriorId: number,
  targetTile: string
): BattleVisualEvent {
  return { type: "meleeAttack", warriorId, targetTile };
}

export function castSpellEvent(
  warriorId: number,
  spellId: number,
  effectTiles: string[]
): BattleVisualEvent {
  return { type: "castSpell", warriorId, spellId, effectTiles };
}

export function useSkillEvent(
  warriorId: number,
  skillId: number,
  effectTiles: string[],
  casterAttackPose: boolean,
  targetSlashFx: boolean
): BattleVisualEvent {
  return {
    type: "useSkill",
    warriorId,
    skillId,
    effectTiles,
    casterAttackPose,
    targetSlashFx,
  };
}

export function bladeDanceEvent(
  warriorId: number,
  skillId: number,
  originTile: string,
  hitTiles: string[]
): BattleVisualEvent {
  return {
    type: "bladeDance",
    warriorId,
    skillId,
    originTile,
    hitTiles,
  };
}

export function waitEvent(warriorId: number): BattleVisualEvent {
  return { type: "wait", warriorId };
}

export function prependMoveEventIfNeeded(
  events: BattleVisualEvent[],
  warriorId: number,
  fromTile: string,
  toTile: string | null | undefined
): BattleVisualEvent[] {
  if (toTile && toTile.toLowerCase() !== fromTile.toLowerCase()) {
    return [moveEvent(warriorId, fromTile, toTile), ...events];
  }

  return events;
}

export function appendLeapMoveEvent(
  events: BattleVisualEvent[],
  warriorId: number,
  casterTile: string,
  leapDestination: string | null | undefined
): BattleVisualEvent[] {
  return prependMoveEventIfNeeded(events, warriorId, casterTile, leapDestination);
}

export function uniqueTiles(tiles: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tile of tiles) {
    if (!tile) {
      continue;
    }

    const normalized = tile.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(tile);
  }

  return result;
}
