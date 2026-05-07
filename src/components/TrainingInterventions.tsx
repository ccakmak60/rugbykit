import type { Drill } from '../game/types';

type TrainingInterventionsProps = {
  drills: Drill[];
  onTrain: (drill: Drill) => void;
};

function TrainingInterventions({ drills, onTrain }: TrainingInterventionsProps) {
  return (
    <article className="panel drills command-drills">
      <div className="panel-head stacked">
        <span className="kicker">preparation tools</span>
        <h2>Training interventions</h2>
      </div>
      {drills.map((drill) => (
        <button key={drill.label} onClick={() => onTrain(drill)}>
          <span>{drill.label}</span>
          <small>{drill.note}</small>
        </button>
      ))}
    </article>
  );
}

export { TrainingInterventions };
