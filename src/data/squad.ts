import type { Player } from '../game/types';

const squad: Player[] = [
  { id: 'morgan-13', name: 'Kai Morgan', role: 'Outside Centre', unit: 'backs', pace: 82, power: 74, handling: 78, defence: 70, stamina: 86, confidence: 64, fatigue: 18, form: [61, 67, 70, 66, 73, 76] },
  { id: 'okafor-08', name: 'Tomi Okafor', role: 'Number Eight', unit: 'forwards', pace: 66, power: 88, handling: 70, defence: 82, stamina: 78, confidence: 72, fatigue: 24, form: [70, 72, 69, 75, 77, 74] },
  { id: 'liu-09', name: 'Ben Liu', role: 'Scrum-half', unit: 'backs', pace: 79, power: 58, handling: 86, defence: 68, stamina: 84, confidence: 76, fatigue: 16, form: [74, 71, 78, 80, 77, 79] },
  { id: 'mccabe-05', name: 'Ewan McCabe', role: 'Lock', unit: 'forwards', pace: 52, power: 91, handling: 62, defence: 84, stamina: 72, confidence: 67, fatigue: 31, form: [66, 68, 71, 69, 65, 70] },
  { id: 'ramos-15', name: 'Sofia Ramos', role: 'Fullback', unit: 'backs', pace: 88, power: 61, handling: 82, defence: 74, stamina: 81, confidence: 69, fatigue: 20, form: [72, 76, 73, 78, 80, 77] }
];

const basePlayer = squad[0];

export { basePlayer, squad };
