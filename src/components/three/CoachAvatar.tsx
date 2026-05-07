import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { Group } from "three";
import type { Tactic } from "../../game/types";
import type { AssetStatus } from "./assets";
import type { AnimationState } from "./animationState";
import { getAnimationIntensity, resolveAnimationState } from "./animationState";
import { CoachModel } from "./CoachModel";

type CoachAvatarProps = {
  tactic: Tactic;
  phase: string;
  fatigue: number;
  confidence: number;
  minute: number;
};

function PrimitiveCoach({
  status,
  state,
}: {
  status: AssetStatus;
  state: AnimationState;
}) {
  return (
    <>
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
      <mesh
        castShadow
        position={[0.34, 1.08, 0]}
        rotation-z={state === "pass" ? -1.05 : -0.8}
      >
        <capsuleGeometry args={[0.08, 0.7, 8, 12]} />
        <meshStandardMaterial color="#b9855d" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.58, 0.68, 48]} />
        <meshBasicMaterial
          color={state === "recover" ? "#f1c94b" : "#73d2ff"}
          transparent
          opacity={0.72}
        />
      </mesh>
      {status === "checking" && (
        <mesh position={[0, 2.26, 0]}>
          <sphereGeometry args={[0.06, 14, 14]} />
          <meshStandardMaterial
            color="#73d2ff"
            emissive="#73d2ff"
            emissiveIntensity={0.68}
          />
        </mesh>
      )}
    </>
  );
}

function CoachAvatar({
  tactic,
  phase,
  fatigue,
  confidence,
  minute,
}: CoachAvatarProps) {
  const group = useRef<Group>(null);
  const [open, setOpen] = useState(true);
  const [modelStatus, setModelStatus] = useState<AssetStatus>("checking");

  const animationState = useMemo(
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
  const intensity = getAnimationIntensity(animationState);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const baseTurn = animationState === "pass" ? -0.52 : -0.35;
    const sway = animationState === "recover" ? 0.03 : 0.08;
    group.current.rotation.y =
      baseTurn + Math.sin(clock.elapsedTime * (0.9 + intensity)) * sway;

    const nod =
      animationState === "recover"
        ? -0.07
        : animationState === "pass"
          ? 0.05
          : 0;
    group.current.rotation.x =
      nod + Math.sin(clock.elapsedTime * (0.8 + intensity * 1.1)) * 0.03;
  });

  return (
    <group
      ref={group}
      position={[13.2, 0, -4.8]}
      onClick={(event) => {
        event.stopPropagation();
        setOpen((current) => !current);
      }}
    >
      <CoachModel
        onStatusChange={setModelStatus}
        fallback={
          <PrimitiveCoach status={modelStatus} state={animationState} />
        }
      />
      {open && (
        <Html position={[-0.2, 2.55, 0]} center distanceFactor={10} transform>
          <div className="coach-card">
            <strong>Coach read</strong>
            <span>{phase}</span>
            <small>{tactic.detail}</small>
            <em>
              {animationState === "recover"
                ? "Tempo down. Reset shape and recover."
                : animationState === "pass"
                  ? "Move the ball early. Eyes on width."
                  : "Drive line speed and own collisions."}
            </em>
          </div>
        </Html>
      )}
    </group>
  );
}

export { CoachAvatar };
