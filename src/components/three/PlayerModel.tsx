import { Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import type { GroupProps } from "@react-three/fiber";
import { checkAsset, getModelAsset } from "./assets";
import type { AssetStatus } from "./assets";

const playerAsset = getModelAsset("player");

type PlayerModelProps = GroupProps & {
  fallback: ReactNode;
  onStatusChange?: (status: AssetStatus) => void;
};

function PlayerModelInner(props: GroupProps) {
  const model = useGLTF(playerAsset.path);
  return <primitive object={model.scene.clone()} {...props} />;
}

function PlayerModel({ fallback, onStatusChange, ...props }: PlayerModelProps) {
  const [status, setStatus] = useState<AssetStatus>("checking");

  useEffect(() => {
    let active = true;
    onStatusChange?.("checking");

    checkAsset(playerAsset.path).then((exists) => {
      if (!active) return;
      const nextStatus: AssetStatus = exists ? "ready" : "missing";
      setStatus(nextStatus);
      onStatusChange?.(nextStatus);
    });

    return () => {
      active = false;
    };
  }, [onStatusChange]);

  if (status !== "ready") return <>{fallback}</>;

  return (
    <Suspense fallback={fallback}>
      <PlayerModelInner {...props} />
    </Suspense>
  );
}

useGLTF.preload(playerAsset.path);

export { PlayerModel };
