type ModelAssetId = 'coach' | 'player';

type ModelAsset = {
  id: ModelAssetId;
  path: string;
  label: string;
};

type AssetStatus = 'checking' | 'ready' | 'missing';

const modelAssets: Record<ModelAssetId, ModelAsset> = {
  coach: {
    id: 'coach',
    path: '/models/coach.glb',
    label: 'Coach model'
  },
  player: {
    id: 'player',
    path: '/models/rugby-player.glb',
    label: 'Player model'
  }
};

function getModelAsset(id: ModelAssetId): ModelAsset {
  return modelAssets[id];
}

async function checkAsset(path: string): Promise<boolean> {
  try {
    const head = await fetch(path, { method: 'HEAD' });
    if (head.ok) return true;
  } catch {
    // ignore and attempt GET fallback
  }

  try {
    const get = await fetch(path, { method: 'GET' });
    return get.ok;
  } catch {
    return false;
  }
}

export { getModelAsset, checkAsset };
export type { AssetStatus, ModelAsset, ModelAssetId };
