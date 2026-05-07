import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import { Vector3 } from 'three';
import type { Tactic } from '../../game/types';
import { getRoute } from './phaseRoutes';

type BallProps = {
  minute: number;
  tactic: Tactic;
};

function Ball({ minute, tactic }: BallProps) {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const route = getRoute(tactic);
    const start = new Vector3(...route.ballStart);
    const end = new Vector3(...route.ballEnd);
    const pulse = (Math.sin(clock.elapsedTime * 1.8 + minute * 0.18) + 1) / 2;
    mesh.current.position.lerpVectors(start, end, pulse);
    mesh.current.position.y += Math.sin(pulse * Math.PI) * 0.55;
    mesh.current.rotation.x += 0.08;
    mesh.current.rotation.z += 0.05;
  });

  return (
    <mesh ref={mesh} castShadow position={[-10, 0.55, 0]} scale={[0.5, 0.32, 0.32]}>
      <sphereGeometry args={[0.38, 24, 16]} />
      <meshStandardMaterial color="#d78b3d" roughness={0.52} />
    </mesh>
  );
}

export { Ball };
