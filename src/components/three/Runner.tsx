import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import { Vector3 } from 'three';

type RunnerProps = {
  color: string;
  start: [number, number, number];
  target: [number, number, number];
  speed: number;
};

function Runner({ color, start, target, speed }: RunnerProps) {
  const mesh = useRef<Mesh>(null);
  const origin = useMemo(() => new Vector3(...start), [start]);
  const destination = useMemo(() => new Vector3(...target), [target]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = (Math.sin(clock.elapsedTime * speed) + 1) / 2;
    mesh.current.position.lerpVectors(origin, destination, t);
    mesh.current.position.y = 0.58 + Math.sin(clock.elapsedTime * speed * 4) * 0.04;
  });

  return (
    <mesh ref={mesh} castShadow position={start}>
      <sphereGeometry args={[0.42, 24, 16]} />
      <meshStandardMaterial color={color} roughness={0.48} />
    </mesh>
  );
}

export { Runner };
