import type { ObjectiveResult } from "./objectives";
import { getPressureModifier } from "./pressure";
import type { OpponentPressure } from "./pressure";
import type {
  Drill,
  MatchEvent,
  PhaseOutcome,
  Player,
  SessionStep,
  Tactic,
} from "./types";

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function ratePlayer(player: Player) {
  return clamp(
    (player.pace +
      player.power +
      player.handling +
      player.defence +
      player.stamina +
      player.confidence -
      player.fatigue * 0.7) /
      5.8,
  );
}

function getSelection(rating: number) {
  return rating >= 82
    ? "Starting XV"
    : rating >= 70
      ? "Matchday 23"
      : rating >= 58
        ? "Development Squad"
        : "Needs Minutes";
}

function getCoachRead(rating: number) {
  if (rating > 78)
    return "Green light for high-leverage minutes. Keep fatigue under control.";
  if (rating > 65)
    return "Useful squad option. Run one targeted drill before another phase.";
  return "Development load recommended. Recover before simulating more contact.";
}

function getSessionSteps(
  player: Player,
  rating: number,
  selection: string,
  phase: string,
  minute: number,
): SessionStep[] {
  return [
    {
      label: "Profile",
      value: `${player.role} / rating ${rating}`,
      active: true,
    },
    {
      label: "Prepare",
      value: player.fatigue > 55 ? "Recovery advised" : "Training available",
      active: player.fatigue <= 55,
    },
    { label: "Simulate", value: `${phase} at ${minute}'`, active: minute > 0 },
    { label: "Review", value: selection, active: rating >= 70 },
  ];
}

function applyDrill(player: Player, drill: Drill): Player {
  return {
    ...player,
    [drill.stat]: clamp(player[drill.stat] + drill.boost),
    fatigue: clamp(player.fatigue + drill.fatigue),
    confidence: clamp(player.confidence + 2),
    form: [
      ...player.form.slice(1),
      clamp(ratePlayer(player) + drill.boost - drill.fatigue / 3),
    ],
  };
}

function applyMatchEvent(player: Player, event: MatchEvent): Player {
  return {
    ...player,
    confidence: clamp(player.confidence + event.confidence),
    fatigue: clamp(player.fatigue + event.fatigue),
    form: [...player.form.slice(1), clamp(ratePlayer(player) + event.form)],
  };
}

function resolvePhase(
  player: Player,
  tactic: Tactic,
  momentum = 50,
  pressure?: OpponentPressure,
): PhaseOutcome {
  const primary = player[tactic.emphasis];
  const support = Math.round(
    (player.confidence + player.stamina + player.handling) / 3,
  );
  const fatigueDrag = player.fatigue * 0.45;
  const pressureModifier = pressure
    ? getPressureModifier(tactic, pressure, momentum)
    : undefined;
  const score = clamp(
    primary * 0.58 +
      support * 0.34 -
      fatigueDrag -
      tactic.risk * 0.22 +
      18 +
      (pressureModifier?.scoreDelta ?? 0),
  );
  const success = score >= 68;
  const gain = clamp(
    (success ? Math.round(8 + score / 6) : Math.round(Math.max(0, score / 9))) +
      (pressureModifier?.gainDelta ?? 0),
  );

  return {
    title: success ? `${tactic.phase} gain` : `${tactic.phase} contained`,
    detail: success
      ? `${player.name} executes ${tactic.name.toLowerCase()} and wins ${gain} metres.${pressureModifier ? ` ${pressureModifier.read}` : ""}`
      : `${player.name} tries ${tactic.name.toLowerCase()}, but defensive pressure slows the phase.${pressureModifier ? ` ${pressureModifier.read}` : ""}`,
    confidence: (success ? 6 : -5) + (pressureModifier?.confidenceDelta ?? 0),
    fatigue: Math.max(
      0,
      tactic.fatigue + (pressureModifier?.fatigueDelta ?? 0),
    ),
    form: success ? 5 : -4,
    gain,
  };
}

function applyPhaseOutcome(player: Player, outcome: PhaseOutcome): Player {
  return {
    ...player,
    confidence: clamp(player.confidence + outcome.confidence),
    fatigue: clamp(player.fatigue + outcome.fatigue),
    form: [...player.form.slice(1), clamp(ratePlayer(player) + outcome.form)],
  };
}

function applyObjectiveResult(player: Player, result: ObjectiveResult): Player {
  return {
    ...player,
    confidence: clamp(player.confidence + result.confidenceDelta),
    fatigue: clamp(player.fatigue + result.fatigueDelta),
    form: [
      ...player.form.slice(1),
      clamp(ratePlayer(player) + (result.success ? 3 : -2)),
    ],
  };
}

function recoverPlayer(player: Player): Player {
  return {
    ...player,
    fatigue: clamp(player.fatigue - 18),
    confidence: clamp(player.confidence + 3),
    form: [...player.form.slice(1), clamp(ratePlayer(player) + 4)],
  };
}

export {
  applyDrill,
  applyMatchEvent,
  applyObjectiveResult,
  applyPhaseOutcome,
  clamp,
  getCoachRead,
  getSelection,
  getSessionSteps,
  ratePlayer,
  recoverPlayer,
  resolvePhase,
};
