import type { BattleSummary } from "../battle/battleSummary";
import type { BattleVisualEvent } from "../battle/battleVisualEvents";
import type { Warrior } from "../warriors/warriorTypes";

export type MultiplayerMatchMode = "quick";
export type MultiplayerMatchStatus =
  | "starting"
  | "active"
  | "finished"
  | "cancelled";
export type MultiplayerSide = "A" | "B";
export type MultiplayerFinishReason =
  | "elimination"
  | "turn_timeout"
  | "disconnect"
  | "turn_cap"
  | "server_restart"
  | "cancelled";

export type MultiplayerAction =
  | {
      type: "move" | "attack";
      actorWarriorId: number;
      targetTileId: string;
    }
  | {
      type: "spell" | "skill";
      actorWarriorId: number;
      targetTileId: string;
      abilityId: number;
    }
  | {
      type: "wait";
      actorWarriorId: number;
    };

export interface MultiplayerActionCommand {
  matchId: string;
  actionId: string;
  expectedVersion: number;
  action: MultiplayerAction;
}

export interface MultiplayerBattleView {
  id: number;
  round: number;
  turnsTaken: number;
  isCurrentlyHappening: boolean;
  winningArmyId: number | null;
  commentaryLastLine: string;
  battleMapKey: string;
  battleMapWidth: number;
  battleMapHeight: number;
}

export interface MultiplayerArmyView {
  armyId: number;
  userId: number;
  username: string;
  nation: string;
  side: MultiplayerSide;
  warriors: Warrior[];
  connected: boolean;
}

export interface MultiplayerMatchSnapshot {
  matchId: string;
  mode: MultiplayerMatchMode;
  status: MultiplayerMatchStatus;
  version: number;
  serverNow: string;
  turnDeadline: string | null;
  activeWarriorId: number | null;
  activeUserId: number | null;
  myUserId: number;
  myArmyId: number;
  opponentArmyId: number;
  winnerUserId: number | null;
  finishReason: MultiplayerFinishReason | null;
  battle: MultiplayerBattleView;
  armies: [MultiplayerArmyView, MultiplayerArmyView];
  visualEvents: BattleVisualEvent[];
  battleSummary: BattleSummary | null;
}

export type MultiplayerErrorCode =
  | "UNAUTHORIZED"
  | "INVALID_PAYLOAD"
  | "ALREADY_QUEUED"
  | "ALREADY_IN_MATCH"
  | "MATCH_NOT_FOUND"
  | "NOT_A_PARTICIPANT"
  | "MATCH_NOT_ACTIVE"
  | "NOT_YOUR_TURN"
  | "TURN_EXPIRED"
  | "STALE_VERSION"
  | "DUPLICATE_ACTION"
  | "ILLEGAL_ACTION"
  | "INTERNAL_ERROR";

export type MultiplayerAck<T = undefined> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code: MultiplayerErrorCode;
        message: string;
        snapshot?: MultiplayerMatchSnapshot;
      };
    };

export interface QueueStatus {
  status: "idle" | "searching" | "matched";
  enqueuedAt: string | null;
  matchId: string | null;
}

export interface ClientToServerEvents {
  "queue:join": (
    payload: Record<string, never>,
    acknowledge: (result: MultiplayerAck<QueueStatus>) => void
  ) => void;
  "queue:leave": (
    payload: Record<string, never>,
    acknowledge: (result: MultiplayerAck<QueueStatus>) => void
  ) => void;
  "queue:status": (
    payload: Record<string, never>,
    acknowledge: (result: MultiplayerAck<QueueStatus>) => void
  ) => void;
  "match:join": (
    payload: { matchId: string },
    acknowledge: (result: MultiplayerAck<MultiplayerMatchSnapshot>) => void
  ) => void;
  "match:action": (
    payload: MultiplayerActionCommand,
    acknowledge: (result: MultiplayerAck<MultiplayerMatchSnapshot>) => void
  ) => void;
}

export interface ServerToClientEvents {
  "queue:status": (status: QueueStatus) => void;
  "match:found": (payload: { matchId: string }) => void;
  "match:snapshot": (snapshot: MultiplayerMatchSnapshot) => void;
  "match:updated": (snapshot: MultiplayerMatchSnapshot) => void;
  "match:finished": (snapshot: MultiplayerMatchSnapshot) => void;
  "match:presence": (payload: {
    matchId: string;
    userId: number;
    connected: boolean;
    disconnectDeadline: string | null;
  }) => void;
}
