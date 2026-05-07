import { phaseActions } from '../game/actions';
import type { PhaseActionId } from '../game/actions';
import type { OpponentPressure } from '../game/pressure';
import type { Tactic } from '../game/types';

type PhaseActionBarProps = {
  selectedActionId: PhaseActionId;
  tactic: Tactic;
  pressure: OpponentPressure;
  onSelectAction: (actionId: PhaseActionId) => void;
};

function PhaseActionBar({ selectedActionId, tactic, pressure, onSelectAction }: PhaseActionBarProps) {
  return (
    <div className="phase-action-bar">
      <div className="phase-action-heading">
        <span>Phase action</span>
        <strong>Choose how to answer the defensive look</strong>
      </div>
      <div className="phase-action-grid">
        {phaseActions.map((action) => {
          const natural = action.naturalTactics.includes(tactic.id);
          const strong = action.strongAgainst.includes(pressure.id);
          const weak = action.weakAgainst.includes(pressure.id);
          const tag = strong ? 'Counters pressure' : weak ? 'High risk' : natural ? 'Tactic fit' : 'Situational';

          return (
            <button className={action.id === selectedActionId ? 'phase-action active' : 'phase-action'} key={action.id} onClick={() => onSelectAction(action.id)}>
              <strong>{action.name}</strong>
              <span>{tag}</span>
              <small>{action.description}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { PhaseActionBar };
