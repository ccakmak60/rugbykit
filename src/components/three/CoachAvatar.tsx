import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Group } from 'three';
import type { Tactic } from '../../game/types';

type CoachAvatarProps = {
  tactic: Tactic;
  phase: string;
};

function CoachAvatar({ tactic, phase }: CoachAvatarProps) {
  const group = useRef<Group>(null);
  const [open, setOpen] = useState(true);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = -0.35 + Math.sin(clock.elapsedTime * 0.9) * 0.08;
  });

  return (
    <group ref={group} position={[13.2, 0, -4.8]} onClick={(event) => { event.stopPropagation(); setOpen((current) => !current); }}>
      <mesh castShadow position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.25, 24, 18]} />
        <meshStandardMaterial color="#b9855d" roughness={0.58} />
      </mesh>
      <mesh castShadow position={[0, 1.08, 0]}>
        <capsuleGeometry args={[0.34, 0.82, 10, 20]} />
        <meshStandardMaterial color="#111b16" roughness={0.44} />
      </mesh>
      <mesh castShadow position={[-0.32, 1.02, 0]} rotation-z={0.35}>
        <capsuleGeometry args={[0.08, 0.58, 8, 12]} />
        <meshStandardMaterial color="#b9855d" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0.34, 1.08, 0]} rotation-z={-0.8}>
        <capsuleGeometry args={[0.08, 0.7, 8, 12]} />
        <meshStandardMaterial color="#b9855d" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.58, 0.68, 48]} />
        <meshBasicMaterial color="#73d2ff" transparent opacity={0.72} />
      </mesh>
      {open && (
        <Html position={[-0.2, 2.55, 0]} center distanceFactor={10} transform>
          <div className="coach-card">
            <strong>Coach read</strong>
            <span>{phase}</span>
            <small>{tactic.detail}</small>
            <em>Click pitch zones to change tactic.</em>
          </div>
        </Html>
      )}
    </group>
  );
}

export { CoachAvatar };
