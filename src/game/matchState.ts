import type { ObjectiveResult } from './objectives';
import type { OpponentPressure } from './pressure';
import type { PhaseOutcome } from './types';

type MatchState = {
  teamScore: number;
  opponentScore: number;
  territory: number;
  possession: number;
  scoringChance: number;
};

type MatchStateResult = {
  matchState: MatchState;
  title: string;
  detail: string;
  impact: string;
};

const initialMatchState: MatchState = {
  teamScore: 0,
  opponentScore: 0,
  territory: 50,
  possession: 50,
  scoringChance: 12
};

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function applyMatchStateOutcome(current: MatchState, outcome: PhaseOutcome, objectiveResult: ObjectiveResult, pressure: OpponentPressure, momentum: number): MatchStateResult {
  const territoryGain = Math.round(outcome.gain * 0.9 + (objectiveResult.success ? 5 : -4));
  const possessionDelta = objectiveResult.success ? 5 : -7;
  const chanceDelta = Math.round(outcome.gain * 1.2 + objectiveResult.momentumDelta * 0.7 + (momentum - 50) / 7);
  const pressureBonus = pressure.id === 'red-zone-squeeze' ? 7 : pressure.id === 'passive-line' ? 3 : 0;

  let next: MatchState = {
    ...current,
    territory: clamp(current.territory + territoryGain),
    possession: clamp(current.possession + possessionDelta),
    scoringChance: clamp(current.scoringChance + chanceDelta + pressureBonus)
  };

  let title = 'Territory shift';
  let detail = objectiveResult.success
    ? 'The attack stacks pressure and moves into a better scoring position.'
    : 'The attack loses shape and gives the opposition a chance to reset.';
  let impact = `Territory ${next.territory}%, chance ${next.scoringChance}%`;

  if (next.scoringChance >= 95) {
    next = {
      ...next,
      teamScore: next.teamScore + 7,
      territory: 50,
      possession: 50,
      scoringChance: 10
    };
    title = 'Converted try';
    detail = 'Sustained pressure turns into seven points.';
    impact = `+7 team score, ${next.teamScore}-${next.opponentScore}`;
  } else if (next.scoringChance >= 80) {
    next = {
      ...next,
      teamScore: next.teamScore + 5,
      territory: 48,
      possession: 52,
      scoringChance: 18
    };
    title = 'Try scored';
    detail = 'The attack finds the line but misses the conversion.';
    impact = `+5 team score, ${next.teamScore}-${next.opponentScore}`;
  } else if (next.scoringChance >= 65 && objectiveResult.success) {
    next = {
      ...next,
      teamScore: next.teamScore + 3,
      territory: 45,
      possession: 54,
      scoringChance: 24
    };
    title = 'Penalty goal';
    detail = 'Pressure earns a kickable penalty and the points are taken.';
    impact = `+3 team score, ${next.teamScore}-${next.opponentScore}`;
  } else if (!objectiveResult.success && momentum < 42) {
    const opponentPoints = pressure.id === 'red-zone-squeeze' ? 7 : 3;
    next = {
      ...next,
      opponentScore: next.opponentScore + opponentPoints,
      territory: 52,
      possession: 48,
      scoringChance: Math.max(8, next.scoringChance - 18)
    };
    title = opponentPoints === 7 ? 'Opposition try' : 'Opposition penalty';
    detail = 'Low momentum and a missed objective hand the opposition points.';
    impact = `+${opponentPoints} opposition, ${next.teamScore}-${next.opponentScore}`;
  }

  return { matchState: next, title, detail, impact };
}

function getMatchResult(matchState: MatchState) {
  if (matchState.teamScore > matchState.opponentScore) return 'Winning';
  if (matchState.teamScore < matchState.opponentScore) return 'Chasing';
  return 'Level';
}

export { applyMatchStateOutcome, getMatchResult, initialMatchState };
export type { MatchState, MatchStateResult };
