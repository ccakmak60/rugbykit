import type { MatchEvent } from '../game/types';

const matchEvents: MatchEvent[] = [
  { title: 'Line Break', detail: 'Kai hits outside shoulder and bends defensive line.', confidence: 7, fatigue: 6, form: 5 },
  { title: 'Dominant Tackle', detail: 'Stops forward momentum near halfway.', confidence: 5, fatigue: 7, form: 4 },
  { title: 'Dropped Pass', detail: 'Ball arrives behind shoulder under pressure.', confidence: -8, fatigue: 3, form: -6 },
  { title: 'Kick Chase Win', detail: 'Arrives first and forces rushed clearance.', confidence: 6, fatigue: 8, form: 3 },
  { title: 'Missed Read', detail: 'Bites inward and leaves space outside.', confidence: -7, fatigue: 4, form: -5 }
];

export { matchEvents };
