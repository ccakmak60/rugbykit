import { Activity, Play, RotateCcw } from 'lucide-react';
import { Component, lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import type { Player, Tactic } from '../game/types';

const MatchSimulation3D = lazy(() => import('./three/MatchSimulation3D').then((module) => ({ default: module.MatchSimulation3D })));

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
  selectedPlayerId: string;
  onSelectPlayer: (playerId: string) => void;
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
          <span>Player simulation controls still work. Check browser console for WebGL/module error.</span>
        </div>
      );
    }

    return this.props.children;
  }
}

function PhaseSimulator({ minute, phase, fatigue, confidence, player, squad, tactic, selectedPlayerId, onSelectPlayer, onSimulate, onRecover, onReset }: PhaseSimulatorProps) {
  return (
    <article className="panel stage-panel">
      <div className="panel-head">
        <div>
          <span className="kicker">match environment</span>
          <h2>Phase simulator</h2>
        </div>
        <div className="actions compact-actions">
          <button onClick={onSimulate}><Play size={18} /> Run phase</button>
          <button className="secondary" onClick={onRecover}><Activity size={18} /> Recover</button>
          <button className="ghost" onClick={onReset}><RotateCcw size={18} /> Reset</button>
        </div>
      </div>

      <div className="three-stage">
        <SceneBoundary>
          <Suspense fallback={<div className="scene-fallback"><strong>Loading 3D match scene...</strong></div>}>
            <MatchSimulation3D minute={minute} phase={phase} fatigue={fatigue} confidence={confidence} player={player} squad={squad} tactic={tactic} selectedPlayerId={selectedPlayerId} onSelectPlayer={onSelectPlayer} />
          </Suspense>
        </SceneBoundary>
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
