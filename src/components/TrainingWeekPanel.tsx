import type { TrainingFocus } from '../game/types';

type TrainingWeekPanelProps = {
  focuses: TrainingFocus[];
  selectedFocusId: string;
  onSelectFocus: (focusId: string) => void;
  onApplyWeek: () => void;
};

function TrainingWeekPanel({ focuses, selectedFocusId, onSelectFocus, onApplyWeek }: TrainingWeekPanelProps) {
  return (
    <article className="panel training-week-panel">
      <div className="panel-head stacked">
        <span className="kicker">training week</span>
        <h2>Progression focus</h2>
      </div>
      <div className="focus-list">
        {focuses.map((focus) => (
          <button className={focus.id === selectedFocusId ? 'focus-card active' : 'focus-card'} key={focus.id} onClick={() => onSelectFocus(focus.id)}>
            <strong>{focus.name}</strong>
            <span>{focus.description}</span>
          </button>
        ))}
      </div>
      <button className="apply-week" onClick={onApplyWeek}>Apply training week</button>
    </article>
  );
}

export { TrainingWeekPanel };
