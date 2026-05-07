import type { MatchState } from './matchState';
import type { OpponentPressure } from './pressure';
import type { Player, PlayerTraitId, Tactic } from './types';

type PlayerTrait = {
  id: PlayerTraitId;
  name: string;
  description: string;
};

type TraitModifier = {
  scoreDelta: number;
  gainDelta: number;
  fatigueDelta: number;
  confidenceDelta: number;
  reads: string[];
};

const traitCatalog: Record<PlayerTraitId, PlayerTrait> = {
  'explosive-runner': {
    id: 'explosive-runner',
    name: 'Explosive Runner',
    description: 'Creates extra metres when attacking space or tempo.'
  },
  'collision-winner': {
    id: 'collision-winner',
    name: 'Collision Winner',
    description: 'Wins contact and protects confidence in carry-heavy phases.'
  },
  'composed-kicker': {
    id: 'composed-kicker',
    name: 'Composed Kicker',
    description: 'Finds territory and reduces kick-pressure risk.'
  },
  'defensive-leader': {
    id: 'defensive-leader',
    name: 'Defensive Leader',
    description: 'Stabilises pressure moments and red-zone reads.'
  },
  'high-motor': {
    id: 'high-motor',
    name: 'High Motor',
    description: 'Absorbs workload and keeps late-phase fatigue under control.'
  },
  'big-match-temperament': {
    id: 'big-match-temperament',
    name: 'Big Match Temperament',
    description: 'Lifts execution when chasing or late in the match.'
  }
};

const emptyModifier: TraitModifier = {
  scoreDelta: 0,
  gainDelta: 0,
  fatigueDelta: 0,
  confidenceDelta: 0,
  reads: []
};

function getPlayerTraits(player: Player): PlayerTrait[] {
  return (player.traits ?? []).map((traitId) => traitCatalog[traitId]).filter(Boolean);
}

function getTraitModifier(player: Player, tactic: Tactic, pressure: OpponentPressure | undefined, minute: number, matchState?: MatchState): TraitModifier {
  return (player.traits ?? []).reduce<TraitModifier>((modifier, traitId) => {
    if (traitId === 'explosive-runner' && ['wide-pod', 'tempo-shift'].includes(tactic.id)) {
      modifier.scoreDelta += 5;
      modifier.gainDelta += 3;
      modifier.reads.push('Explosive Runner found space outside the defensive shoulder.');
    }

    if (traitId === 'collision-winner' && tactic.id === 'carry-hard') {
      modifier.scoreDelta += pressure?.id === 'jackal-threat' ? 6 : 4;
      modifier.gainDelta += 2;
      modifier.confidenceDelta += 1;
      modifier.reads.push('Collision Winner protected the carry through contact.');
    }

    if (traitId === 'composed-kicker' && tactic.id === 'kick-chase') {
      modifier.scoreDelta += pressure?.id === 'kick-pressure' ? 7 : 4;
      modifier.gainDelta += 5;
      modifier.fatigueDelta -= 1;
      modifier.reads.push('Composed Kicker turned pressure into territory.');
    }

    if (traitId === 'defensive-leader' && pressure?.id === 'red-zone-squeeze') {
      modifier.scoreDelta += 5;
      modifier.confidenceDelta += 2;
      modifier.reads.push('Defensive Leader kept the group composed in the squeeze.');
    }

    if (traitId === 'high-motor') {
      modifier.fatigueDelta -= minute >= 50 ? 3 : 2;
      if (minute >= 50) modifier.scoreDelta += 2;
      modifier.reads.push('High Motor reduced the phase load.');
    }

    if (traitId === 'big-match-temperament' && (minute >= 60 || (matchState && matchState.teamScore < matchState.opponentScore))) {
      modifier.scoreDelta += 5;
      modifier.confidenceDelta += 2;
      modifier.reads.push('Big Match Temperament lifted the late-game execution.');
    }

    return modifier;
  }, { ...emptyModifier, reads: [] });
}

export { getPlayerTraits, getTraitModifier, traitCatalog };
export type { PlayerTrait, TraitModifier };
