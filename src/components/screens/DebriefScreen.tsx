import {
  getCoachVerdict,
  getFinalResult,
  getKeyMoments,
  getObjectiveSummary,
} from "../../game/debrief";
import type { MatchState } from "../../game/matchState";
import type { EventLog, Player } from "../../game/types";

type DebriefScreenProps = {
  player: Player;
  rating: number;
  selection: string;
  logs: EventLog[];
  matchState: MatchState;
  momentum: number;
  minute: number;
  onBackToSim: () => void;
  onRestart: () => void;
};

function DebriefScreen({
  player,
  rating,
  selection,
  logs,
  matchState,
  momentum,
  minute,
  onBackToSim,
  onRestart,
}: DebriefScreenProps) {
  const latest = logs[0];
  const result = getFinalResult(matchState);
  const verdict = getCoachVerdict(
    player,
    rating,
    selection,
    matchState,
    momentum,
  );
  const keyMoments = getKeyMoments(logs);
  const objectiveSummary = getObjectiveSummary(logs);

  return (
    <section className="screen-shell debrief-screen enhanced-debrief">
      <div className="screen-copy">
        <p className="eyebrow">Final debrief</p>
        <h1>
          {result}: RugbyKit {matchState.teamScore} - {matchState.opponentScore}{" "}
          Opposition.
        </h1>
        <p className="lede">{verdict}</p>
        <div className="final-score-card">
          <span>{minute >= 80 ? "Full time" : `${minute}' review`}</span>
          <strong>
            {matchState.teamScore} - {matchState.opponentScore}
          </strong>
          <small>
            Momentum {momentum}% / Selection read: {selection}
          </small>
        </div>
      </div>

      <div className="debrief-stack">
        <div className="brief-grid">
          <article className="brief-card">
            <span>Player rating</span>
            <strong>{rating}</strong>
            <p>
              {player.name} finishes in the {selection} band.
            </p>
          </article>
          <article className="brief-card">
            <span>Confidence</span>
            <strong>{player.confidence}%</strong>
            <p>Current mental state after the match.</p>
          </article>
          <article className="brief-card">
            <span>Fatigue</span>
            <strong>{player.fatigue}%</strong>
            <p>Load carried into the next block.</p>
          </article>
        </div>

        <div className="brief-grid two-column">
          <article className="brief-card">
            <span>Objectives</span>
            <strong>
              {objectiveSummary.complete} / {objectiveSummary.missed}
            </strong>
            <p>Completed versus missed phase objectives.</p>
          </article>
          <article className="brief-card">
            <span>Scoring pressure</span>
            <strong>{matchState.scoringChance}%</strong>
            <p>Final attacking chance after the last phase.</p>
          </article>
        </div>

        <article className="brief-card key-moments-card">
          <span>Key moments</span>
          <div className="key-moment-list">
            {(keyMoments.length ? keyMoments : logs.slice(0, 4)).map(
              (log, index) => (
                <div key={`${log.title}-${index}`}>
                  <time>{log.minute}'</time>
                  <strong>{log.title}</strong>
                  <small>{log.impact}</small>
                </div>
              ),
            )}
          </div>
          <p>
            {latest?.detail ?? "Run a phase first to generate match moments."}
          </p>
        </article>

        <div className="screen-actions">
          <button className="ghost" onClick={onBackToSim}>
            Back to simulation
          </button>
          <button className="screen-cta" onClick={onRestart}>
            New session
          </button>
        </div>
      </div>
    </section>
  );
}

export { DebriefScreen };
