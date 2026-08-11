import back from './art/yeti-back.svg';
import front from './art/yeti-front.svg';

export default {
  id: 'yeti',
  name: 'El Yeti',
  emoji: '❄️',
  art: { back, front },
  theme: ['#5aa7cc', '#123a4d'],
  hairShape: 'fluffy',
  hairColor: '#eef7fb',
  hairSize: 1.2,
  growArea: { cx: 600, cy: 570, rx: 268, ry: 292 },

  zones: [
    // Pelaje por todo el cráneo, bien espeso.
    {
      kind: 'arc', cx: 600, cy: 570, rx: 262, ry: 286,
      from: 156, to: 384, count: 24, layers: 4, layerStep: 22, size: 1.2,
    },

    { kind: 'grid', x: 288, y: 620, cols: 4, rows: 12, spacing: 22, size: 1.15 },
    { kind: 'grid', x: 846, y: 620, cols: 4, rows: 12, spacing: 22, size: 1.15 },

    // Cejotas.
    { kind: 'dots', size: 1.3, mirror: 1200, points: [[446, 482], [488, 458], [530, 472]] },

    // El pelaje le tapa el morro: al cortar, se le descubren los colmillos.
    {
      kind: 'dots', size: 1.2,
      points: [[478, 648], [514, 632], [550, 622], [600, 618], [650, 622], [686, 632], [722, 648]],
    },
    { kind: 'grid', x: 380, y: 632, cols: 23, rows: 20, spacing: 20, curve: 120, size: 1.15 },
  ],
};
