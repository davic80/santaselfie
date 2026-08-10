import {
  GRAVITY,
  DAMPING,
  PHYSICS_DELTA,
  SOLVER_ITERATIONS,
  TEAR_DISTANCE,
  STAGE_WIDTH,
  STAGE_HEIGHT,
} from '../config.js';

/**
 * Un mechón de pelo. Es una partícula Verlet: no guarda velocidad, la deduce
 * de la diferencia con su posición anterior.
 */
export class Hair {
  constructor(x, y, opts = {}) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.fx = 0;
    this.fy = 0;

    this.pinned = !!opts.pinned;
    this.alive = true;

    this.shape = opts.shape || 'fluffy';
    this.variant = opts.variant ?? Math.floor(Math.random() * 6);
    this.rotation = opts.rotation ?? Math.random() * Math.PI * 2;
    this.size = opts.size ?? 1;

    this.baseColor = opts.color || '#ffffff';
    this.color = this.baseColor;
    this.decoration = null;

    this.links = []; // uniones que tocan este mechón
  }

  addForce(x, y) {
    this.fx += x;
    this.fy += y;
  }

  /** Suelta el mechón: deja de estar anclado y cae. */
  release() {
    this.pinned = false;
  }

  reset() {
    this.color = this.baseColor;
    this.decoration = null;
  }
}

class Link {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.rest = Math.hypot(b.x - a.x, b.y - a.y);
    this.alive = true;
  }
}

export class Cloth {
  constructor() {
    this.hairs = [];
    this.links = [];
    this.dead = 0;
  }

  add(hair) {
    this.hairs.push(hair);
    return hair;
  }

  link(a, b) {
    const l = new Link(a, b);
    this.links.push(l);
    a.links.push(l);
    b.links.push(l);
    return l;
  }

  /** Rompe las uniones de un mechón y lo desancla: el corte. */
  cut(hair) {
    let changed = hair.pinned || hair.links.length > 0;
    hair.pinned = false;
    for (const l of hair.links) {
      if (l.alive) this.breakLink(l);
    }
    hair.links.length = 0;
    return changed;
  }

  breakLink(l) {
    l.alive = false;
    this.dead++;
  }

  /** Mechones vivos dentro de un radio, en coordenadas virtuales. */
  *near(x, y, radius) {
    const r2 = radius * radius;
    for (const h of this.hairs) {
      if (!h.alive) continue;
      const dx = h.x - x;
      const dy = h.y - y;
      if (dx * dx + dy * dy <= r2) yield h;
    }
  }

  step() {
    // Las uniones rotas se saltan en el solver; cuando se acumulan demasiadas
    // compactamos la lista para no recorrerlas tres veces por frame.
    if (this.dead > 200) {
      this.links = this.links.filter((l) => l.alive);
      this.dead = 0;
    }
    for (let i = 0; i < SOLVER_ITERATIONS; i++) {
      this.solve();
    }
    this.integrate();
  }

  solve() {
    for (const l of this.links) {
      if (!l.alive) continue;
      const { a, b } = l;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 0.0001;

      if (dist > TEAR_DISTANCE) {
        this.breakLink(l);
        continue;
      }

      const diff = (l.rest - dist) / dist;
      if (a.pinned && b.pinned) continue;

      if (a.pinned) {
        b.x += dx * diff;
        b.y += dy * diff;
      } else if (b.pinned) {
        a.x -= dx * diff;
        a.y -= dy * diff;
      } else {
        const ox = dx * diff * 0.5;
        const oy = dy * diff * 0.5;
        a.x -= ox;
        a.y -= oy;
        b.x += ox;
        b.y += oy;
      }
    }
  }

  integrate() {
    for (const h of this.hairs) {
      if (!h.alive) continue;

      if (h.pinned) {
        h.px = h.x;
        h.py = h.y;
        h.fx = 0;
        h.fy = 0;
        continue;
      }

      h.addForce(0, GRAVITY);

      const nx = h.x + (h.x - h.px) * DAMPING + (h.fx / 2) * PHYSICS_DELTA;
      const ny = h.y + (h.y - h.py) * DAMPING + (h.fy / 2) * PHYSICS_DELTA;

      h.px = h.x;
      h.py = h.y;
      h.x = nx;
      h.y = ny;
      h.fx = 0;
      h.fy = 0;

      // Rebote suave en los laterales, y desaparición por abajo.
      if (h.x < 0) h.x = -h.x;
      else if (h.x > STAGE_WIDTH) h.x = 2 * STAGE_WIDTH - h.x;

      // Margen generoso: una barba larga pero entera puede asomar por debajo
      // del borde sin que la demos por perdida. Solo desaparece lo que cae de
      // verdad, es decir, lo que se ha cortado.
      if (h.y > STAGE_HEIGHT + 220) {
        h.alive = false;
      }
    }
  }
}
