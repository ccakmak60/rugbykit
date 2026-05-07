import type { TrainingFocus } from '../game/types';

const trainingFocuses: TrainingFocus[] = [
  { id: 'speed', name: 'Speed block', description: 'Acceleration, repeat sprint work and kick-chase speed.', effects: { pace: 3, stamina: 1, fatigue: 8 } },
  { id: 'contact', name: 'Contact block', description: 'Collision, tackle fight and carry dominance.', effects: { power: 3, defence: 2, fatigue: 10 } },
  { id: 'skills', name: 'Skills block', description: 'Catch-pass timing, scanning and decision quality.', effects: { handling: 3, confidence: 2, fatigue: 5 } },
  { id: 'recovery', name: 'Recovery block', description: 'Unload body, review clips and restore confidence.', effects: { fatigue: -14, confidence: 3 } },
  { id: 'mixed', name: 'Mixed week', description: 'Balanced preparation with moderate load.', effects: { pace: 1, power: 1, handling: 1, defence: 1, stamina: 1, fatigue: 6 } }
];

export { trainingFocuses };
