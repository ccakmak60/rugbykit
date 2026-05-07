import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type {
  MeshStandardMaterial,
  MeshBasicMaterial,
  ColorRepresentation,
} from "three";
import { Color } from "three";
import type { Tactic } from "../../game/types";
import type { AnimationState } from "./animationState";

type RugbyPitchProps = {
  tactic: Tactic;
  animationState: AnimationState;
  animationIntensity: number;
};

function RugbyPitch({
  tactic,
  animationState,
  animationIntensity,
}: RugbyPitchProps) {
  const grassRef = useRef<MeshStandardMaterial>(null);
  const leftTryRef = useRef<MeshBasicMaterial>(null);
  const rightTryRef = useRef<MeshBasicMaterial>(null);
  const lineRefs = useRef<MeshBasicMaterial[]>([]);
  const grassTargetRef = useRef(new Color());
  const lineTargetRef = useRef(new Color());
  const leftTryTargetRef = useRef(new Color());
  const rightTryTargetRef = useRef(new Color());

  const theme = useMemo(() => {
    if (animationState === "recover") {
      return {
        grass: "#325322" as ColorRepresentation,
        line: "#fff6d8" as ColorRepresentation,
        leftTry: "#f1c94b" as ColorRepresentation,
        rightTry: "#f1c94b" as ColorRepresentation,
      };
    }

    if (animationState === "pass") {
      return {
        grass: "#17484a" as ColorRepresentation,
        line: "#e6fbff" as ColorRepresentation,
        leftTry: "#73d2ff" as ColorRepresentation,
        rightTry: "#73d2ff" as ColorRepresentation,
      };
    }

    if (tactic.emphasis === "power") {
      return {
        grass: "#25502a" as ColorRepresentation,
        line: "#f7f3df" as ColorRepresentation,
        leftTry: "#b8ff6a" as ColorRepresentation,
        rightTry: "#f1c94b" as ColorRepresentation,
      };
    }

    return {
      grass: "#14552a" as ColorRepresentation,
      line: "#eef7ef" as ColorRepresentation,
      leftTry: "#b8ff6a" as ColorRepresentation,
      rightTry: "#f1c94b" as ColorRepresentation,
    };
  }, [animationState, tactic.emphasis]);

  useFrame(() => {
    const lineOpacity = 0.66 + animationIntensity * 0.2;
    grassTargetRef.current.set(theme.grass);
    lineTargetRef.current.set(theme.line);
    leftTryTargetRef.current.set(theme.leftTry);
    rightTryTargetRef.current.set(theme.rightTry);

    if (grassRef.current) {
      grassRef.current.color.lerp(grassTargetRef.current, 0.08);
    }

    if (leftTryRef.current) {
      leftTryRef.current.color.lerp(leftTryTargetRef.current, 0.08);
      leftTryRef.current.opacity +=
        (0.7 + animationIntensity * 0.1 - leftTryRef.current.opacity) * 0.12;
    }

    if (rightTryRef.current) {
      rightTryRef.current.color.lerp(rightTryTargetRef.current, 0.08);
      rightTryRef.current.opacity +=
        (0.7 + animationIntensity * 0.1 - rightTryRef.current.opacity) * 0.12;
    }

    lineRefs.current.forEach((material) => {
      material.color.lerp(lineTargetRef.current, 0.08);
      material.opacity += (lineOpacity - material.opacity) * 0.12;
    });
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[34, 20]} />
        <meshStandardMaterial
          ref={grassRef}
          color={theme.grass}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>
      {[-15, -10, -5, 0, 5, 10, 15].map((x) => (
        <mesh key={x} position={[x, 0.018, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.06, 20]} />
          <meshBasicMaterial
            ref={(material) => {
              if (!material) return;
              lineRefs.current[x + 15] = material;
            }}
            color={theme.line}
            transparent
            opacity={0.74}
          />
        </mesh>
      ))}
      {[-9, 0, 9].map((z, index) => (
        <mesh key={z} position={[0, 0.02, z]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[34, 0.05]} />
          <meshBasicMaterial
            ref={(material) => {
              if (!material) return;
              lineRefs.current[20 + index] = material;
            }}
            color={theme.line}
            transparent
            opacity={0.74}
          />
        </mesh>
      ))}
      <mesh position={[-16.2, 0.08, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.18, 18]} />
        <meshBasicMaterial
          ref={leftTryRef}
          color={theme.leftTry}
          transparent
          opacity={0.74}
        />
      </mesh>
      <mesh position={[16.2, 0.08, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.18, 18]} />
        <meshBasicMaterial
          ref={rightTryRef}
          color={theme.rightTry}
          transparent
          opacity={0.74}
        />
      </mesh>
    </group>
  );
}

export { RugbyPitch };
