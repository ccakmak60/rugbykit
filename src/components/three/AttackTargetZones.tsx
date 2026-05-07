import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Group } from 'three';
import { attackTargets } from '../../game/targets';
import type { AttackTargetId } from '../../game/targets';
import type { AnimationState } from './animationState';

type AttackTargetZonesProps = {
  selectedTargetId: AttackTargetId;
  onSelectTarget: (targetId: AttackTargetId) => void;
  animationState: AnimationState;
  animationIntensity: number;
};

const targetLayout: Record<AttackTargetId, { position: [number, number, number]; size: [number, number]; color: string }> = {
  'left-edge': { position: [-2, 0.061, -7.35], size: [18, 2.2], color: '#73d2ff' },
  'middle-channel': { position: [0, 0.062, 0], size: [12, 5.4], color: '#f1c94b' },
  'right-edge': { position: [-2, 0.063, 7.35], size: [18, 2.2], color: '#73d2ff' },
  backfield: { position: [-10.5, 0.064, 0], size: [6.2, 15.6], color: '#d9a7ff' },
  'red-zone': { position: [13.4, 0.065, 0], size: [4.8, 15.6], color: '#ff7a59' }
};

function AttackTargetZones({ selectedTargetId, onSelectTarget, animationState, animationIntensity }: AttackTargetZonesProps) {
  const [hoveredId, setHoveredId] = useState<AttackTargetId | null>(null);
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const pulse = (Math.sin(clock.elapsedTime * (0.9 + animationIntensity)) + 1) / 2;
    group.current.position.y = 0.005 + pulse * 0.01;
  });

  return (
    <group ref={group}>
      {attackTargets.map((target) => {
        const layout = targetLayout[target.id];
        const active = selectedTargetId === target.id;
        const hovered = hoveredId === target.id;
        const opacity = active ? 0.2 + animationIntensity * 0.14 : hovered ? 0.14 : 0.045;
        const color = animationState === 'recover' && active ? '#f1c94b' : layout.color;

        return (
          <group key={target.id} position={layout.position}>
            <mesh
              rotation-x={-Math.PI / 2}
              onClick={(event) => {
                event.stopPropagation();
                onSelectTarget(target.id);
              }}
              onPointerEnter={(event) => {
                event.stopPropagation();
                setHoveredId(target.id);
              }}
              onPointerLeave={() => setHoveredId(null)}
            >
              <planeGeometry args={layout.size} />
              <meshBasicMaterial color={color} transparent opacity={opacity} />
            </mesh>
            {(active || hovered) && (
              <Html position={[0, 0.26, 0]} center distanceFactor={13} transform>
                <button className={active ? 'zone-label active target-zone-label' : 'zone-label target-zone-label'} onClick={() => onSelectTarget(target.id)}>
                  <strong>{target.name}</strong>
                  <span>{target.description}</span>
                </button>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export { AttackTargetZones };
