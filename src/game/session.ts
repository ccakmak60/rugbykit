import type { EventLog, Player } from './types';

type AppScreen = 'home' | 'mode' | 'brief' | 'simulation' | 'debrief';

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
  savedAt: string;
};

export type { AppScreen, SessionSnapshot };
