import { Html } from '@react-three/drei';
import type { Player, Tactic } from '../../game/types';

type FloatingPlayerCardProps = {
  player: Player;
  tactic: Tactic;
  visible: boolean;
};

function FloatingPlayerCard({ player, tactic, visible }: FloatingPlayerCardProps) {
  if (!visible) return null;

  return (
    <Html position={[0, 2.45, 0]} center distanceFactor={9} transform>
      <div className="avatar-card">
        <strong>{player.name}</strong>
        <span>{player.role}</span>
        <small>Confidence {player.confidence}% / Fatigue {player.fatigue}%</small>
        <em>{tactic.phase}: {tactic.name}</em>
      </div>
    </Html>
  );
}

export { FloatingPlayerCard };
