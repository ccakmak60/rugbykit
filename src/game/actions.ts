import type { OpponentPressure } from './pressure';
import type { Player, Tactic } from './types';

type PhaseActionId = 'carry' | 'pass' | 'kick' | 'support-line' | 'reset-shape';

type PhaseAction = {
  id: PhaseActionId;
  name: string;
  description: string;
  naturalTactics: string[];
  strongAgainst: string[];
  weakAgainst: string[];
};

type ActionModifier = {
  scoreDelta: number;
  gainDelta: number;
  fatigueDelta: number;
  confidenceDelta: number;
  read: string;
};

const phaseActions: PhaseAction[] = [
  { id: 'carry', name: 'Carry', description: 'Take contact and fight past the gainline.', naturalTactics: ['carry-hard'], strongAgainst: ['kick-pressure', 'passive-line'], weakAgainst: ['jackal-threat', 'red-zone-squeeze'] },
  { id: 'pass', name: 'Pass', description: 'Move the ball early and stress defensive width.', naturalTactics: ['wide-pod', 'tempo-shift'], strongAgainst: ['passive-line', 'jackal-threat'], weakAgainst: ['aggressive-blitz'] },
  { id: 'kick', name: 'Kick', description: 'Attack space behind the line and trade possession for territory.', naturalTactics: ['kick-chase'], strongAgainst: ['aggressive-blitz', 'red-zone-squeeze'], weakAgainst: ['kick-pressure'] },
  { id: 'support-line', name: 'Support Line', description: 'Prioritise connection, recycle speed and possession security.', naturalTactics: ['wide-pod', 'carry-hard', 'tempo-shift'], strongAgainst: ['jackal-threat'], weakAgainst: [] },
  { id: 'reset-shape', name: 'Reset Shape', description: 'Slow the phase down, protect fatigue and rebuild structure.', naturalTactics: ['defensive-set'], strongAgainst: ['red-zone-squeeze', 'aggressive-blitz'], weakAgainst: ['passive-line'] }
];

function getPhaseAction(actionId: PhaseActionId): PhaseAction {
  return phaseActions.find((action) => action.id === actionId) ?? phaseActions[0];
}

function getActionModifier(action: PhaseAction, tactic: Tactic, pressure: OpponentPressure | undefined, player: Player): ActionModifier {
  const naturalFit = action.naturalTactics.includes(tactic.id);
  const strongFit = pressure ? action.strongAgainst.includes(pressure.id) : false;
  const weakFit = pressure ? action.weakAgainst.includes(pressure.id) : false;

  let scoreDelta = naturalFit ? 5 : -2;
  let gainDelta = naturalFit ? 2 : 0;
  let fatigueDelta = 0;
  let confidenceDelta = naturalFit ? 1 : 0;

  if (strongFit) {
    scoreDelta += 6;
    gainDelta += 3;
    confidenceDelta += 2;
  }

  if (weakFit) {
    scoreDelta -= 7;
    gainDelta -= 2;
    fatigueDelta += 2;
    confidenceDelta -= 2;
  }

  if (action.id === 'carry') {
    scoreDelta += Math.round((player.power - 70) / 8);
    fatigueDelta += 2;
  }

  if (action.id === 'pass') {
    scoreDelta += Math.round((player.handling - 70) / 8);
  }

  if (action.id === 'kick') {
    scoreDelta += Math.round((player.stamina - 70) / 10);
    gainDelta += 4;
    confidenceDelta -= weakFit ? 1 : 0;
  }

  if (action.id === 'support-line') {
    scoreDelta += 2;
    fatigueDelta -= 1;
    confidenceDelta += 1;
  }

  if (action.id === 'reset-shape') {
    scoreDelta += player.fatigue > 60 ? 5 : 1;
    gainDelta -= 3;
    fatigueDelta -= 3;
    confidenceDelta += 1;
  }

  return {
    scoreDelta,
    gainDelta,
    fatigueDelta,
    confidenceDelta,
    read: `${action.name} call: ${naturalFit ? 'good tactical fit' : 'forced option'}${pressure ? ` against ${pressure.name.toLowerCase()}` : ''}.`
  };
}

export { getActionModifier, getPhaseAction, phaseActions };
export type { ActionModifier, PhaseAction, PhaseActionId };
