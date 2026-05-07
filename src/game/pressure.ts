import type { Tactic } from './types';

type OpponentPressureId = 'passive-line' | 'aggressive-blitz' | 'jackal-threat' | 'kick-pressure' | 'red-zone-squeeze';

type OpponentPressure = {
  id: OpponentPressureId;
  name: string;
  description: string;
  strongAgainst: string[];
  weakAgainst: string[];
  riskModifier: number;
  rewardModifier: number;
};

type PressureModifier = {
  scoreDelta: number;
  gainDelta: number;
  fatigueDelta: number;
  confidenceDelta: number;
  read: string;
};

const opponentPressures: OpponentPressure[] = [
  {
    id: 'passive-line',
    name: 'Passive line',
    description: 'The defence is sitting off and protecting space behind the line.',
    strongAgainst: [],
    weakAgainst: ['carry-hard', 'tempo-shift'],
    riskModifier: -4,
    rewardModifier: 3
  },
  {
    id: 'aggressive-blitz',
    name: 'Aggressive blitz',
    description: 'The line is flying up early and trying to cut off wide ball.',
    strongAgainst: ['wide-pod'],
    weakAgainst: ['kick-chase', 'tempo-shift'],
    riskModifier: 8,
    rewardModifier: 7
  },
  {
    id: 'jackal-threat',
    name: 'Jackal threat',
    description: 'The opposition back row is hunting isolated carriers after contact.',
    strongAgainst: ['carry-hard'],
    weakAgainst: ['wide-pod'],
    riskModifier: 7,
    rewardModifier: 6
  },
  {
    id: 'kick-pressure',
    name: 'Kick pressure',
    description: 'The backfield is organised and the chase line is ready to counter-kick.',
    strongAgainst: ['kick-chase'],
    weakAgainst: ['carry-hard'],
    riskModifier: 6,
    rewardModifier: 5
  },
  {
    id: 'red-zone-squeeze',
    name: 'Red-zone squeeze',
    description: 'The defence is compressed near the line and every metre is contested.',
    strongAgainst: ['carry-hard', 'wide-pod'],
    weakAgainst: ['tempo-shift'],
    riskModifier: 9,
    rewardModifier: 9
  }
];

function getOpponentPressure(minute: number, momentum: number): OpponentPressure {
  if (minute >= 60 && momentum < 45) return opponentPressures.find((pressure) => pressure.id === 'red-zone-squeeze') ?? opponentPressures[0];
  if (momentum >= 72) return opponentPressures.find((pressure) => pressure.id === 'aggressive-blitz') ?? opponentPressures[0];
  if (momentum <= 34) return opponentPressures.find((pressure) => pressure.id === 'jackal-threat') ?? opponentPressures[0];

  const index = Math.abs(Math.floor(minute / 10) + Math.floor(momentum / 17)) % opponentPressures.length;
  return opponentPressures[index];
}

function getPressureModifier(tactic: Tactic, pressure: OpponentPressure, momentum: number): PressureModifier {
  const momentumBoost = Math.round((momentum - 50) / 8);

  if (pressure.weakAgainst.includes(tactic.id)) {
    return {
      scoreDelta: 8 + momentumBoost,
      gainDelta: 4,
      fatigueDelta: -1,
      confidenceDelta: 2,
      read: `${tactic.name} attacks the weakness in ${pressure.name.toLowerCase()}.`
    };
  }

  if (pressure.strongAgainst.includes(tactic.id)) {
    return {
      scoreDelta: -pressure.riskModifier + momentumBoost,
      gainDelta: -3,
      fatigueDelta: 2,
      confidenceDelta: -2,
      read: `${pressure.name} directly challenges ${tactic.name.toLowerCase()}.`
    };
  }

  return {
    scoreDelta: momentumBoost,
    gainDelta: momentum >= 60 ? 1 : 0,
    fatigueDelta: 0,
    confidenceDelta: momentum >= 60 ? 1 : 0,
    read: `${tactic.name} is neutral against ${pressure.name.toLowerCase()}. Momentum decides the edge.`
  };
}

export { getOpponentPressure, getPressureModifier, opponentPressures };
export type { OpponentPressure, OpponentPressureId, PressureModifier };
