import type { Tactic } from '../../game/types';

type Route = {
  start: [number, number, number];
  end: [number, number, number];
  ballStart: [number, number, number];
  ballEnd: [number, number, number];
};

const routes: Record<string, Route> = {
  'wide-pod': { start: [-8, 0, -2.8], end: [6.8, 0, -6.2], ballStart: [-7, 0.55, -2.5], ballEnd: [8.2, 0.85, -6.4] },
  'carry-hard': { start: [-3.5, 0, 0.6], end: [4.5, 0, 0.2], ballStart: [-3.8, 0.55, 0.5], ballEnd: [5.5, 0.72, 0.1] },
  'kick-chase': { start: [-9, 0, 6.2], end: [8.8, 0, 6.6], ballStart: [-8.8, 0.7, 5.8], ballEnd: [10.8, 1.8, 6.7] },
  'defensive-set': { start: [5.6, 0, 2.8], end: [11.8, 0, 0.8], ballStart: [8.2, 0.55, 1.8], ballEnd: [12.4, 0.7, 0.2] },
  'tempo-shift': { start: [-7, 0, 2.4], end: [6.2, 0, 3.8], ballStart: [-6.6, 0.55, 2.5], ballEnd: [7.2, 1.1, 4.2] }
};

function getRoute(tactic: Tactic): Route {
  return routes[tactic.id] ?? routes['carry-hard'];
}

export { getRoute };
export type { Route };
