import { Cloth, Hair } from './verlet.js';
import { randomVariant } from './shapes.js';

const rad = (deg) => (deg * Math.PI) / 180;

/**
 * Construye la simulación a partir de las zonas declaradas por el personaje.
 * Tipos de zona:
 *   grid — malla que cuelga (barba, melena larga). Solo la fila superior está
 *          anclada; el resto se sostiene por las uniones.
 *   arc  — mechones fijos repartidos por un arco de elipse (pelo del cráneo).
 *   dots — mechones fijos en posiciones concretas (cejas, bigote, patillas).
 */
export function buildCloth(character) {
  const cloth = new Cloth();
  for (const zone of character.zones) {
    const builder = builders[zone.kind];
    if (!builder) throw new Error(`Zona desconocida: ${zone.kind}`);
    builder(cloth, { ...defaults(character), ...zone });
  }
  return cloth;
}

function defaults(character) {
  return {
    shape: character.hairShape || 'fluffy',
    color: character.hairColor || '#ffffff',
    size: 1,
  };
}

function makeHair(x, y, z, extra = {}) {
  return new Hair(x, y, {
    shape: z.shape,
    color: z.color,
    size: z.size,
    variant: randomVariant(),
    ...extra,
  });
}

const builders = {
  grid(cloth, z) {
    const {
      x, y, cols, rows, spacing = 20,
      curve = 0, roundBottom = true, jitter = 3,
    } = z;

    // Fila superior siguiendo un arco: más alta en los lados (mejillas), más
    // baja en el centro (debajo del labio).
    const topY = (col) => {
      const t = cols > 1 ? (col / (cols - 1)) * 2 - 1 : 0;
      return y + curve * (1 - t * t);
    };

    const radius = cols / 2;
    const inSilhouette = (col, row) => {
      if (!roundBottom || row <= rows - radius) return true;
      const dx = col - (cols - 1) / 2;
      const dy = row - (rows - radius);
      return dx * dx + dy * dy < radius * radius;
    };

    const grid = [];
    for (let row = 0; row < rows; row++) {
      grid[row] = [];
      for (let col = 0; col < cols; col++) {
        if (!inSilhouette(col, row)) {
          grid[row][col] = null;
          continue;
        }
        const wobble = (Math.random() - 0.5) * jitter;
        const hair = makeHair(
          x + col * spacing + wobble,
          topY(col) + row * spacing + wobble,
          z,
          { pinned: row === 0 },
        );
        grid[row][col] = cloth.add(hair);
      }
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const here = grid[row][col];
        if (!here) continue;
        const left = col > 0 ? grid[row][col - 1] : null;
        const up = row > 0 ? grid[row - 1][col] : null;
        if (left) cloth.link(left, here);
        if (up) cloth.link(up, here);
      }
    }
  },

  arc(cloth, z) {
    const { cx, cy, rx, ry, from, to, count, layers = 1, layerStep = 20 } = z;
    for (let layer = 0; layer < layers; layer++) {
      const lx = rx + layer * layerStep;
      const ly = ry + layer * layerStep;
      for (let i = 0; i < count; i++) {
        const t = count > 1 ? i / (count - 1) : 0.5;
        const a = rad(from + (to - from) * t);
        cloth.add(
          makeHair(cx + Math.cos(a) * lx, cy + Math.sin(a) * ly, z, { pinned: true }),
        );
      }
    }
  },

  dots(cloth, z) {
    for (const [x, y] of z.points) {
      cloth.add(makeHair(x, y, z, { pinned: true }));
    }
    if (z.mirror) {
      for (const [x, y] of z.points) {
        cloth.add(makeHair(z.mirror - x, y, z, { pinned: true }));
      }
    }
  },
};
