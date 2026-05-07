import type { Drill } from '../game/types';

const drills: Drill[] = [
  { label: 'Sprint Lanes', stat: 'pace', boost: 5, fatigue: 8, note: 'Acceleration and chase pressure improve.' },
  { label: 'Contact Blocks', stat: 'power', boost: 5, fatigue: 10, note: 'Carry strength and tackle fight improve.' },
  { label: 'Passing Grid', stat: 'handling', boost: 6, fatigue: 5, note: 'Catch-pass timing sharpens.' },
  { label: 'Defensive Reads', stat: 'defence', boost: 6, fatigue: 6, note: 'Line speed and drift choices improve.' },
  { label: 'Conditioning Set', stat: 'stamina', boost: 4, fatigue: 12, note: 'Late-match repeat efforts improve.' }
];

export { drills };
