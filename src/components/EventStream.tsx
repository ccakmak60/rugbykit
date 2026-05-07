import type { EventLog } from '../game/types';

type EventStreamProps = {
  logs: EventLog[];
};

function EventStream({ logs }: EventStreamProps) {
  return (
    <article className="panel log-panel event-console">
      <div className="panel-head stacked">
        <span className="kicker">event stream</span>
        <h2>Simulation feed</h2>
      </div>
      <div className="log-list">
        {logs.map((log, index) => (
          <div className="log" key={`${log.title}-${index}`}>
            <time>{log.minute}'</time>
            <div>
              <strong>{log.title}</strong>
              <p>{log.detail}</p>
              <small>{log.impact}</small>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export { EventStream };
