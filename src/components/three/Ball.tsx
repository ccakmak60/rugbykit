import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import { MathUtils } from 'three';

type BallProps = {
  minute: number;
};

function Ball({ minute }: BallProps) {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const progress = ((minute % 80) / 80) * 26 - 13;
    mesh.current.position.x = MathUtils.lerp(mesh.current.position.x, progress, 0.05);
    mesh.current.position.z = Math.sin(clock.elapsedTime * 1.8) * 2.4;
    mesh.current.position.y = 0.42 + Math.abs(Math.sin(clock.elapsedTime * 2.6)) * 0.55;
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
