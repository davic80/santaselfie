// Formas de mechón generadas por procedimiento: un contorno polar irregular
// suavizado con Catmull-Rom. Cada mechón usa una de las `VARIANTS` variantes
// para que la barba no parezca un patrón repetido.

const VARIANTS = 6;
const BASE_RADIUS = 26;

/** Presets: cuántos lóbulos, cuánto se hunden, proporción y qué tan puntiagudos. */
const PRESETS = {
  fluffy: { lobes: 9, jag: 0.3, aspect: 1, sharp: 0.35 },
  spiky: { lobes: 8, jag: 0.52, aspect: 1, sharp: 0.9 },
  wavy: { lobes: 6, jag: 0.24, aspect: 0.62, sharp: 0.15 },
  curl: { lobes: 7, jag: 0.34, aspect: 0.85, sharp: 0.55 },
};

/** PRNG determinista, para que cada variante sea siempre igual. */
function rng(seed) {
  let s = seed * 2654435761 % 2147483647;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function outline(preset, seed) {
  const { lobes, jag, aspect, sharp } = preset;
  const rand = rng(seed + 1);
  const pts = [];
  const steps = lobes * 2;

  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const peak = i % 2 === 0;
    const wobble = 0.85 + rand() * 0.3;
    const r = BASE_RADIUS * (peak ? wobble : (1 - jag) * wobble);
    // `aspect` < 1 estira el mechón en vertical (pelo largo).
    pts.push([Math.cos(angle) * r, (Math.sin(angle) * r) / aspect]);
  }
  return pts;
}

/** Cierra el contorno con curvas de Bézier derivadas de Catmull-Rom. */
function toPath(pts, sharp) {
  const path = new Path2D();
  const n = pts.length;
  // sharp = 1 -> polígono anguloso; sharp = 0 -> contorno redondeado.
  const t = (1 - sharp) / 6;

  path.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];

    path.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) * t,
      p1[1] + (p2[1] - p0[1]) * t,
      p2[0] - (p3[0] - p1[0]) * t,
      p2[1] - (p3[1] - p1[1]) * t,
      p2[0],
      p2[1],
    );
  }
  path.closePath();
  return path;
}

const pathCache = new Map();

export function hairPath(shape, variant) {
  const key = `${shape}:${variant}`;
  let path = pathCache.get(key);
  if (!path) {
    const preset = PRESETS[shape] || PRESETS.fluffy;
    path = toPath(outline(preset, variant), preset.sharp);
    pathCache.set(key, path);
  }
  return path;
}

export function randomVariant() {
  return Math.floor(Math.random() * VARIANTS);
}

export { BASE_RADIUS };

// --- Adornos --------------------------------------------------------------

/** Cada adorno se dibuja centrado en (0,0) dentro de un cuadrado de 44x44. */
export const decorationPainters = {
  bauble(ctx) {
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.arc(0, 3, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.arc(-5, -3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffca28';
    ctx.fillRect(-5, -17, 10, 6);
    ctx.strokeStyle = '#ffca28';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -19, 4, Math.PI, 0);
    ctx.stroke();
  },

  bow(ctx) {
    ctx.fillStyle = '#ec407a';
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dir * 20, -14, dir * 17, 2);
      ctx.quadraticCurveTo(dir * 15, 14, 0, 0);
      ctx.fill();
    }
    ctx.fillStyle = '#f8bbd0';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
  },

  holly(ctx) {
    ctx.fillStyle = '#2e7d32';
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.quadraticCurveTo(dir * 10, -16, dir * 20, -6);
      ctx.quadraticCurveTo(dir * 12, -2, dir * 20, 6);
      ctx.quadraticCurveTo(dir * 10, 12, 0, -2);
      ctx.fill();
    }
    ctx.fillStyle = '#c62828';
    for (const [x, y] of [[-5, 6], [5, 7], [0, 14]]) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  star(ctx) {
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 19 : 8;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  },

  snowflake(ctx) {
    ctx.strokeStyle = '#81d4fa';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(dx * 18, dy * 18);
      ctx.moveTo(dx * 10, dy * 10);
      ctx.lineTo(dx * 14 + dy * 7, dy * 14 - dx * 7);
      ctx.moveTo(dx * 10, dy * 10);
      ctx.lineTo(dx * 14 - dy * 7, dy * 14 + dx * 7);
      ctx.stroke();
    }
  },
};
