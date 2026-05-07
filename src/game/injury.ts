import type { PhaseActionId } from './actions';
import type { AttackTargetId } from './targets';
import type { OpponentPressure } from './pressure';
import type { Player, PlayerCondition, Tactic } from './types';

type LoadRiskLevel = 'low' | 'moderate' | 'high' | 'critical';

type LoadEvent = {
  risk: LoadRiskLevel;
  title: string;
  detail: string;
  impact: string;
  fatigueDelta: number;
  confidenceDelta: number;
  condition: PlayerCondition;
};

function getLoadRisk(player: Player, tactic: Tactic, actionId: PhaseActionId, targetId: AttackTargetId, pressure: OpponentPressure, minute: number): number {
  let risk = player.fatigue * 0.55 + tactic.fatigue * 1.4 + minute * 0.08;

  if (actionId === 'carry') risk += 12;
  if (actionId === 'support-line') risk -= 5;
  if (actionId === 'reset-shape') risk -= 12;
  if (actionId === 'kick') risk -= 3;

  if (targetId === 'middle-channel') risk += 9;
  if (targetId === 'red-zone') risk += 12;
  if (targetId === 'backfield') risk -= 4;

  if (pressure.id === 'jackal-threat') risk += 10;
  if (pressure.id === 'red-zone-squeeze') risk += 12;
  if (pressure.id === 'passive-line') risk -= 4;

  if (player.condition === 'knock') risk += 10;
  if (player.condition === 'strained') risk += 18;

  if (player.traits.includes('high-motor')) risk -= 8;
  if (player.traits.includes('collision-winner') && actionId === 'carry') risk -= 4;

  return Math.max(0, Math.round(risk));
}

function getRiskLevel(risk: number): LoadRiskLevel {
  if (risk >= 82) return 'critical';
  if (risk >= 64) return 'high';
  if (risk >= 42) return 'moderate';
  return 'low';
}

function resolveLoadEvent(player: Player, risk: number): LoadEvent {
  const level = getRiskLevel(risk);

  if (level === 'critical') {
    return {
      risk: level,
      title: 'Load alert: Minor strain',
      detail: `${player.name} is showing strain signs after repeated high-load contact.`,
      impact: '+8 fatigue, -5 confidence, condition strained',
      fatigueDelta: 8,
      confidenceDelta: -5,
      condition: 'strained'
    };
  }

  if (level === 'high') {
    return {
      risk: level,
      title: 'Load warning: Heavy contact',
      detail: `${player.name} absorbed extra contact. Recovery is recommended before another high-risk phase.`,
      impact: '+5 fatigue, -2 confidence, condition knock',
      fatigueDelta: 5,
      confidenceDelta: -2,
      condition: player.condition === 'strained' ? 'strained' : 'knock'
    };
  }

  if (level === 'moderate') {
    return {
      risk: level,
      title: 'Load note: Monitor contact',
      detail: `${player.name} is carrying manageable load, but repeated contact will add risk.`,
      impact: '+2 fatigue',
      fatigueDelta: 2,
      confidenceDelta: 0,
      condition: player.condition
    };
  }

  return {
    risk: level,
    title: 'Load clear',
    detail: `${player.name} handled the phase load cleanly.`,
    impact: 'No condition change',
    fatigueDelta: 0,
    confidenceDelta: 0,
    condition: player.condition === 'knock' && player.fatigue < 45 ? 'fit' : player.condition
  };
}

function applyLoadEvent(player: Player, event: LoadEvent): Player {
  const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

  return {
    ...player,
    fatigue: clamp(player.fatigue + event.fatigueDelta),
    confidence: clamp(player.confidence + event.confidenceDelta),
    condition: event.condition
  };
}

function getConditionLabel(condition: PlayerCondition) {
  if (condition === 'strained') return 'Strained';
  if (condition === 'knock') return 'Knock';
  return 'Fit';
}

export { applyLoadEvent, getConditionLabel, getLoadRisk, getRiskLevel, resolveLoadEvent };
export type { LoadEvent, LoadRiskLevel };
