type Fixture = {
  week: number;
  opponent: string;
  venue: 'Home' | 'Away';
  difficulty: number;
  focus: string;
};

const fixtures: Fixture[] = [
  { week: 1, opponent: 'Harbour RFC', venue: 'Home', difficulty: 62, focus: 'Set-piece launch accuracy' },
  { week: 2, opponent: 'Vale Athletic', venue: 'Away', difficulty: 71, focus: 'Defensive spacing under fatigue' },
  { week: 3, opponent: 'Northbridge', venue: 'Home', difficulty: 68, focus: 'Kick chase and backfield cover' },
  { week: 4, opponent: 'Old Cartwrights', venue: 'Away', difficulty: 79, focus: 'Collision control in middle third' },
  { week: 5, opponent: 'Eastmoor', venue: 'Home', difficulty: 74, focus: 'Wide channel execution' }
];

export { fixtures };
export type { Fixture };
