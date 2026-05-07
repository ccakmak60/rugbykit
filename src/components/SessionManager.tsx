type SessionManagerProps = {
  hasSave: boolean;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
};

function SessionManager({ hasSave, onSave, onLoad, onClear }: SessionManagerProps) {
  return (
    <article className="panel session-manager">
      <div className="panel-head stacked">
        <span className="kicker">session memory</span>
        <h2>Save and load</h2>
      </div>
      <div className="session-actions">
        <button onClick={onSave}>Save session</button>
        <button onClick={onLoad} disabled={!hasSave}>Load save</button>
        <button className="ghost" onClick={onClear} disabled={!hasSave}>Clear</button>
      </div>
    </article>
  );
}

export { SessionManager };
