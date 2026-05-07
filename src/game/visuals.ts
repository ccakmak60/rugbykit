import type { PhaseActionId } from './actions';
import type { AttackTargetId } from './targets';

type PhaseVisualKind = 'success' | 'contained' | 'score' | 'load-warning';

type PhaseVisualResult = {
  id: number;
  kind: PhaseVisualKind;
  label: string;
  detail: string;
  gain: number;
  actionId: PhaseActionId;
  targetId: AttackTargetId;
};

export type { PhaseVisualKind, PhaseVisualResult };
