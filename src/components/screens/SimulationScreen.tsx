import { Sparkles } from "lucide-react";
import { AttributeProfile } from "../AttributeProfile";
import { CoachConsole } from "../CoachConsole";
import { EventStream } from "../EventStream";
import { FormTimeline } from "../FormTimeline";
import { JourneyStrip } from "../JourneyStrip";
import { PhaseActionBar } from "../PhaseActionBar";
import { PhaseSimulator } from "../PhaseSimulator";
import { PlayerCard } from "../PlayerCard";
import { Scoreboard } from "../Scoreboard";
import { SeasonCalendar } from "../SeasonCalendar";
import { SessionManager } from "../SessionManager";
import { SquadTacticsPanel } from "../SquadTacticsPanel";
import { TopBar } from "../TopBar";
import { TrainingInterventions } from "../TrainingInterventions";
import { TrainingWeekPanel } from "../TrainingWeekPanel";
import type { Fixture } from "../../data/fixtures";
import type { PhaseActionId } from "../../game/actions";
import type { MatchState } from "../../game/matchState";
import type { PhaseObjective } from "../../game/objectives";
import type { OpponentPressure } from "../../game/pressure";
import type {
  Drill,
  EventLog,
  Player,
  SessionStep,
  Tactic,
  TrainingFocus,
} from "../../game/types";

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
  objective: PhaseObjective;
  momentum: number;
  pressure: OpponentPressure;
  matchState: MatchState;
  selectedActionId: PhaseActionId;
  selectedPlayerId: string;
  selectedTacticId: string;
  fixtures: Fixture[];
  activeWeek: number;
  selectedFocusId: string;
  hasSave: boolean;
  onSelectPlayer: (playerId: string) => void;
  onSelectTactic: (tacticId: string) => void;
  onSelectAction: (actionId: PhaseActionId) => void;
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
  const selectedTactic =
    props.tactics.find((tactic) => tactic.id === props.selectedTacticId) ??
    props.tactics[0];

  return (
    <main className="shell app-cockpit">
      <TopBar selection={props.selection} />

      <section className="mission-hero">
        <div className="mission-copy">
          <p className="eyebrow">
            <Sparkles size={16} /> Live player lab
          </p>
          <h1>Run a rugby career moment, then decide the next action.</h1>
          <p className="lede">
            A guided match simulator for building player form: prepare the
            athlete, run a phase, read the event stream, then train or recover
            before selection.
          </p>
          <button className="screen-cta inline-cta" onClick={props.onDebrief}>
            Open debrief
          </button>
        </div>
        <PlayerCard
          player={props.player}
          rating={props.rating}
          selection={props.selection}
        />
      </section>

      <JourneyStrip steps={props.sessionSteps} />
      <Scoreboard matchState={props.matchState} minute={props.minute} />

      <section className="command-grid">
        <div className="stage-stack">
          <PhaseSimulator
            minute={props.minute}
            phase={props.phase}
            fatigue={props.player.fatigue}
            confidence={props.player.confidence}
            player={props.player}
            squad={props.squad}
            tactic={selectedTactic}
            tactics={props.tactics}
            selectedPlayerId={props.selectedPlayerId}
            selectedTacticId={props.selectedTacticId}
            onSelectPlayer={props.onSelectPlayer}
            onSelectTactic={props.onSelectTactic}
            onSimulate={props.onSimulate}
            onRecover={props.onRecover}
            onReset={props.onReset}
          />
          <PhaseActionBar
            selectedActionId={props.selectedActionId}
            tactic={selectedTactic}
            pressure={props.pressure}
            onSelectAction={props.onSelectAction}
          />
        </div>
        <CoachConsole
          coachRead={props.coachRead}
          minute={props.minute}
          fatigue={props.player.fatigue}
          confidence={props.player.confidence}
          selection={props.selection}
          objective={props.objective}
          momentum={props.momentum}
          pressure={props.pressure}
          matchState={props.matchState}
        />
      </section>

      <section className="ops-grid">
        <SessionManager
          hasSave={props.hasSave}
          onSave={props.onSave}
          onLoad={props.onLoad}
          onClear={props.onClearSave}
        />
        <SeasonCalendar
          fixtures={props.fixtures}
          activeWeek={props.activeWeek}
          onSelectWeek={props.onSelectWeek}
        />
        <TrainingWeekPanel
          focuses={props.trainingFocuses}
          selectedFocusId={props.selectedFocusId}
          onSelectFocus={props.onSelectFocus}
          onApplyWeek={props.onApplyTrainingWeek}
        />
        <SquadTacticsPanel
          squad={props.squad}
          tactics={props.tactics}
          selectedPlayerId={props.selectedPlayerId}
          selectedTacticId={props.selectedTacticId}
          onSelectPlayer={props.onSelectPlayer}
          onSelectTactic={props.onSelectTactic}
        />
        <TrainingInterventions drills={props.drills} onTrain={props.onTrain} />
        <AttributeProfile player={props.player} />
        <FormTimeline form={props.player.form} />
        <EventStream logs={props.logs} />
      </section>
    </main>
  );
}

export { SimulationScreen };
