import type { Tactic } from '../../game/types';

type AnimationState = 'idle' | 'run' | 'pass' | 'recover';

type AnimationContext = {
  selected: boolean;
  tactic: Tactic;
  phase: string;
  fatigue: number;
  confidence: number;
  minute: number;
};

function resolveAnimationState(context: AnimationContext): AnimationState {
  if (!context.selected) return 'idle';

  const phase = context.phase.toLowerCase();
  const tacticName = context.tactic.name.toLowerCase();
  const containsRecoverySignal =
    phase.includes('contained') ||
    phase.includes('defence') ||
    phase.includes('goal-line') ||
    phase.includes('pressure');

  if (context.fatigue >= 76 || (containsRecoverySignal && context.confidence < 62)) {
    return 'recover';
  }

  const passHeavyPattern =
    tacticName.includes('kick') ||
    tacticName.includes('pass') ||
    tacticName.includes('wide') ||
    tacticName.includes('tempo');

  if (passHeavyPattern && context.minute % 20 >= 10) {
    return 'pass';
  }

  return 'run';
}

function getAnimationIntensity(state: AnimationState): number {
  if (state === 'run') return 1;
  if (state === 'pass') return 0.68;
  if (state === 'recover') return 0.42;
  return 0.24;
}

export { getAnimationIntensity, resolveAnimationState };
export type { AnimationContext, AnimationState };
