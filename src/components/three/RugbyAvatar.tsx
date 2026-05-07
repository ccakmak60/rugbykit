import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import { Vector3 } from 'three';
import type { Player, Tactic } from '../../game/types';
import { FloatingPlayerCard } from './FloatingPlayerCard';

type RugbyAvatarProps = {
  player: Player;
  tactic: Tactic;
  position: [number, number, number];
  routeEnd?: [number, number, number];
  kitColor: string;
  selected?: boolean;
  inspected?: boolean;
  onInspect: (playerId: string) => void;
};

function RugbyAvatar({ player, tactic, position, routeEnd, kitColor, selected = false, inspected = false, onInspect }: RugbyAvatarProps) {
  const group = useRef<Group>(null);
  const origin = useMemo(() => new Vector3(...position), [position]);
  const destination = useMemo(() => new Vector3(...(routeEnd ?? position)), [routeEnd, position]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const pulse = selected ? (Math.sin(clock.elapsedTime * 1.7) + 1) / 2 : 0;
    group.current.position.lerpVectors(origin, destination, pulse);
    group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2.2 + position[0]) * 0.035;
    if (selected) group.current.rotation.y = Math.sin(clock.elapsedTime * 1.1) * 0.2;
  });

  return (
    <group ref={group} position={position} onClick={(event) => { event.stopPropagation(); onInspect(player.id); }}>
      <mesh castShadow position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.28, 24, 18]} />
        <meshStandardMaterial color="#c99772" roughness={0.58} />
      </mesh>
      <mesh castShadow position={[0, 1.18, 0]}>
        <capsuleGeometry args={[0.36, 0.78, 10, 20]} />
        <meshStandardMaterial color={kitColor} roughness={0.44} metalness={0.04} />
      </mesh>
      <mesh castShadow position={[-0.34, 0.95, 0]} rotation-z={0.25}>
        <capsuleGeometry args={[0.09, 0.62, 8, 12]} />
        <meshStandardMaterial color="#c99772" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0.34, 0.95, 0]} rotation-z={-0.25}>
        <capsuleGeometry args={[0.09, 0.62, 8, 12]} />
        <meshStandardMaterial color="#c99772" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[-0.15, 0.42, 0]}>
        <capsuleGeometry args={[0.11, 0.62, 8, 12]} />
        <meshStandardMaterial color="#17251d" roughness={0.62} />
      </mesh>
      <mesh castShadow position={[0.15, 0.42, 0]}>
        <capsuleGeometry args={[0.11, 0.62, 8, 12]} />
        <meshStandardMaterial color="#17251d" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.56, 0.64, 48]} />
        <meshBasicMaterial color={selected ? '#b8ff6a' : inspected ? '#f1c94b' : '#eef7ef'} transparent opacity={selected || inspected ? 0.9 : 0.32} />
      </mesh>
      <FloatingPlayerCard player={player} tactic={tactic} visible={selected || inspected} />
    </group>
  );
}

export { RugbyAvatar };
