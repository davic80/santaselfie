import back from './art/wizard-back.svg';
import front from './art/wizard-front.svg';

export default {
  id: 'wizard',
  name: 'El Mago',
  emoji: '🧙',
  art: { back, front },
  theme: ['#3b2f6b', '#171233'],
  hairShape: 'wavy',
  hairColor: '#f5f5f5',
  hairSize: 1,
  growArea: { cx: 600, cy: 570, rx: 232, ry: 284 },

  zones: [
    { kind: 'arc', cx: 600, cy: 570, rx: 228, ry: 280, from: 150, to: 200, count: 5, layers: 2, layerStep: 18 },
    { kind: 'arc', cx: 600, cy: 570, rx: 228, ry: 280, from: 340, to: 390, count: 5, layers: 2, layerStep: 18 },

    // Melena larga hasta los hombros.
    { kind: 'grid', x: 326, y: 648, cols: 4, rows: 15, spacing: 22 },
    { kind: 'grid', x: 808, y: 648, cols: 4, rows: 15, spacing: 22 },

    { kind: 'dots', size: 1.1, mirror: 1200, points: [[452, 512], [488, 496], [526, 506]] },

    {
      kind: 'dots', size: 1.05,
      points: [[500, 744], [534, 732], [568, 726], [600, 724], [632, 726], [666, 732], [700, 744]],
    },

    // La barba más larga de las cuatro: llega casi al borde del lienzo.
    { kind: 'grid', x: 430, y: 650, cols: 18, rows: 27, spacing: 20, curve: 150 },
  ],
};
