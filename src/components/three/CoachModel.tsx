import { Suspense, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import type { GroupProps } from '@react-three/fiber';

type CoachModelProps = GroupProps & {
  fallback: ReactNode;
};

function CoachModelInner(props: GroupProps) {
  const model = useGLTF('/models/coach.glb');
  return <primitive object={model.scene.clone()} {...props} />;
}

function CoachModel({ fallback, ...props }: CoachModelProps) {
  const [assetExists, setAssetExists] = useState(false);

  useEffect(() => {
    fetch('/models/coach.glb', { method: 'HEAD' })
      .then((res) => setAssetExists(res.ok))
      .catch(() => setAssetExists(false));
  }, []);

  if (!assetExists) return <>{fallback}</>;

  return (
    <Suspense fallback={fallback}>
      <CoachModelInner {...props} />
    </Suspense>
  );
}

export { CoachModel };
