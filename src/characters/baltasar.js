import back from './art/baltasar-back.svg';
import front from './art/baltasar-front.svg';

export default {
  id: 'baltasar',
  name: 'Baltasar',
  emoji: '🌟',
  art: { back, front },
  theme: ['#7b3fb0', '#2e0d4a'],
  hairShape: 'curl',
  hairColor: '#2b2b2b',
  hairSize: 1,
  growArea: { cx: 600, cy: 570, rx: 238, ry: 282 },

  zones: [
    {
      kind: 'arc', cx: 600, cy: 570, rx: 238, ry: 274,
      from: 152, to: 202, count: 6, layers: 2, layerStep: 20,
    },
    {
      kind: 'arc', cx: 600, cy: 570, rx: 238, ry: 274,
      from: 338, to: 388, count: 6, layers: 2, layerStep: 20,
    },
    { kind: 'grid', x: 318, y: 628, cols: 4, rows: 9, spacing: 22 },
    { kind: 'grid', x: 818, y: 628, cols: 4, rows: 9, spacing: 22 },

    { kind: 'dots', size: 0.9, mirror: 1200, points: [[470, 492], [506, 480], [542, 488]] },

    // Barba de rizo prieto: ancha, no muy larga.
    {
      kind: 'dots', size: 0.95,
      points: [[510, 704], [542, 694], [574, 688], [600, 686], [626, 688], [658, 694], [690, 704]],
    },
    { kind: 'grid', x: 416, y: 652, cols: 19, rows: 17, spacing: 20, curve: 128 },
  ],
};
