import type { EventLog, Player } from '../../game/types';

type DebriefScreenProps = {
  player: Player;
  rating: number;
  selection: string;
  logs: EventLog[];
  onBackToSim: () => void;
  onRestart: () => void;
};

function DebriefScreen({ player, rating, selection, logs, onBackToSim, onRestart }: DebriefScreenProps) {
  const latest = logs[0];

  return (
    <section className="screen-shell debrief-screen">
      <div className="screen-copy">
        <p className="eyebrow">Debrief</p>
        <h1>{player.name} finishes at rating {rating}.</h1>
        <p className="lede">Selection read: {selection}. Latest staff note: {latest?.detail ?? 'No phase logged yet.'}</p>
      </div>
      <div className="brief-grid">
        <article className="brief-card"><span>Confidence</span><strong>{player.confidence}%</strong><p>Current mental state after session.</p></article>
        <article className="brief-card"><span>Fatigue</span><strong>{player.fatigue}%</strong><p>Load carried into next block.</p></article>
        <article className="brief-card"><span>Last impact</span><strong>{latest?.impact ?? 'None'}</strong><p>{latest?.title ?? 'Run a phase first.'}</p></article>
      </div>
      <div className="screen-actions"><button className="ghost" onClick={onBackToSim}>Back to simulation</button><button className="screen-cta" onClick={onRestart}>New session</button></div>
    </section>
  );
}

export { DebriefScreen };
