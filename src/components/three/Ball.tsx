import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { Vector3 } from "three";
import type { Tactic } from "../../game/types";
import { getAnimationIntensity, resolveAnimationState } from "./animationState";
import { getRoute } from "./phaseRoutes";

type BallProps = {
  minute: number;
  tactic: Tactic;
  phase: string;
  fatigue: number;
  confidence: number;
};

function Ball({ minute, tactic, phase, fatigue, confidence }: BallProps) {
  const mesh = useRef<Mesh>(null);
  const state = useMemo(
    () =>
      resolveAnimationState({
        selected: true,
        tactic,
        phase,
        fatigue,
        confidence,
        minute,
      }),
    [confidence, fatigue, minute, phase, tactic],
  );
  const intensity = getAnimationIntensity(state);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const route = getRoute(tactic);
    const start = new Vector3(...route.ballStart);
    const end = new Vector3(...route.ballEnd);
    const pulse =
      (Math.sin(clock.elapsedTime * (1 + intensity * 1.6) + minute * 0.18) +
        1) /
      2;
    mesh.current.position.lerpVectors(start, end, pulse);

    const arc = state === "pass" ? 0.88 : state === "run" ? 0.55 : 0.32;
    mesh.current.position.y += Math.sin(pulse * Math.PI) * arc;
    mesh.current.rotation.x += 0.06 + intensity * 0.04;
    mesh.current.rotation.z += 0.03 + intensity * 0.03;
  });

  return (
    <mesh
      ref={mesh}
      castShadow
      position={[-10, 0.55, 0]}
      scale={[0.5, 0.32, 0.32]}
    >
      <sphereGeometry args={[0.38, 24, 16]} />
      <meshStandardMaterial color="#d78b3d" roughness={0.52} />
    </mesh>
  );
}

export { Ball };
