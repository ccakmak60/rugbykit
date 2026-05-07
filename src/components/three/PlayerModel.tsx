import { Suspense, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import type { GroupProps } from '@react-three/fiber';

type PlayerModelProps = GroupProps & {
  fallback: ReactNode;
};

function PlayerModelInner(props: GroupProps) {
  const model = useGLTF('/models/rugby-player.glb');
  return <primitive object={model.scene.clone()} {...props} />;
}

function PlayerModel({ fallback, ...props }: PlayerModelProps) {
  const [assetExists, setAssetExists] = useState(false);

  useEffect(() => {
    fetch('/models/rugby-player.glb', { method: 'HEAD' })
      .then((res) => setAssetExists(res.ok))
      .catch(() => setAssetExists(false));
  }, []);

  if (!assetExists) return <>{fallback}</>;

  return (
    <Suspense fallback={fallback}>
      <PlayerModelInner {...props} />
    </Suspense>
  );
}

export { PlayerModel };
