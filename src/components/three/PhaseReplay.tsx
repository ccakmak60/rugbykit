import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
import type { PhaseVisualResult } from '../../game/visuals';

const targetPositions = {
  'left-edge': [-1.5, 0.35, -7.1],
  'middle-channel': [0, 0.35, 0],
  'right-edge': [-1.5, 0.35, 7.1],
  backfield: [-10.5, 0.35, 0],
  'red-zone': [13.2, 0.35, 0]
} satisfies Record<string, [number, number, number]>;

const colors = {
  success: '#b8ff6a',
  contained: '#ff7a59',
  score: '#f1c94b',
  'load-warning': '#ff9f5f'
} satisfies Record<PhaseVisualResult['kind'], string>;

type PhaseReplayProps = {
  visual: PhaseVisualResult | null;
};

function PhaseReplay({ visual }: PhaseReplayProps) {
  const group = useRef<Group>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visual) return;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [visual]);

  useFrame(({ clock }) => {
    if (!group.current || !visual) return;
    const pulse = (Math.sin(clock.elapsedTime * 5) + 1) / 2;
    group.current.scale.setScalar(1 + pulse * 0.08);
    group.current.position.y = 0.12 + pulse * 0.15;
  });

  if (!visual || !visible) return null;

  const position = targetPositions[visual.targetId];
  const color = colors[visual.kind];

  return (
    <group ref={group} position={position}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.3, 1.48, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.72} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.025, 0]}>
        <circleGeometry args={[1.24, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.14} />
      </mesh>
      <Html position={[0, 1.8, 0]} center distanceFactor={9} transform>
        <div className={`phase-replay-card ${visual.kind}`}>
          <strong>{visual.label}</strong>
          <span>{visual.detail}</span>
          <small>{visual.actionId} / {visual.targetId}</small>
        </div>
      </Html>
    </group>
  );
}

export { PhaseReplay };
