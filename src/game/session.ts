import type { PhaseObjective } from "./objectives";
import type { MatchState } from "./matchState";
import type { OpponentPressure } from "./pressure";
import type { EventLog, Player } from "./types";

type AppScreen = "home" | "mode" | "brief" | "simulation" | "debrief";

type SessionSnapshot = {
  screen: AppScreen;
  player: Player;
  logs: EventLog[];
  minute: number;
  phase: string;
  selectedPlayerId: string;
  selectedTacticId: string;
  selectedFocusId: string;
  week: number;
  momentum: number;
  objective: PhaseObjective;
  pressure: OpponentPressure;
  matchState: MatchState;
  savedAt: string;
};

export type { AppScreen, SessionSnapshot };
