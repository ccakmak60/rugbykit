import { Trophy } from "lucide-react";
import type { MatchState } from "../game/matchState";
import { getMatchResult } from "../game/matchState";
import type { PhaseObjective } from "../game/objectives";
import type { OpponentPressure } from "../game/pressure";

type CoachConsoleProps = {
  coachRead: string;
  minute: number;
  fatigue: number;
  confidence: number;
  selection: string;
  objective: PhaseObjective;
  momentum: number;
  pressure: OpponentPressure;
  matchState: MatchState;
};

function CoachConsole({
  coachRead,
  minute,
  fatigue,
  confidence,
  selection,
  objective,
  momentum,
  pressure,
  matchState,
}: CoachConsoleProps) {
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
      <div className="objective-card">
        <span>Phase objective</span>
        <strong>{objective.title}</strong>
        <p>{objective.description}</p>
        <small>
          Reward: +{objective.rewardConfidence} confidence / +
          {objective.rewardMomentum} momentum
        </small>
      </div>
      <div className="pressure-card">
        <span>Defensive look</span>
        <strong>{pressure.name}</strong>
        <p>{pressure.description}</p>
        <small>
          Weak against:{" "}
          {pressure.weakAgainst.length
            ? pressure.weakAgainst.join(", ")
            : "patient phase play"}
        </small>
      </div>
      <div className="metric-row">
        <span>Score</span>
        <strong>
          {matchState.teamScore}-{matchState.opponentScore} /{" "}
          {getMatchResult(matchState)}
        </strong>
      </div>
      <div className="metric-row">
        <span>Scoring chance</span>
        <strong>{matchState.scoringChance}%</strong>
      </div>
      <div className="metric-row">
        <span>Momentum</span>
        <strong>{momentum}%</strong>
      </div>
      <div className="metric-row">
        <span>Match minute</span>
        <strong>{minute}'</strong>
      </div>
      <div className="metric-row">
        <span>Fatigue load</span>
        <strong>{fatigue}%</strong>
      </div>
      <div className="metric-row">
        <span>Confidence</span>
        <strong>{confidence}%</strong>
      </div>
      <div className="metric-row">
        <span>Selection band</span>
        <strong>{selection}</strong>
      </div>
    </aside>
  );
}

export { CoachConsole };
