import type { PhaseOutcome, Player, Tactic } from './types';

type ObjectiveKind = 'gainline' | 'confidence' | 'control-fatigue' | 'tactical-execution';

type PhaseObjective = {
  id: string;
  title: string;
  description: string;
  kind: ObjectiveKind;
  target: number;
  rewardConfidence: number;
  rewardMomentum: number;
  failureFatigue: number;
};

type ObjectiveResult = {
  success: boolean;
  title: string;
  detail: string;
  impact: string;
  confidenceDelta: number;
  fatigueDelta: number;
  momentumDelta: number;
};

function getPhaseObjective(player: Player, tactic: Tactic, minute: number): PhaseObjective {
  if (player.fatigue >= 68) {
    return {
      id: `control-fatigue-${minute}-${tactic.id}`,
      title: 'Manage the load',
      description: `Run ${tactic.name.toLowerCase()} without adding heavy fatigue. Keep phase fatigue to ${tactic.fatigue} or less.`,
      kind: 'control-fatigue',
      target: tactic.fatigue,
      rewardConfidence: 3,
      rewardMomentum: 5,
      failureFatigue: 4
    };
  }

  if (player.confidence <= 58) {
    return {
      id: `confidence-${minute}-${tactic.id}`,
      title: 'Build belief',
      description: `Find a positive action from ${tactic.phase.toLowerCase()} and lift confidence by at least 4.`,
      kind: 'confidence',
      target: 4,
      rewardConfidence: 5,
      rewardMomentum: 6,
      failureFatigue: 2
    };
  }

  if (tactic.risk >= 34) {
    return {
      id: `execute-${minute}-${tactic.id}`,
      title: 'Execute the call',
      description: `Take on the risky ${tactic.name.toLowerCase()} and win a clean tactical result.`,
      kind: 'tactical-execution',
      target: 1,
      rewardConfidence: 5,
      rewardMomentum: 9,
      failureFatigue: 3
    };
  }

  return {
    id: `gainline-${minute}-${tactic.id}`,
    title: 'Win the gainline',
    description: `Gain at least ${tactic.emphasis === 'power' ? 10 : 12} metres from ${tactic.name.toLowerCase()}.`,
    kind: 'gainline',
    target: tactic.emphasis === 'power' ? 10 : 12,
    rewardConfidence: 4,
    rewardMomentum: 7,
    failureFatigue: 3
  };
}

function evaluateObjective(objective: PhaseObjective, outcome: PhaseOutcome): ObjectiveResult {
  const success = (() => {
    if (objective.kind === 'gainline') return outcome.gain >= objective.target;
    if (objective.kind === 'confidence') return outcome.confidence >= objective.target;
    if (objective.kind === 'control-fatigue') return outcome.fatigue <= objective.target && outcome.confidence >= 0;
    return outcome.confidence > 0 && outcome.gain >= 8;
  })();

  if (success) {
    return {
      success,
      title: `Objective complete: ${objective.title}`,
      detail: 'The player met the phase target and earned a coach trust bump.',
      impact: `+${objective.rewardConfidence} confidence, +${objective.rewardMomentum} momentum`,
      confidenceDelta: objective.rewardConfidence,
      fatigueDelta: 0,
      momentumDelta: objective.rewardMomentum
    };
  }

  return {
    success,
    title: `Objective missed: ${objective.title}`,
    detail: 'The phase outcome fell short of the target. The coach adjusts the next load.',
    impact: `-${Math.max(1, Math.round(objective.rewardMomentum / 2))} momentum, +${objective.failureFatigue} fatigue`,
    confidenceDelta: -2,
    fatigueDelta: objective.failureFatigue,
    momentumDelta: -Math.max(1, Math.round(objective.rewardMomentum / 2))
  };
}

export { evaluateObjective, getPhaseObjective };
export type { ObjectiveResult, PhaseObjective };
