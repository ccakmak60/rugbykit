import type { Player } from '../game/types';

type AttributeProfileProps = {
  player: Player;
};

const stats = ['pace', 'power', 'handling', 'defence', 'stamina', 'confidence'] as const;

function AttributeProfile({ player }: AttributeProfileProps) {
  return (
    <article className="panel attributes-panel">
      <div className="panel-head stacked">
        <span className="kicker">player state</span>
        <h2>Attribute profile</h2>
      </div>
      {stats.map((stat) => (
        <div className="stat" key={stat}>
          <span>{stat}</span>
          <div><i style={{ width: `${player[stat]}%` }} /></div>
          <b>{player[stat]}</b>
        </div>
      ))}
    </article>
  );
}

export { AttributeProfile };
