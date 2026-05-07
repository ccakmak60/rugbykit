import type { MatchState } from './matchState';
import type { EventLog, Player } from './types';

function getFinalResult(matchState: MatchState) {
  if (matchState.teamScore > matchState.opponentScore) return 'Win';
  if (matchState.teamScore < matchState.opponentScore) return 'Loss';
  return 'Draw';
}

function getCoachVerdict(player: Player, rating: number, selection: string, matchState: MatchState, momentum: number) {
  const result = getFinalResult(matchState);

  if (result === 'Win' && rating >= 78) return `${selection} stock rising. ${player.name} delivered in a winning performance.`;
  if (result === 'Win') return `Winning contribution banked. Keep building form toward ${selection}.`;
  if (momentum >= 65) return `Result aside, momentum stayed high. The staff will like the intent.`;
  if (player.fatigue >= 75) return `Recovery priority. Load is too high to keep chasing selection minutes.`;
  return `Mixed review. Cleaner objective execution needed before the next fixture.`;
}

function getKeyMoments(logs: EventLog[]) {
  const keywords = ['try', 'penalty', 'objective complete', 'objective missed', 'trait activated', 'opposition'];
  return logs
    .filter((log) => keywords.some((keyword) => `${log.title} ${log.detail}`.toLowerCase().includes(keyword)))
    .slice(0, 6);
}

function getObjectiveSummary(logs: EventLog[]) {
  const complete = logs.filter((log) => log.title.toLowerCase().includes('objective complete')).length;
  const missed = logs.filter((log) => log.title.toLowerCase().includes('objective missed')).length;
  return { complete, missed };
}

export { getCoachVerdict, getFinalResult, getKeyMoments, getObjectiveSummary };
