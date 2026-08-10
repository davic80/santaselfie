// Lienzo virtual. Todo el juego (personajes, zonas de pelo, física) trabaja en
// estas coordenadas y se escala al viewport en el momento de pintar.
export const STAGE_WIDTH = 1200;
export const STAGE_HEIGHT = 1400;

// Física (valores heredados del original de Santa Tracker: dan un pelo pesado
// y muy amortiguado, que cae sin rebotar).
export const GRAVITY = 2000;
export const DAMPING = 0.8;
export const PHYSICS_DELTA = 0.032 * 0.032;
export const SOLVER_ITERATIONS = 3;
export const TEAR_DISTANCE = 80;

// Radios de acción de las herramientas, en coordenadas virtuales.
export const CUT_RADIUS = 26;
export const PAINT_RADIUS = 46;
export const DRAG_RADIUS = 40;
export const DRYER_FORCE = 5500;
export const DRYER_RADIUS = 320;

export const PALETTE = [
  '#ffffff', '#ffd54f', '#ff8a3d', '#e53935',
  '#ec407a', '#ab47bc', '#5c6bc0', '#29b6f6',
  '#26a69a', '#66bb6a', '#8d6e63', '#37474f',
];

export const DECORATIONS = ['bauble', 'bow', 'holly', 'star', 'snowflake'];
