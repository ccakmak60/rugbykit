import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import type { Player, Tactic } from "../../game/types";
import { Ball } from "./Ball";
import { CameraRig } from "./CameraRig";
import type { CameraMode } from "./CameraRig";
import { CoachAvatar } from "./CoachAvatar";
import { RugbyAvatar } from "./RugbyAvatar";
import { RugbyPitch } from "./RugbyPitch";
import { TacticalZones } from "./TacticalZones";
import { TrainingGroundProps } from "./TrainingGroundProps";
import { getRoute } from "./phaseRoutes";
import { checkAsset, getModelAsset } from "./assets";
import type { AssetStatus } from "./assets";
import { getAnimationIntensity, resolveAnimationState } from "./animationState";
import type { AnimationState } from "./animationState";
import { useSceneAudio } from "./useSceneAudio";

const avatarSlots: [number, number, number][] = [
  [-8, 0, -2.8],
  [-7, 0, 2.4],
  [-3.5, 0, 0.6],
  [3.2, 0, -2.2],
  [5.6, 0, 2.8],
];

type SceneQuality = "low" | "medium" | "high";

type MatchSimulation3DProps = {
  minute: number;
  phase: string;
  fatigue: number;
  confidence: number;
  player: Player;
  squad: Player[];
  tactic: Tactic;
  tactics: Tactic[];
  selectedPlayerId: string;
  selectedTacticId: string;
  onSelectPlayer: (playerId: string) => void;
  onSelectTactic: (tacticId: string) => void;
  cameraMode: CameraMode;
  quality: SceneQuality;
};

type ScenarioProps = MatchSimulation3DProps & {
  audioEnabled: boolean;
};

function Scenario({
  minute,
  phase,
  fatigue,
  confidence,
  player,
  squad,
  tactic,
  tactics,
  selectedPlayerId,
  selectedTacticId,
  onSelectPlayer,
  onSelectTactic,
  cameraMode,
  audioEnabled,
  quality,
}: ScenarioProps) {
  const [inspectedPlayerId, setInspectedPlayerId] = useState(selectedPlayerId);
  const visibleSquad = squad.slice(0, avatarSlots.length);
  const activeRoute = getRoute(tactic);
  const environmentState: AnimationState = resolveAnimationState({
    selected: true,
    tactic,
    phase,
    fatigue,
    confidence,
    minute,
  });
  const environmentIntensity = getAnimationIntensity(environmentState);

  useSceneAudio({
    enabled: audioEnabled,
    animationState: environmentState,
    animationIntensity: environmentIntensity,
  });

  function inspectPlayer(playerId: string) {
    setInspectedPlayerId(playerId);
    onSelectPlayer(playerId);
  }

  return (
    <>
      <ambientLight intensity={quality === "low" ? 0.62 : 0.58} />
      <CameraRig mode={cameraMode} />
      <directionalLight
        position={[4, 10, 5]}
        intensity={1.7}
        castShadow={quality !== "low"}
        shadow-mapSize={quality === "high" ? [2048, 2048] : [1024, 1024]}
      />
      <spotLight
        position={[-6, 8, -6]}
        angle={0.45}
        penumbra={quality === "high" ? 0.8 : 0.6}
        intensity={quality === "low" ? 0.9 : 1.2}
        color="#b8ff6a"
      />
      <RugbyPitch
        tactic={tactic}
        animationState={environmentState}
        animationIntensity={environmentIntensity}
      />
      <TrainingGroundProps
        tactic={tactic}
        animationState={environmentState}
        animationIntensity={environmentIntensity}
        quality={quality}
      />
      <TacticalZones
        tactics={tactics}
        selectedTacticId={selectedTacticId}
        onSelectTactic={onSelectTactic}
        animationState={environmentState}
        animationIntensity={environmentIntensity}
      />
      <CoachAvatar
        tactic={tactic}
        phase={phase}
        fatigue={fatigue}
        confidence={confidence}
        minute={minute}
      />
      <Ball
        minute={minute}
        tactic={tactic}
        phase={phase}
        fatigue={fatigue}
        confidence={confidence}
      />
      {visibleSquad.map((member, index) => {
        const isSelected = member.id === selectedPlayerId;
        const animationState = resolveAnimationState({
          selected: isSelected,
          tactic,
          phase,
          fatigue,
          confidence,
          minute,
        });
        const animationIntensity = getAnimationIntensity(animationState);

        return (
          <RugbyAvatar
            key={member.id}
            player={member.id === player.id ? player : member}
            tactic={tactic}
            position={avatarSlots[index]}
            routeEnd={isSelected ? activeRoute.end : undefined}
            kitColor={member.unit === "backs" ? "#b8ff6a" : "#f1c94b"}
            selected={isSelected}
            inspected={member.id === inspectedPlayerId}
            animationState={isSelected ? animationState : "idle"}
            animationIntensity={isSelected ? animationIntensity : 0.2}
            onInspect={inspectPlayer}
          />
        );
      })}
      <mesh position={[0, 0.04, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[7.4, 7.5, 96]} />
        <meshBasicMaterial color="#eef7ef" transparent opacity={0.28} />
      </mesh>
    </>
  );
}

function MatchSimulation3D(props: MatchSimulation3DProps) {
  const [assetStatus, setAssetStatus] = useState<AssetStatus>("checking");
  const [audioEnabled, setAudioEnabled] = useState(false);

  const environmentState = useMemo(
    () =>
      resolveAnimationState({
        selected: true,
        tactic: props.tactic,
        phase: props.phase,
        fatigue: props.fatigue,
        confidence: props.confidence,
        minute: props.minute,
      }),
    [props.confidence, props.fatigue, props.minute, props.phase, props.tactic],
  );
  const environmentIntensity = getAnimationIntensity(environmentState);
  useEffect(() => {
    let active = true;

    Promise.all([
      checkAsset(getModelAsset("coach").path),
      checkAsset(getModelAsset("player").path),
    ]).then(([coachReady, playerReady]) => {
      if (!active) return;
      setAssetStatus(coachReady && playerReady ? "ready" : "missing");
    });

    return () => {
      active = false;
    };
  }, []);

  const canUseWebGL = (() => {
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      return false;
    }
  })();

  if (!canUseWebGL) {
    return (
      <div className="webgl-fallback">
        <div className={`asset-chip ${assetStatus}`}>
          {assetStatus === "checking" && "Checking model assets..."}
          {assetStatus === "ready" && "3D model assets available"}
          {assetStatus === "missing" && "Using procedural avatar fallback"}
        </div>
        <div className="fallback-pitch">
          <span className="fallback-line one" />
          <span className="fallback-line two" />
          <span className="fallback-line three" />
          <span className="fallback-player attacker primary" />
          <span className="fallback-player attacker support" />
          <span className="fallback-player defender one" />
          <span className="fallback-player defender two" />
          <span
            className="fallback-ball"
            style={{ left: `${12 + props.minute}%` }}
          />
        </div>
        <div className="fallback-copy">
          <strong>WebGL unavailable in this browser session.</strong>
          <span>
            Showing 2D match fallback. Open in a GPU/WebGL-enabled browser to
            see interactive avatars.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="three-shell">
      <div className={`asset-chip ${assetStatus}`}>
        {assetStatus === "checking" && "Checking model assets..."}
        {assetStatus === "ready" && "3D model assets available"}
        {assetStatus === "missing" && "No GLB models found (fallback active)"}
      </div>
      <div className="scene-state-hud" aria-live="polite">
        <strong>Scene state</strong>
        <span>
          {environmentState.toUpperCase()} · intensity{" "}
          {environmentIntensity.toFixed(2)}
        </span>
        <button
          className={audioEnabled ? "active" : ""}
          onClick={() => setAudioEnabled((current) => !current)}
        >
          {audioEnabled ? "Audio on" : "Audio off"}
        </button>
      </div>
      <Canvas
        shadows={props.quality !== "low"}
        dpr={
          props.quality === "high"
            ? [1, 2]
            : props.quality === "medium"
              ? [1, 1.5]
              : [1, 1.1]
        }
        camera={{
          position: [-12, 12, 16],
          fov: props.quality === "low" ? 46 : 43,
        }}
      >
        <Scenario {...props} audioEnabled={audioEnabled} />
      </Canvas>
    </div>
  );
}

export { MatchSimulation3D };
export type { MatchSimulation3DProps, SceneQuality };
