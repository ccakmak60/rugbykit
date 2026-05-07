import type { Tactic } from '../game/types';

const tactics: Tactic[] = [
  { id: 'wide-pod', name: 'Wide pod launch', phase: 'Wide attack', emphasis: 'pace', risk: 34, fatigue: 7, detail: 'Move ball through 10-13 channel and attack outside shoulder.' },
  { id: 'carry-hard', name: 'Hard carry sequence', phase: 'Middle third', emphasis: 'power', risk: 22, fatigue: 9, detail: 'Win collision, recycle fast, test defender spacing around ruck.' },
  { id: 'kick-chase', name: 'Contestable kick chase', phase: 'Territory play', emphasis: 'stamina', risk: 28, fatigue: 8, detail: 'Kick behind line and pressure catcher with connected chase.' },
  { id: 'defensive-set', name: 'Red-zone defensive set', phase: 'Goal-line defence', emphasis: 'defence', risk: 18, fatigue: 10, detail: 'Hold line speed, fold guards and force lateral attack.' },
  { id: 'tempo-shift', name: 'Two-pass tempo shift', phase: 'Broken field', emphasis: 'handling', risk: 38, fatigue: 6, detail: 'Play early width before defensive line folds across.' }
];

export { tactics };
