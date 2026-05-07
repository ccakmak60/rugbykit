import type { Fixture } from '../data/fixtures';

type SeasonCalendarProps = {
  fixtures: Fixture[];
  activeWeek: number;
  onSelectWeek: (week: number) => void;
};

function SeasonCalendar({ fixtures, activeWeek, onSelectWeek }: SeasonCalendarProps) {
  return (
    <article className="panel season-calendar">
      <div className="panel-head stacked">
        <span className="kicker">season block</span>
        <h2>Fixture calendar</h2>
      </div>
      <div className="fixture-list">
        {fixtures.map((fixture) => (
          <button className={fixture.week === activeWeek ? 'fixture-card active' : 'fixture-card'} key={fixture.week} onClick={() => onSelectWeek(fixture.week)}>
            <span>Week {fixture.week} / {fixture.venue}</span>
            <strong>{fixture.opponent}</strong>
            <small>{fixture.focus}</small>
            <i>Difficulty {fixture.difficulty}</i>
          </button>
        ))}
      </div>
    </article>
  );
}

export { SeasonCalendar };
