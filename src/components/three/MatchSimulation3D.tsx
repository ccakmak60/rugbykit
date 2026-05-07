import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import type { Player, Tactic } from '../../game/types';
import { Ball } from './Ball';
import { CameraRig } from './CameraRig';
import type { CameraMode } from './CameraRig';
import { RugbyAvatar } from './RugbyAvatar';
import { RugbyPitch } from './RugbyPitch';
import { TacticalZones } from './TacticalZones';

const avatarSlots: [number, number, number][] = [
  [-8, 0, -2.8],
  [-7, 0, 2.4],
  [-3.5, 0, 0.6],
  [3.2, 0, -2.2],
  [5.6, 0, 2.8]
];

type MatchSimulation3DProps = {
  minute: number;
  phase: string;
  fatigue: number;
  confidence: number;
  player: Player;
  squad: Player[];
  tactic: Tactic;
  tactics: Tactic[];
  selectedPlayerId: string;
  selectedTacticId: string;
  onSelectPlayer: (playerId: string) => void;
  onSelectTactic: (tacticId: string) => void;
  cameraMode: CameraMode;
};

function Scenario({ minute, player, squad, tactic, tactics, selectedPlayerId, selectedTacticId, onSelectPlayer, onSelectTactic, cameraMode }: MatchSimulation3DProps) {
  const [inspectedPlayerId, setInspectedPlayerId] = useState(selectedPlayerId);
  const visibleSquad = squad.slice(0, avatarSlots.length);

  function inspectPlayer(playerId: string) {
    setInspectedPlayerId(playerId);
    onSelectPlayer(playerId);
  }

  return (
    <>
      <ambientLight intensity={0.58} />
      <CameraRig mode={cameraMode} />
      <directionalLight position={[4, 10, 5]} intensity={1.7} castShadow shadow-mapSize={[2048, 2048]} />
      <spotLight position={[-6, 8, -6]} angle={0.45} penumbra={0.8} intensity={1.2} color="#b8ff6a" />
      <RugbyPitch />
      <TacticalZones tactics={tactics} selectedTacticId={selectedTacticId} onSelectTactic={onSelectTactic} />
      <Ball minute={minute} />
      {visibleSquad.map((member, index) => (
        <RugbyAvatar
          key={member.id}
          player={member.id === player.id ? player : member}
          tactic={tactic}
          position={avatarSlots[index]}
          kitColor={member.unit === 'backs' ? '#b8ff6a' : '#f1c94b'}
          selected={member.id === selectedPlayerId}
          inspected={member.id === inspectedPlayerId}
          onInspect={inspectPlayer}
        />
      ))}
      <mesh position={[0, 0.04, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[7.4, 7.5, 96]} />
        <meshBasicMaterial color="#eef7ef" transparent opacity={0.28} />
      </mesh>
    </>
  );
}

function MatchSimulation3D(props: MatchSimulation3DProps) {
  const canUseWebGL = (() => {
    try {
      const canvas = document.createElement('canvas');
      return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      return false;
    }
  })();

  if (!canUseWebGL) {
    return (
      <div className="webgl-fallback">
        <div className="fallback-pitch">
          <span className="fallback-line one" />
          <span className="fallback-line two" />
          <span className="fallback-line three" />
          <span className="fallback-player attacker primary" />
          <span className="fallback-player attacker support" />
          <span className="fallback-player defender one" />
          <span className="fallback-player defender two" />
          <span className="fallback-ball" style={{ left: `${12 + props.minute}%` }} />
        </div>
        <div className="fallback-copy">
          <strong>WebGL unavailable in this browser session.</strong>
          <span>Showing 2D match fallback. Open in a GPU/WebGL-enabled browser to see interactive avatars.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="three-shell">
      <Canvas shadows camera={{ position: [-12, 12, 16], fov: 43 }}>
        <Scenario {...props} />
      </Canvas>
    </div>
  );
}

export { MatchSimulation3D };
export type { MatchSimulation3DProps };
