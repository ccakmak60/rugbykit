import { Activity, Gauge, Play, RotateCcw, Video } from "lucide-react";
import { Component, lazy, Suspense, useState } from "react";
import type { ReactNode } from "react";
import type { Player, Tactic } from "../game/types";
import type { CameraMode } from "./three/CameraRig";
import type { SceneQuality } from "./three/MatchSimulation3D";

const MatchSimulation3D = lazy(() =>
  import("./three/MatchSimulation3D").then((module) => ({
    default: module.MatchSimulation3D,
  })),
);

const cameraModes: { id: CameraMode; label: string }[] = [
  { id: "broadcast", label: "Broadcast" },
  { id: "overhead", label: "Tactical" },
  { id: "player", label: "Player cam" },
  { id: "coach", label: "Coach box" },
];

const qualityModes: { id: SceneQuality; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

type SceneBoundaryProps = {
  children: ReactNode;
};

type SceneBoundaryState = {
  hasError: boolean;
};

type PhaseSimulatorProps = {
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
  onSimulate: () => void;
  onRecover: () => void;
  onReset: () => void;
};

class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="scene-fallback">
          <strong>3D scene failed to load.</strong>
          <span>
            Player simulation controls still work. Check browser console for
            WebGL/module error.
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}

function PhaseSimulator({
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
  onSimulate,
  onRecover,
  onReset,
}: PhaseSimulatorProps) {
  const [cameraMode, setCameraMode] = useState<CameraMode>("broadcast");
  const [quality, setQuality] = useState<SceneQuality>("medium");

  return (
    <article className="panel stage-panel">
      <div className="panel-head">
        <div>
          <span className="kicker">match environment</span>
          <h2>Phase simulator</h2>
        </div>
        <div className="actions compact-actions">
          <button onClick={onSimulate}>
            <Play size={18} /> Run phase
          </button>
          <button className="secondary" onClick={onRecover}>
            <Activity size={18} /> Recover
          </button>
          <button className="ghost" onClick={onReset}>
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>

      <div className="three-stage">
        <div className="scene-frame">
          <SceneBoundary>
            <Suspense
              fallback={
                <div className="scene-fallback">
                  <strong>Loading 3D match scene...</strong>
                </div>
              }
            >
              <MatchSimulation3D
                minute={minute}
                phase={phase}
                fatigue={fatigue}
                confidence={confidence}
                player={player}
                squad={squad}
                tactic={tactic}
                tactics={tactics}
                selectedPlayerId={selectedPlayerId}
                selectedTacticId={selectedTacticId}
                onSelectPlayer={onSelectPlayer}
                onSelectTactic={onSelectTactic}
                cameraMode={cameraMode}
                quality={quality}
              />
            </Suspense>
          </SceneBoundary>
          <div className="camera-controls">
            <span>
              <Video size={13} /> Camera
            </span>
            {cameraModes.map((mode) => (
              <button
                className={mode.id === cameraMode ? "active" : ""}
                key={mode.id}
                onClick={() => setCameraMode(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <div className="quality-controls">
            <span>
              <Gauge size={13} /> Quality
            </span>
            {qualityModes.map((mode) => (
              <button
                className={mode.id === quality ? "active" : ""}
                key={mode.id}
                onClick={() => setQuality(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        <div className="three-hud">
          <strong>{phase}</strong>
          <span>Minute {minute}'</span>
          <span>Fatigue {fatigue}%</span>
          <span>Confidence {confidence}%</span>
        </div>
      </div>
    </article>
  );
}

export { PhaseSimulator };
