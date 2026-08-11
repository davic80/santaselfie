import back from './art/melchor-back.svg';
import front from './art/melchor-front.svg';

export default {
  id: 'melchor',
  name: 'Melchor',
  emoji: '👑',
  art: { back, front },
  theme: ['#8e2f4a', '#3d1024'],
  hairShape: 'wavy',
  hairColor: '#f2f2f2',
  hairSize: 1,
  growArea: { cx: 600, cy: 570, rx: 240, ry: 284 },

  zones: [
    // Melenas que asoman por debajo de la corona, a los lados.
    {
      kind: 'arc', cx: 600, cy: 570, rx: 240, ry: 276,
      from: 152, to: 202, count: 6, layers: 2, layerStep: 20,
    },
    {
      kind: 'arc', cx: 600, cy: 570, rx: 240, ry: 276,
      from: 338, to: 388, count: 6, layers: 2, layerStep: 20,
    },
    { kind: 'grid', x: 312, y: 630, cols: 4, rows: 13, spacing: 22 },
    { kind: 'grid', x: 822, y: 630, cols: 4, rows: 13, spacing: 22 },

    { kind: 'dots', size: 0.85, mirror: 1200, points: [[472, 494], [506, 484], [540, 490]] },

    // Bigote y barba larga y ondulada.
    {
      kind: 'dots', size: 0.95,
      points: [[508, 700], [540, 690], [572, 684], [600, 682], [628, 684], [660, 690], [692, 700]],
    },
    { kind: 'grid', x: 414, y: 656, cols: 19, rows: 26, spacing: 20, curve: 140 },
  ],
};
