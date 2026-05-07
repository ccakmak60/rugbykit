import { Canvas } from '@react-three/fiber';
import { Ball } from './Ball';
import { RugbyPitch } from './RugbyPitch';
import { Runner } from './Runner';

type MatchSimulation3DProps = {
  minute: number;
  phase: string;
  fatigue: number;
  confidence: number;
};

function Scenario({ minute, fatigue, confidence }: MatchSimulation3DProps) {
  const attackingSpeed = Math.max(0.45, 1.4 - fatigue / 120);
  const pressureSpeed = Math.max(0.55, 1 + confidence / 140);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 10, 5]} intensity={1.7} castShadow shadow-mapSize={[2048, 2048]} />
      <RugbyPitch />
      <Ball minute={minute} />
      <Runner color="#b8ff6a" start={[-11, 0.58, -2.5]} target={[10, 0.58, -5.8]} speed={attackingSpeed} />
      <Runner color="#eaf8ef" start={[-12, 0.58, 1.8]} target={[7, 0.58, 3.8]} speed={attackingSpeed * 0.86} />
      <Runner color="#f1c94b" start={[-8, 0.58, 4.8]} target={[12, 0.58, 6.8]} speed={attackingSpeed * 1.08} />
      <Runner color="#18251f" start={[4, 0.58, -6]} target={[-7, 0.58, -2.1]} speed={pressureSpeed} />
      <Runner color="#25372d" start={[7, 0.58, 0.4]} target={[-5, 0.58, 1.2]} speed={pressureSpeed * 0.92} />
      <Runner color="#31483a" start={[9, 0.58, 5.2]} target={[-2, 0.58, 4.2]} speed={pressureSpeed * 0.8} />
      <mesh position={[0, 0.04, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[7.4, 7.5, 96]} />
        <meshBasicMaterial color="#eef7ef" transparent opacity={0.38} />
      </mesh>
    </>
  );
}

function MatchSimulation3D(props: MatchSimulation3DProps) {
  const canUseWebGL = (() => {
    try {
      const canvas = document.createElement('canvas');
      return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      return false;
    }
  })();

  if (!canUseWebGL) {
    return (
      <div className="webgl-fallback">
        <div className="fallback-pitch">
          <span className="fallback-line one" />
          <span className="fallback-line two" />
          <span className="fallback-line three" />
          <span className="fallback-player attacker primary" />
          <span className="fallback-player attacker support" />
          <span className="fallback-player defender one" />
          <span className="fallback-player defender two" />
          <span className="fallback-ball" style={{ left: `${12 + props.minute}%` }} />
        </div>
        <div className="fallback-copy">
          <strong>WebGL unavailable in this browser session.</strong>
          <span>Showing 2D match fallback. Open in a GPU/WebGL-enabled browser to see Three.js.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="three-shell">
      <Canvas shadows camera={{ position: [-12, 14, 18], fov: 44 }}>
        <Scenario {...props} />
      </Canvas>
    </div>
  );
}

export { MatchSimulation3D };
export type { MatchSimulation3DProps };
