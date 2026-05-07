import { useMemo, useState } from "react";
import { BriefScreen } from "./components/screens/BriefScreen";
import { DebriefScreen } from "./components/screens/DebriefScreen";
import { HomeScreen } from "./components/screens/HomeScreen";
import { ModeSelectScreen } from "./components/screens/ModeSelectScreen";
import { SimulationScreen } from "./components/screens/SimulationScreen";
import { drills } from "./data/drills";
import { fixtures } from "./data/fixtures";
import { basePlayer, squad } from "./data/players";
import { tactics } from "./data/tactics";
import { trainingFocuses } from "./data/trainingFocuses";
import type { PhaseActionId } from "./game/actions";
import { applyLoadEvent, getLoadRisk, resolveLoadEvent } from "./game/injury";
import { getAttackTarget, getTargetModifier } from "./game/targets";
import type { AttackTargetId } from "./game/targets";
import { applyMatchStateOutcome, initialMatchState } from "./game/matchState";
import { evaluateObjective, getPhaseObjective } from "./game/objectives";
import { getOpponentPressure } from "./game/pressure";
import { applyTrainingWeek } from "./game/progression";
import {
  applyDrill,
  applyObjectiveResult,
  applyPhaseOutcome,
  clamp,
  getCoachRead,
  getSelection,
  getSessionSteps,
  ratePlayer,
  recoverPlayer,
  resolvePhase,
} from "./game/simulation";
import type { AppScreen } from "./game/session";
import {
  clearSession,
  hasSavedSession,
  loadSession,
  saveSession,
} from "./game/storage";
import type { Drill, EventLog, Player } from "./game/types";

function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [player, setPlayer] = useState<Player>(basePlayer);
  const [logs, setLogs] = useState<EventLog[]>([
    {
      minute: 0,
      title: "Simulation Ready",
      detail: "Select drills, run phases, track form.",
      impact: "Baseline profile loaded.",
    },
  ]);
  const [minute, setMinute] = useState(0);
  const [phase, setPhase] = useState("Set piece launch");
  const [selectedPlayerId, setSelectedPlayerId] = useState(basePlayer.id);
  const [selectedTacticId, setSelectedTacticId] = useState(tactics[0].id);
  const [selectedFocusId, setSelectedFocusId] = useState(trainingFocuses[0].id);
  const [week, setWeek] = useState(1);
  const [momentum, setMomentum] = useState(50);
  const [matchState, setMatchState] = useState(initialMatchState);
  const [selectedActionId, setSelectedActionId] =
    useState<PhaseActionId>("carry");
  const [selectedTargetId, setSelectedTargetId] =
    useState<AttackTargetId>("middle-channel");
  const [hasSave, setHasSave] = useState(() => hasSavedSession());

  const selectedTactic = useMemo(
    () => tactics.find((item) => item.id === selectedTacticId) ?? tactics[0],
    [selectedTacticId],
  );
  const [objective, setObjective] = useState(() =>
    getPhaseObjective(basePlayer, tactics[0], 0),
  );
  const [pressure, setPressure] = useState(() => getOpponentPressure(0, 50));
  const rating = useMemo(() => ratePlayer(player), [player]);
  const selection = useMemo(() => getSelection(rating), [rating]);
  const coachRead = useMemo(() => getCoachRead(rating), [rating]);
  const sessionSteps = useMemo(
    () => getSessionSteps(player, rating, selection, phase, minute),
    [minute, phase, player, rating, selection],
  );

  function train(drill: Drill) {
    setPlayer((current) => applyDrill(current, drill));
    setLogs((current) => [
      {
        minute,
        title: drill.label,
        detail: drill.note,
        impact: `+${drill.boost} ${drill.stat}, +${drill.fatigue} fatigue`,
      },
      ...current,
    ]);
  }

  function simulatePhase() {
    const outcome = resolvePhase(
      player,
      selectedTactic,
      momentum,
      pressure,
      minute,
      matchState,
      selectedActionId,
      selectedTargetId,
    );
    const result = evaluateObjective(objective, outcome);
    const nextMinute = Math.min(80, minute + 10);
    const loadRisk = getLoadRisk(
      player,
      selectedTactic,
      selectedActionId,
      selectedTargetId,
      pressure,
      minute,
    );
    const loadEvent = resolveLoadEvent(player, loadRisk);
    const nextPlayer = applyLoadEvent(
      applyObjectiveResult(applyPhaseOutcome(player, outcome), result),
      loadEvent,
    );
    const nextMomentum = clamp(momentum + result.momentumDelta);
    const nextObjective = getPhaseObjective(
      nextPlayer,
      selectedTactic,
      nextMinute,
    );
    const targetModifier = getTargetModifier(
      getAttackTarget(selectedTargetId),
      selectedTactic,
      selectedActionId,
      pressure,
      player,
      matchState,
    );
    const matchResult = applyMatchStateOutcome(
      matchState,
      outcome,
      result,
      pressure,
      nextMomentum,
      targetModifier,
    );
    const nextPressure = getOpponentPressure(nextMinute, nextMomentum);

    setMinute(nextMinute);
    setPhase(outcome.title);
    setPlayer(nextPlayer);
    setMomentum(nextMomentum);
    setObjective(nextObjective);
    setPressure(nextPressure);
    setMatchState(matchResult.matchState);
    setLogs((current) => [
      {
        minute: nextMinute,
        title: loadEvent.title,
        detail: loadEvent.detail,
        impact: `${loadEvent.impact}, risk ${loadRisk}`,
      },
      {
        minute: nextMinute,
        title: matchResult.title,
        detail: matchResult.detail,
        impact: matchResult.impact,
      },
      {
        minute: nextMinute,
        title: result.title,
        detail: result.detail,
        impact: result.impact,
      },
      {
        minute: nextMinute,
        title: `Defence read: ${pressure.name}`,
        detail: pressure.description,
        impact: `Next look: ${nextPressure.name}`,
      },
      {
        minute: nextMinute,
        title: outcome.title,
        detail: outcome.detail,
        impact: `${outcome.confidence > 0 ? "+" : ""}${outcome.confidence} confidence, +${outcome.fatigue} fatigue, ${outcome.gain}m gain`,
      },
      ...current,
    ]);
  }

  function selectPlayer(playerId: string) {
    const nextPlayer = squad.find((item) => item.id === playerId);
    if (!nextPlayer) return;
    setSelectedPlayerId(playerId);
    setPlayer(nextPlayer);
    setMinute(0);
    setPhase("Set piece launch");
    setMomentum(50);
    setMatchState(initialMatchState);
    setObjective(getPhaseObjective(nextPlayer, selectedTactic, 0));
    setPressure(getOpponentPressure(0, 50));
    setSelectedActionId("carry");
    setSelectedTargetId("middle-channel");
    setLogs([
      {
        minute: 0,
        title: "Player Selected",
        detail: `${nextPlayer.name} enters the active simulation lane.`,
        impact: `${nextPlayer.role}, ${nextPlayer.unit}`,
      },
    ]);
  }

  function recover() {
    const recovered = {
      ...recoverPlayer(player),
      condition:
        player.condition === "strained" && player.fatigue > 55
          ? ("knock" as const)
          : ("fit" as const),
    };
    setPlayer(recovered);
    setMomentum((current) => clamp(current + 4));
    setObjective(getPhaseObjective(recovered, selectedTactic, minute));
    setPressure(getOpponentPressure(minute, clamp(momentum + 4)));
    setLogs((current) => [
      {
        minute,
        title: "Recovery Block",
        detail: "Mobility, sleep, nutrition and review session.",
        impact:
          "-18 fatigue, +3 confidence, +4 momentum stability, condition improved",
      },
      ...current,
    ]);
  }

  function applyWeek() {
    const focus =
      trainingFocuses.find((item) => item.id === selectedFocusId) ??
      trainingFocuses[0];
    setPlayer((current) => applyTrainingWeek(current, focus));
    setLogs((current) => [
      {
        minute,
        title: focus.name,
        detail: focus.description,
        impact: "Weekly progression applied",
      },
      ...current,
    ]);
  }

  function resetSession() {
    setPlayer(basePlayer);
    setSelectedPlayerId(basePlayer.id);
    setSelectedTacticId(tactics[0].id);
    setSelectedFocusId(trainingFocuses[0].id);
    setWeek(1);
    setMomentum(50);
    setMatchState(initialMatchState);
    setMinute(0);
    setPhase("Set piece launch");
    setObjective(getPhaseObjective(basePlayer, tactics[0], 0));
    setPressure(getOpponentPressure(0, 50));
    setSelectedActionId("carry");
    setSelectedTargetId("middle-channel");
    setLogs([
      {
        minute: 0,
        title: "Simulation Reset",
        detail: "Player profile restored.",
        impact: "Baseline profile loaded.",
      },
    ]);
  }

  function restartFlow() {
    resetSession();
    setScreen("home");
  }

  function saveCurrentSession() {
    saveSession({
      screen,
      player,
      logs,
      minute,
      phase,
      selectedPlayerId,
      selectedTacticId,
      selectedFocusId,
      week,
      momentum,
      objective,
      pressure,
      matchState,
      selectedActionId,
      selectedTargetId,
      savedAt: new Date().toISOString(),
    });
    setHasSave(true);
  }

  function loadSavedSession() {
    const snapshot = loadSession();
    if (!snapshot) return;
    setScreen(snapshot.screen);
    setPlayer(snapshot.player);
    setLogs(snapshot.logs);
    setMinute(snapshot.minute);
    setPhase(snapshot.phase);
    setSelectedPlayerId(snapshot.selectedPlayerId);
    setSelectedTacticId(snapshot.selectedTacticId);
    setSelectedFocusId(snapshot.selectedFocusId);
    setWeek(snapshot.week);
    setMomentum(snapshot.momentum ?? 50);
    setObjective(
      snapshot.objective ??
        getPhaseObjective(
          snapshot.player,
          tactics.find((item) => item.id === snapshot.selectedTacticId) ??
            tactics[0],
          snapshot.minute,
        ),
    );
    setPressure(
      snapshot.pressure ??
        getOpponentPressure(snapshot.minute, snapshot.momentum ?? 50),
    );
    setMatchState(snapshot.matchState ?? initialMatchState);
    setSelectedActionId(snapshot.selectedActionId ?? "carry");
    setSelectedTargetId(snapshot.selectedTargetId ?? "middle-channel");
    setHasSave(true);
  }

  function clearSavedSession() {
    clearSession();
    setHasSave(false);
  }

  if (screen === "home")
    return <HomeScreen onStart={() => setScreen("mode")} />;
  if (screen === "mode")
    return (
      <ModeSelectScreen
        onBack={() => setScreen("home")}
        onContinue={() => setScreen("brief")}
      />
    );
  if (screen === "brief")
    return (
      <BriefScreen
        player={player}
        tactic={selectedTactic}
        onBack={() => setScreen("mode")}
        onLaunch={() => setScreen("simulation")}
      />
    );
  if (screen === "debrief")
    return (
      <DebriefScreen
        player={player}
        rating={rating}
        selection={selection}
        logs={logs}
        matchState={matchState}
        momentum={momentum}
        minute={minute}
        onBackToSim={() => setScreen("simulation")}
        onRestart={restartFlow}
      />
    );

  return (
    <SimulationScreen
      player={player}
      squad={squad}
      tactics={tactics}
      trainingFocuses={trainingFocuses}
      drills={drills}
      logs={logs}
      minute={minute}
      phase={phase}
      rating={rating}
      selection={selection}
      coachRead={coachRead}
      sessionSteps={sessionSteps}
      objective={objective}
      momentum={momentum}
      pressure={pressure}
      matchState={matchState}
      selectedActionId={selectedActionId}
      selectedTargetId={selectedTargetId}
      onSelectAction={setSelectedActionId}
      onSelectTarget={setSelectedTargetId}
      selectedPlayerId={selectedPlayerId}
      selectedTacticId={selectedTacticId}
      selectedFocusId={selectedFocusId}
      fixtures={fixtures}
      activeWeek={week}
      hasSave={hasSave}
      onSelectPlayer={selectPlayer}
      onSelectTactic={setSelectedTacticId}
      onSelectFocus={setSelectedFocusId}
      onApplyTrainingWeek={applyWeek}
      onSelectWeek={setWeek}
      onSave={saveCurrentSession}
      onLoad={loadSavedSession}
      onClearSave={clearSavedSession}
      onTrain={train}
      onSimulate={simulatePhase}
      onRecover={recover}
      onReset={resetSession}
      onDebrief={() => setScreen("debrief")}
    />
  );
}

export { App };
