import { Hair } from '../engine/verlet.js';
import { randomVariant } from '../engine/shapes.js';
import {
  CUT_RADIUS, PAINT_RADIUS, DRAG_RADIUS, DRYER_FORCE, DRYER_RADIUS,
} from '../config.js';

/**
 * Cada herramienta recibe el estado del puntero en coordenadas del escenario:
 *   { x, y, px, py, down, justPressed }
 * `apply` se llama en cada frame mientras el puntero está pulsado.
 */
export const TOOLS = [
  {
    id: 'comb',
    name: 'Peine',
    icon: '🪮',
    hint: 'Arrastra el pelo',
    apply(cloth, p) {
      const dx = p.x - p.px;
      const dy = p.y - p.py;
      if (!dx && !dy) return;
      for (const h of cloth.near(p.x, p.y, DRAG_RADIUS)) {
        if (h.pinned) continue;
        h.px = h.x - dx;
        h.py = h.y - dy;
      }
    },
  },

  {
    id: 'scissors',
    name: 'Tijeras',
    icon: '✂️',
    hint: 'Corta el pelo y la barba',
    apply(cloth, p) {
      for (const h of cloth.near(p.x, p.y, CUT_RADIUS)) {
        cloth.cut(h);
      }
    },
  },

  {
    id: 'spray',
    name: 'Spray',
    icon: '🎨',
    hint: 'Pinta del color elegido',
    usesColor: true,
    apply(cloth, p, state) {
      for (const h of cloth.near(p.x, p.y, PAINT_RADIUS)) {
        h.color = state.color;
      }
    },
  },

  {
    id: 'dryer',
    name: 'Secador',
    icon: '💨',
    hint: 'Sopla el pelo a un lado',
    apply(cloth, p) {
      const side = p.x < 600 ? 1 : -1;
      for (const h of cloth.near(p.x, p.y, DRYER_RADIUS)) {
        if (h.pinned) continue;
        h.addForce(side * DRYER_FORCE, -DRYER_FORCE * 0.25);
      }
    },
  },

  {
    id: 'grow',
    name: 'Crecer',
    icon: '🌱',
    hint: 'Haz crecer pelo nuevo',
    usesColor: true,
    apply(cloth, p, state) {
      // Un mechón nuevo cada cierta distancia, para que no salga un pegote.
      if (!p.justPressed) {
        const d = Math.hypot(p.x - this._lastX, p.y - this._lastY);
        if (d < 16) return;
      }
      this._lastX = p.x;
      this._lastY = p.y;

      cloth.add(new Hair(p.x, p.y, {
        pinned: true,
        color: state.color,
        shape: state.character.hairShape,
        size: state.character.zones[0].size || 1,
        variant: randomVariant(),
      }));
    },
    _lastX: 0,
    _lastY: 0,
  },

  {
    id: 'eraser',
    name: 'Limpiar',
    icon: '🧽',
    hint: 'Quita color y adornos',
    apply(cloth, p) {
      for (const h of cloth.near(p.x, p.y, PAINT_RADIUS)) {
        h.reset();
      }
    },
  },

  {
    id: 'decorate',
    name: 'Adornos',
    icon: '🎀',
    hint: 'Coloca adornos en la barba',
    usesDecoration: true,
    apply(cloth, p, state) {
      if (!p.justPressed) return; // uno por clic
      let best = null;
      let bestDist = Infinity;
      for (const h of cloth.near(p.x, p.y, PAINT_RADIUS)) {
        const d = Math.hypot(h.x - p.x, h.y - p.y);
        if (d < bestDist) {
          bestDist = d;
          best = h;
        }
      }
      if (best) best.decoration = state.decoration;
    },
  },
];

export const toolById = (id) => TOOLS.find((t) => t.id === id);
