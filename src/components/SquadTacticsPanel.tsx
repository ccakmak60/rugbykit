import type { Player, Tactic } from '../game/types';

type SquadTacticsPanelProps = {
  squad: Player[];
  tactics: Tactic[];
  selectedPlayerId: string;
  selectedTacticId: string;
  onSelectPlayer: (playerId: string) => void;
  onSelectTactic: (tacticId: string) => void;
};

function SquadTacticsPanel({ squad, tactics, selectedPlayerId, selectedTacticId, onSelectPlayer, onSelectTactic }: SquadTacticsPanelProps) {
  return (
    <article className="panel squad-panel">
      <div className="panel-head stacked">
        <span className="kicker">selection room</span>
        <h2>Squad and tactic</h2>
      </div>
      <label className="select-field">
        <span>Active player</span>
        <select value={selectedPlayerId} onChange={(event) => onSelectPlayer(event.target.value)}>
          {squad.map((player) => <option value={player.id} key={player.id}>{player.name} / {player.role}</option>)}
        </select>
      </label>
      <label className="select-field">
        <span>Phase tactic</span>
        <select value={selectedTacticId} onChange={(event) => onSelectTactic(event.target.value)}>
          {tactics.map((tactic) => <option value={tactic.id} key={tactic.id}>{tactic.name}</option>)}
        </select>
      </label>
      <div className="tactic-list">
        {tactics.map((tactic) => (
          <button className={tactic.id === selectedTacticId ? 'tactic-chip active' : 'tactic-chip'} key={tactic.id} onClick={() => onSelectTactic(tactic.id)}>
            <strong>{tactic.phase}</strong>
            <span>{tactic.detail}</span>
          </button>
        ))}
      </div>
    </article>
  );
}

export { SquadTacticsPanel };
