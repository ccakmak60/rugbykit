import type { MatchState } from '../game/matchState';
import { getMatchResult } from '../game/matchState';

type ScoreboardProps = {
  matchState: MatchState;
  minute: number;
};

function Scoreboard({ matchState, minute }: ScoreboardProps) {
  const result = getMatchResult(matchState);

  return (
    <article className="scoreboard-card">
      <div>
        <span>Match clock</span>
        <strong>{minute}'</strong>
      </div>
      <div className="scoreline">
        <span>RugbyKit</span>
        <strong>{matchState.teamScore} - {matchState.opponentScore}</strong>
        <span>Opposition</span>
      </div>
      <div>
        <span>Status</span>
        <strong>{result}</strong>
      </div>
      <div>
        <span>Territory</span>
        <strong>{matchState.territory}%</strong>
      </div>
      <div>
        <span>Chance</span>
        <strong>{matchState.scoringChance}%</strong>
      </div>
    </article>
  );
}

export { Scoreboard };
