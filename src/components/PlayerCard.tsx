import { getPlayerTraits } from "../game/traits";
import type { Player } from "../game/types";

type PlayerCardProps = {
  player: Player;
  rating: number;
  selection: string;
};

function PlayerCard({ player, rating, selection }: PlayerCardProps) {
  const traits = getPlayerTraits(player);

  return (
    <div className="player-card command-card">
      <div className="shirt">13</div>
      <div>
        <p>{player.role}</p>
        <h2>{player.name}</h2>
        <span>{selection}</span>
        <div className="trait-list compact">
          {traits.map((trait) => (
            <em key={trait.id}>{trait.name}</em>
          ))}
        </div>
      </div>
      <strong>{rating}</strong>
    </div>
  );
}

export { PlayerCard };
