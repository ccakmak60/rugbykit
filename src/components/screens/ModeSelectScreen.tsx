type ModeSelectScreenProps = {
  onBack: () => void;
  onContinue: () => void;
};

function ModeSelectScreen({ onBack, onContinue }: ModeSelectScreenProps) {
  return (
    <section className="screen-shell mode-screen">
      <div className="screen-copy">
        <p className="eyebrow">Session mode</p>
        <h1>Choose what staff are evaluating today.</h1>
      </div>
      <div className="mode-grid">
        <button className="mode-card active" onClick={onContinue}>
          <span>Active</span>
          <strong>Matchday phase sim</strong>
          <p>Run tactical possessions and update player state.</p>
        </button>
        <button className="mode-card" disabled>
          <span>Soon</span>
          <strong>Training week</strong>
          <p>Plan workload over multiple days.</p>
        </button>
        <button className="mode-card" disabled>
          <span>Soon</span>
          <strong>Season career</strong>
          <p>Track development across fixtures.</p>
        </button>
      </div>
      <div className="screen-actions"><button className="ghost" onClick={onBack}>Back</button></div>
    </section>
  );
}

export { ModeSelectScreen };
