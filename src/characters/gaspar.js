import back from './art/gaspar-back.svg';
import front from './art/gaspar-front.svg';

export default {
  id: 'gaspar',
  name: 'Gaspar',
  emoji: '🐫',
  art: { back, front },
  theme: ['#1e7a3c', '#0b3a1d'],
  hairShape: 'curl',
  hairColor: '#e0c07a',
  hairSize: 1,
  growArea: { cx: 600, cy: 570, rx: 240, ry: 282 },

  zones: [
    {
      kind: 'arc', cx: 600, cy: 570, rx: 240, ry: 274,
      from: 152, to: 202, count: 6, layers: 2, layerStep: 20,
    },
    {
      kind: 'arc', cx: 600, cy: 570, rx: 240, ry: 274,
      from: 338, to: 388, count: 6, layers: 2, layerStep: 20,
    },
    { kind: 'grid', x: 314, y: 626, cols: 4, rows: 10, spacing: 22 },
    { kind: 'grid', x: 820, y: 626, cols: 4, rows: 10, spacing: 22 },

    { kind: 'dots', size: 0.85, mirror: 1200, points: [[474, 492], [508, 482], [542, 488]] },

    // Barba corta y rizada, muy tupida en las mejillas.
    {
      kind: 'dots', size: 0.9,
      points: [[512, 698], [544, 688], [574, 682], [600, 680], [626, 682], [656, 688], [688, 698]],
    },
    { kind: 'grid', x: 420, y: 646, cols: 18, rows: 19, spacing: 20, curve: 130 },
  ],
};
