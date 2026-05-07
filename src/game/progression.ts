import type { Player, TrainingFocus } from './types';
import { clamp, ratePlayer } from './simulation';

function applyTrainingWeek(player: Player, focus: TrainingFocus): Player {
  const next = { ...player };

  Object.entries(focus.effects).forEach(([stat, change]) => {
    const key = stat as keyof TrainingFocus['effects'];
    if (typeof change !== 'number') return;
    next[key] = clamp((next[key] ?? 0) + change) as never;
  });

  const formLift = focus.id === 'recovery' ? 3 : Math.max(1, Math.round((focus.effects.confidence ?? 0) + 2 - Math.max(0, focus.effects.fatigue ?? 0) / 8));

  return {
    ...next,
    form: [...player.form.slice(1), clamp(ratePlayer(next) + formLift)]
  };
}

export { applyTrainingWeek };
