import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import type { Tactic } from "../../game/types";
import type { AnimationState } from "./animationState";

type TrainingGroundPropsProps = {
  tactic: Tactic;
  animationState: AnimationState;
  animationIntensity: number;
  quality: "low" | "medium" | "high";
};

function Cone({
  position,
  color,
  glow,
}: {
  position: [number, number, number];
  color: string;
  glow: number;
}) {
  return (
    <mesh castShadow position={position}>
      <coneGeometry args={[0.18, 0.48, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        emissive={color}
        emissiveIntensity={glow}
      />
    </mesh>
  );
}

function TackleBag({
  position,
  color = "#17251d",
  glow = 0.08,
}: {
  position: [number, number, number];
  color?: string;
  glow?: number;
}) {
  return (
    <mesh castShadow position={position} rotation-z={Math.PI / 2}>
      <capsuleGeometry args={[0.28, 1.3, 12, 18]} />
      <meshStandardMaterial
        color={color}
        roughness={0.58}
        emissive={color}
        emissiveIntensity={glow}
      />
    </mesh>
  );
}

function ScrumSled({
  position,
  accentColor,
  glow,
}: {
  position: [number, number, number];
  accentColor: string;
  glow: number;
}) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.38, 0]}>
        <boxGeometry args={[1.7, 0.3, 0.75]} />
        <meshStandardMaterial color="#25372d" roughness={0.62} />
      </mesh>
      <mesh castShadow position={[-0.7, 0.72, 0]}>
        <boxGeometry args={[0.24, 0.82, 0.75]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.5}
          emissive={accentColor}
          emissiveIntensity={glow}
        />
      </mesh>
      <mesh castShadow position={[0.7, 0.72, 0]}>
        <boxGeometry args={[0.24, 0.82, 0.75]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.5}
          emissive={accentColor}
          emissiveIntensity={glow}
        />
      </mesh>
    </group>
  );
}

function StadiumLight({
  position,
  color,
  intensity,
}: {
  position: [number, number, number];
  color: string;
  intensity: number;
}) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 4.8, 12]} />
        <meshStandardMaterial
          color="#8fa79a"
          roughness={0.42}
          metalness={0.25}
        />
      </mesh>
      <mesh castShadow position={[0, 4.92, 0]}>
        <boxGeometry args={[1.1, 0.25, 0.32]} />
        <meshStandardMaterial
          color="#eef7ef"
          emissive={color}
          emissiveIntensity={Math.max(0.2, intensity * 0.25)}
          roughness={0.25}
        />
      </mesh>
      <pointLight
        position={[0, 4.6, 0]}
        intensity={intensity}
        color={color}
        distance={14}
      />
    </group>
  );
}

function TrainingGroundProps({
  tactic,
  animationState,
  animationIntensity,
  quality,
}: TrainingGroundPropsProps) {
  const group = useRef<Group>(null);

  const theme = useMemo(() => {
    if (animationState === "recover") {
      return {
        coneColor: "#f1c94b",
        accentColor: "#f1c94b",
        bagColor: "#3a4a2e",
        lightColor: "#ffeab3",
      };
    }

    if (animationState === "pass") {
      return {
        coneColor: "#73d2ff",
        accentColor: "#73d2ff",
        bagColor: "#213a42",
        lightColor: "#c8eeff",
      };
    }

    if (tactic.emphasis === "power" || animationState === "run") {
      return {
        coneColor: "#ff7a59",
        accentColor: "#b8ff6a",
        bagColor: "#25372d",
        lightColor: "#dffff0",
      };
    }

    return {
      coneColor: "#d9a7ff",
      accentColor: "#d9a7ff",
      bagColor: "#31483a",
      lightColor: "#e6d2ff",
    };
  }, [animationState, tactic.emphasis]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const pulse =
      (Math.sin(clock.elapsedTime * (1 + animationIntensity * 1.4)) + 1) / 2;
    group.current.position.y =
      animationState === "run" ? pulse * 0.015 : pulse * 0.008;
  });

  const qualityScale =
    quality === "high" ? 1 : quality === "medium" ? 0.8 : 0.55;
  const coneGlow = (0.12 + animationIntensity * 0.35) * qualityScale;
  const propGlow = (0.08 + animationIntensity * 0.28) * qualityScale;
  const lightIntensity = (0.45 + animationIntensity * 0.45) * qualityScale;

  return (
    <group ref={group}>
      {[-10, -8.8, -7.6, 6.8, 8, 9.2]
        .slice(0, quality === "low" ? 4 : 6)
        .map((x, index) => (
          <Cone
            key={index}
            position={[x, 0.24, index < 3 ? -7.2 : 7.2]}
            color={theme.coneColor}
            glow={coneGlow}
          />
        ))}
      <TackleBag
        position={[-12.4, 0.42, -3.4]}
        color={theme.bagColor}
        glow={propGlow}
      />
      {quality !== "low" && (
        <TackleBag
          position={[-12.4, 0.42, -2.1]}
          color={theme.bagColor}
          glow={propGlow}
        />
      )}
      <TackleBag
        position={[12.5, 0.42, 3.1]}
        color={theme.bagColor}
        glow={propGlow}
      />
      <ScrumSled
        position={[11.8, 0, -5.7]}
        accentColor={theme.accentColor}
        glow={propGlow}
      />
      <StadiumLight
        position={[-14.2, 0, -8.2]}
        color={theme.lightColor}
        intensity={lightIntensity}
      />
      {quality !== "low" && (
        <StadiumLight
          position={[14.2, 0, 8.2]}
          color={theme.lightColor}
          intensity={lightIntensity}
        />
      )}
    </group>
  );
}

export { TrainingGroundProps };
