import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Vector3 } from 'three';

type CameraMode = 'broadcast' | 'overhead' | 'player' | 'coach';

type CameraRigProps = {
  mode: CameraMode;
};

const cameraPositions: Record<CameraMode, [number, number, number]> = {
  broadcast: [-12, 12, 16],
  overhead: [0, 22, 0.01],
  player: [-5.8, 3.6, 5.4],
  coach: [14, 10, -12]
};

const cameraTargets: Record<CameraMode, [number, number, number]> = {
  broadcast: [0, 0, 0],
  overhead: [0, 0, 0],
  player: [-1.5, 1.1, 0],
  coach: [0, 0, 0]
};

function CameraRig({ mode }: CameraRigProps) {
  const { camera } = useThree();
  const targetPosition = useMemo(() => new Vector3(...cameraPositions[mode]), [mode]);
  const lookTarget = useMemo(() => new Vector3(...cameraTargets[mode]), [mode]);

  useFrame(() => {
    camera.position.lerp(targetPosition, 0.045);
    camera.lookAt(lookTarget);
  });

  return null;
}

export { CameraRig };
export type { CameraMode };
