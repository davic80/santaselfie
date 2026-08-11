import back from './art/keeper-back.svg';
import front from './art/keeper-front.svg';

export default {
  id: 'keeper',
  name: 'El Guardabosques',
  emoji: '🪵',
  art: { back, front },
  theme: ['#4d3b2a', '#241a12'],
  hairShape: 'fluffy',
  hairColor: '#4a342a',
  hairSize: 1.1,
  growArea: { cx: 600, cy: 570, rx: 262, ry: 288 },

  zones: [
    // Melena que cubre todo el cráneo.
    {
      kind: 'arc', cx: 600, cy: 570, rx: 256, ry: 282,
      from: 158, to: 382, count: 22, layers: 3, layerStep: 22, size: 1.15,
    },

    // Mechones largos por los lados, que sí cuelgan.
    { kind: 'grid', x: 300, y: 636, cols: 4, rows: 11, spacing: 22, size: 1.1 },
    { kind: 'grid', x: 834, y: 636, cols: 4, rows: 11, spacing: 22, size: 1.1 },

    { kind: 'dots', size: 1.25, mirror: 1200, points: [[456, 508], [496, 488], [536, 500]] },

    {
      kind: 'dots', size: 1.1,
      points: [[500, 736], [534, 724], [568, 718], [600, 716], [632, 718], [666, 724], [700, 736]],
    },

    { kind: 'grid', x: 390, y: 672, cols: 22, rows: 26, spacing: 20, curve: 150, size: 1.1 },
  ],
};
