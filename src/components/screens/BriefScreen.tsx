import type { Player, Tactic } from '../../game/types';

type BriefScreenProps = {
  player: Player;
  tactic: Tactic;
  onBack: () => void;
  onLaunch: () => void;
};

function BriefScreen({ player, tactic, onBack, onLaunch }: BriefScreenProps) {
  return (
    <section className="screen-shell brief-screen">
      <div className="screen-copy">
        <p className="eyebrow">Pre-match brief</p>
        <h1>{player.name} starts with {tactic.name.toLowerCase()}.</h1>
        <p className="lede">Staff focus: {tactic.detail}</p>
      </div>
      <div className="brief-grid">
        <article className="brief-card"><span>Player</span><strong>{player.role}</strong><p>{player.unit} unit / confidence {player.confidence}%</p></article>
        <article className="brief-card"><span>Tactic</span><strong>{tactic.phase}</strong><p>Emphasis: {tactic.emphasis} / risk {tactic.risk}</p></article>
        <article className="brief-card"><span>Load</span><strong>{player.fatigue}% fatigue</strong><p>Recover before high-risk contact if fatigue climbs.</p></article>
      </div>
      <div className="screen-actions"><button className="ghost" onClick={onBack}>Back</button><button className="screen-cta" onClick={onLaunch}>Launch simulation</button></div>
    </section>
  );
}

export { BriefScreen };
