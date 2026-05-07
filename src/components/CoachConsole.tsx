import { Trophy } from 'lucide-react';

type CoachConsoleProps = {
  coachRead: string;
  minute: number;
  fatigue: number;
  confidence: number;
  selection: string;
};

function CoachConsole({ coachRead, minute, fatigue, confidence, selection }: CoachConsoleProps) {
  return (
    <aside className="panel coach-console">
      <div className="panel-head stacked">
        <span className="kicker">coach console</span>
        <h2>Next best action</h2>
      </div>
      <div className="coach-callout">
        <Trophy size={22} />
        <p>{coachRead}</p>
      </div>
      <div className="metric-row"><span>Match minute</span><strong>{minute}'</strong></div>
      <div className="metric-row"><span>Fatigue load</span><strong>{fatigue}%</strong></div>
      <div className="metric-row"><span>Confidence</span><strong>{confidence}%</strong></div>
      <div className="metric-row"><span>Selection band</span><strong>{selection}</strong></div>
    </aside>
  );
}

export { CoachConsole };
