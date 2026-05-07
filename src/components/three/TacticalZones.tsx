import { Html } from '@react-three/drei';
import { useState } from 'react';
import type { Tactic } from '../../game/types';

type TacticalZonesProps = {
  tactics: Tactic[];
  selectedTacticId: string;
  onSelectTactic: (tacticId: string) => void;
};

const zoneLayout: Record<string, { position: [number, number, number]; size: [number, number]; color: string }> = {
  'wide-pod': { position: [7.5, 0.045, -6.2], size: [9, 3.4], color: '#b8ff6a' },
  'carry-hard': { position: [-1.5, 0.046, 0], size: [8, 5.2], color: '#f1c94b' },
  'kick-chase': { position: [-9, 0.047, 6.2], size: [9, 3.4], color: '#73d2ff' },
  'defensive-set': { position: [12.3, 0.048, 0], size: [5, 8], color: '#ff7a59' },
  'tempo-shift': { position: [-8.5, 0.049, -5.7], size: [8, 3.8], color: '#d9a7ff' }
};

function TacticalZones({ tactics, selectedTacticId, onSelectTactic }: TacticalZonesProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <group>
      {tactics.map((tactic) => {
        const zone = zoneLayout[tactic.id];
        if (!zone) return null;
        const active = selectedTacticId === tactic.id;
        const hovered = hoveredId === tactic.id;

        return (
          <group key={tactic.id} position={zone.position}>
            <mesh
              rotation-x={-Math.PI / 2}
              onClick={(event) => { event.stopPropagation(); onSelectTactic(tactic.id); }}
              onPointerEnter={(event) => { event.stopPropagation(); setHoveredId(tactic.id); }}
              onPointerLeave={() => setHoveredId(null)}
            >
              <planeGeometry args={zone.size} />
              <meshBasicMaterial color={zone.color} transparent opacity={active ? 0.25 : hovered ? 0.18 : 0.08} />
            </mesh>
            <Html position={[0, 0.22, 0]} center distanceFactor={12} transform>
              <button className={active ? 'zone-label active' : 'zone-label'} onClick={() => onSelectTactic(tactic.id)}>
                <strong>{tactic.phase}</strong>
                <span>{tactic.name}</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export { TacticalZones };
