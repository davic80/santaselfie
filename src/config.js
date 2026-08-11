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

// El color se elige con el selector nativo del sistema (<input type="color">),
// que en iOS y Android abre la rueda de color del propio móvil.
export const DEFAULT_COLOR = '#e53935';

export const DECORATIONS = ['bauble', 'bow', 'holly', 'star', 'snowflake'];

export const COFFEE_URL =
  'https://www.paypal.com/donate/?hosted_button_id=7Z6JDTBCDCWHC';
