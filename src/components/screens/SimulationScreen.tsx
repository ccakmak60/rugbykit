import { Sparkles } from 'lucide-react';
import { AttributeProfile } from '../AttributeProfile';
import { CoachConsole } from '../CoachConsole';
import { EventStream } from '../EventStream';
import { FormTimeline } from '../FormTimeline';
import { JourneyStrip } from '../JourneyStrip';
import { PhaseSimulator } from '../PhaseSimulator';
import { PlayerCard } from '../PlayerCard';
import { SeasonCalendar } from '../SeasonCalendar';
import { SessionManager } from '../SessionManager';
import { SquadTacticsPanel } from '../SquadTacticsPanel';
import { TopBar } from '../TopBar';
import { TrainingInterventions } from '../TrainingInterventions';
import { TrainingWeekPanel } from '../TrainingWeekPanel';
import type { Fixture } from '../../data/fixtures';
import type { Drill, EventLog, Player, SessionStep, Tactic, TrainingFocus } from '../../game/types';

type SimulationScreenProps = {
  player: Player;
  squad: Player[];
  tactics: Tactic[];
  trainingFocuses: TrainingFocus[];
  drills: Drill[];
  logs: EventLog[];
  minute: number;
  phase: string;
  rating: number;
  selection: string;
  coachRead: string;
  sessionSteps: SessionStep[];
  selectedPlayerId: string;
  selectedTacticId: string;
  fixtures: Fixture[];
  activeWeek: number;
  selectedFocusId: string;
  hasSave: boolean;
  onSelectPlayer: (playerId: string) => void;
  onSelectTactic: (tacticId: string) => void;
  onSelectWeek: (week: number) => void;
  onSelectFocus: (focusId: string) => void;
  onApplyTrainingWeek: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClearSave: () => void;
  onTrain: (drill: Drill) => void;
  onSimulate: () => void;
  onRecover: () => void;
  onReset: () => void;
  onDebrief: () => void;
};

function SimulationScreen(props: SimulationScreenProps) {
  return (
    <main className="shell app-cockpit">
      <TopBar selection={props.selection} />

      <section className="mission-hero">
        <div className="mission-copy">
          <p className="eyebrow"><Sparkles size={16} /> Live player lab</p>
          <h1>Run a rugby career moment, then decide the next action.</h1>
          <p className="lede">A guided match simulator for building player form: prepare the athlete, run a phase, read the event stream, then train or recover before selection.</p>
          <button className="screen-cta inline-cta" onClick={props.onDebrief}>Open debrief</button>
        </div>
        <PlayerCard player={props.player} rating={props.rating} selection={props.selection} />
      </section>

      <JourneyStrip steps={props.sessionSteps} />

      <section className="command-grid">
        <PhaseSimulator minute={props.minute} phase={props.phase} fatigue={props.player.fatigue} confidence={props.player.confidence} onSimulate={props.onSimulate} onRecover={props.onRecover} onReset={props.onReset} />
        <CoachConsole coachRead={props.coachRead} minute={props.minute} fatigue={props.player.fatigue} confidence={props.player.confidence} selection={props.selection} />
      </section>

      <section className="ops-grid">
        <SessionManager hasSave={props.hasSave} onSave={props.onSave} onLoad={props.onLoad} onClear={props.onClearSave} />
        <SeasonCalendar fixtures={props.fixtures} activeWeek={props.activeWeek} onSelectWeek={props.onSelectWeek} />
        <TrainingWeekPanel focuses={props.trainingFocuses} selectedFocusId={props.selectedFocusId} onSelectFocus={props.onSelectFocus} onApplyWeek={props.onApplyTrainingWeek} />
        <SquadTacticsPanel squad={props.squad} tactics={props.tactics} selectedPlayerId={props.selectedPlayerId} selectedTacticId={props.selectedTacticId} onSelectPlayer={props.onSelectPlayer} onSelectTactic={props.onSelectTactic} />
        <TrainingInterventions drills={props.drills} onTrain={props.onTrain} />
        <AttributeProfile player={props.player} />
        <FormTimeline form={props.player.form} />
        <EventStream logs={props.logs} />
      </section>
    </main>
  );
}

export { SimulationScreen };
