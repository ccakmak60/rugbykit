import { attackTargets } from '../game/targets';
import type { AttackTargetId } from '../game/targets';
import type { PhaseActionId } from '../game/actions';
import type { OpponentPressure } from '../game/pressure';
import type { Tactic } from '../game/types';

type AttackTargetBarProps = {
  selectedTargetId: AttackTargetId;
  selectedActionId: PhaseActionId;
  tactic: Tactic;
  pressure: OpponentPressure;
  onSelectTarget: (targetId: AttackTargetId) => void;
};

function AttackTargetBar({ selectedTargetId, selectedActionId, tactic, pressure, onSelectTarget }: AttackTargetBarProps) {
  return (
    <div className="attack-target-bar">
      <div className="phase-action-heading">
        <span>Attack target</span>
        <strong>Pick where to apply the phase action</strong>
      </div>
      <div className="phase-action-grid">
        {attackTargets.map((target) => {
          const fit = target.naturalTactics.includes(tactic.id) || target.naturalActions.includes(selectedActionId);
          const strong = target.strongAgainst.includes(pressure.id);
          const weak = target.weakAgainst.includes(pressure.id);
          const tag = strong ? 'Exploits look' : weak ? 'Marked up' : fit ? 'Fits call' : 'Stretch option';

          return (
            <button className={target.id === selectedTargetId ? 'phase-action active target-action' : 'phase-action target-action'} key={target.id} onClick={() => onSelectTarget(target.id)}>
              <strong>{target.name}</strong>
              <span>{tag}</span>
              <small>{target.description}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { AttackTargetBar };
