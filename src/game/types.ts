type PlayerCondition = "fit" | "knock" | "strained";

type PlayerTraitId =
  | "explosive-runner"
  | "collision-winner"
  | "composed-kicker"
  | "defensive-leader"
  | "high-motor"
  | "big-match-temperament";

type Player = {
  id: string;
  name: string;
  role: string;
  unit: "forwards" | "backs";
  pace: number;
  power: number;
  handling: number;
  defence: number;
  stamina: number;
  confidence: number;
  fatigue: number;
  form: number[];
  traits: PlayerTraitId[];
  condition: PlayerCondition;
};

type EventLog = {
  minute: number;
  title: string;
  detail: string;
  impact: string;
};

type Drill = {
  label: string;
  stat: keyof Pick<
    Player,
    "pace" | "power" | "handling" | "defence" | "stamina"
  >;
  boost: number;
  fatigue: number;
  note: string;
};

type MatchEvent = {
  title: string;
  detail: string;
  confidence: number;
  fatigue: number;
  form: number;
};

type Tactic = {
  id: string;
  name: string;
  phase: string;
  emphasis: keyof Pick<
    Player,
    "pace" | "power" | "handling" | "defence" | "stamina"
  >;
  risk: number;
  fatigue: number;
  detail: string;
};

type PhaseOutcome = {
  title: string;
  detail: string;
  confidence: number;
  fatigue: number;
  form: number;
  gain: number;
};

type TrainingFocus = {
  id: string;
  name: string;
  description: string;
  effects: Partial<
    Record<
      keyof Pick<
        Player,
        | "pace"
        | "power"
        | "handling"
        | "defence"
        | "stamina"
        | "confidence"
        | "fatigue"
      >,
      number
    >
  >;
};

type SessionStep = {
  label: string;
  value: string;
  active: boolean;
};

export type {
  Drill,
  EventLog,
  MatchEvent,
  PhaseOutcome,
  Player,
  PlayerCondition,
  PlayerTraitId,
  SessionStep,
  Tactic,
  TrainingFocus,
};
