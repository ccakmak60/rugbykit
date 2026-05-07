# RugbyKit 3D model assets

Place optional GLB models in this directory to enable richer in-scene avatars.

## Expected filenames

- `coach.glb` → used by `CoachModel`
- `rugby-player.glb` → used by `PlayerModel`

When these files are absent, RugbyKit automatically falls back to procedural geometry avatars.

## Notes

- Keep files lightweight for browser performance.
- Use glTF/GLB assets with Y-up orientation.
- If your model scale is off, adjust `scale` on the relevant model component in `src/components/three/`.
