import type { PhaseActionId } from './actions';
import type { MatchState } from './matchState';
import type { OpponentPressure } from './pressure';
import type { Player, Tactic } from './types';

type AttackTargetId = 'left-edge' | 'middle-channel' | 'right-edge' | 'backfield' | 'red-zone';

type AttackTarget = {
  id: AttackTargetId;
  name: string;
  description: string;
  naturalTactics: string[];
  naturalActions: PhaseActionId[];
  weakAgainst: string[];
  strongAgainst: string[];
};

type TargetModifier = {
  scoreDelta: number;
  gainDelta: number;
  fatigueDelta: number;
  confidenceDelta: number;
  chanceDelta: number;
  read: string;
};

const attackTargets: AttackTarget[] = [
  { id: 'left-edge', name: 'Left Edge', description: 'Attack outside shoulders and stretch the defensive line.', naturalTactics: ['wide-pod'], naturalActions: ['pass', 'support-line'], weakAgainst: ['aggressive-blitz'], strongAgainst: ['jackal-threat', 'passive-line'] },
  { id: 'middle-channel', name: 'Middle Channel', description: 'Challenge the gainline through traffic and recycle quickly.', naturalTactics: ['carry-hard'], naturalActions: ['carry', 'support-line'], weakAgainst: ['jackal-threat'], strongAgainst: ['kick-pressure', 'passive-line'] },
  { id: 'right-edge', name: 'Right Edge', description: 'Shift tempo and attack space before the fold arrives.', naturalTactics: ['tempo-shift', 'wide-pod'], naturalActions: ['pass', 'support-line'], weakAgainst: ['aggressive-blitz'], strongAgainst: ['passive-line'] },
  { id: 'backfield', name: 'Backfield', description: 'Play behind the line and turn the defence around.', naturalTactics: ['kick-chase'], naturalActions: ['kick'], weakAgainst: ['kick-pressure'], strongAgainst: ['aggressive-blitz', 'red-zone-squeeze'] },
  { id: 'red-zone', name: 'Red Zone', description: 'Force the issue near the line and convert pressure into points.', naturalTactics: ['carry-hard', 'tempo-shift'], naturalActions: ['carry', 'pass', 'reset-shape'], weakAgainst: ['red-zone-squeeze'], strongAgainst: ['passive-line'] }
];

function getAttackTarget(targetId: AttackTargetId): AttackTarget {
  return attackTargets.find((target) => target.id === targetId) ?? attackTargets[0];
}

function getTargetModifier(target: AttackTarget, tactic: Tactic, actionId: PhaseActionId, pressure: OpponentPressure | undefined, player: Player, matchState?: MatchState): TargetModifier {
  const tacticFit = target.naturalTactics.includes(tactic.id);
  const actionFit = target.naturalActions.includes(actionId);
  const strong = pressure ? target.strongAgainst.includes(pressure.id) : false;
  const weak = pressure ? target.weakAgainst.includes(pressure.id) : false;

  let scoreDelta = (tacticFit ? 3 : -1) + (actionFit ? 3 : -1);
  let gainDelta = tacticFit || actionFit ? 2 : 0;
  let fatigueDelta = 0;
  let confidenceDelta = actionFit ? 1 : 0;
  let chanceDelta = 0;

  if (strong) {
    scoreDelta += 5;
    gainDelta += 3;
    chanceDelta += 4;
  }

  if (weak) {
    scoreDelta -= 6;
    gainDelta -= 2;
    fatigueDelta += 2;
    confidenceDelta -= 1;
    chanceDelta -= 3;
  }

  if (target.id === 'red-zone') {
    chanceDelta += matchState && matchState.scoringChance >= 55 ? 8 : 3;
    fatigueDelta += 1;
  }

  if (target.id === 'backfield') {
    gainDelta += 5;
    chanceDelta += actionId === 'kick' ? 4 : -2;
  }

  if ((target.id === 'left-edge' || target.id === 'right-edge') && player.traits.includes('explosive-runner')) {
    scoreDelta += 3;
    gainDelta += 2;
  }

  if (target.id === 'middle-channel' && player.traits.includes('collision-winner')) {
    scoreDelta += 3;
    fatigueDelta -= 1;
  }

  return {
    scoreDelta,
    gainDelta,
    fatigueDelta,
    confidenceDelta,
    chanceDelta,
    read: `${target.name} target: ${tacticFit || actionFit ? 'connected to the call' : 'stretching the plan'}${pressure ? ` against ${pressure.name.toLowerCase()}` : ''}.`
  };
}

export { attackTargets, getAttackTarget, getTargetModifier };
export type { AttackTarget, AttackTargetId, TargetModifier };
