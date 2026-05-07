type TopBarProps = {
  selection: string;
};

function TopBar({ selection }: TopBarProps) {
  return (
    <nav className="topbar" aria-label="Session navigation">
      <div className="brand-mark"><span>RK</span> RugbyKit</div>
      <div className="topbar-meta">
        <span>Player simulation</span>
        <span>Session 04</span>
        <span>{selection}</span>
      </div>
    </nav>
  );
}

export { TopBar };
