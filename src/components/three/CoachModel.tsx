import { Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import type { GroupProps } from "@react-three/fiber";
import { checkAsset, getModelAsset } from "./assets";
import type { AssetStatus } from "./assets";

const coachAsset = getModelAsset("coach");

type CoachModelProps = GroupProps & {
  fallback: ReactNode;
  onStatusChange?: (status: AssetStatus) => void;
};

function CoachModelInner(props: GroupProps) {
  const model = useGLTF(coachAsset.path);
  return <primitive object={model.scene.clone()} {...props} />;
}

function CoachModel({ fallback, onStatusChange, ...props }: CoachModelProps) {
  const [status, setStatus] = useState<AssetStatus>("checking");

  useEffect(() => {
    let active = true;
    onStatusChange?.("checking");

    checkAsset(coachAsset.path).then((exists) => {
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
      <CoachModelInner {...props} />
    </Suspense>
  );
}

useGLTF.preload(coachAsset.path);

export { CoachModel };
