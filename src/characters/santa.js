import back from './art/santa-back.svg';
import front from './art/santa-front.svg';

export default {
  id: 'santa',
  name: 'Papá Noel',
  emoji: '🎅',
  art: { back, front },
  theme: ['#2b6b4f', '#0f3d2e'],
  hairShape: 'fluffy',
  hairColor: '#ffffff',
  hairSize: 1,

  // Dónde puede nacer pelo nuevo: su cabeza, con un poco de margen.
  growArea: { cx: 600, cy: 570, rx: 246, ry: 282 },

  zones: [
    // Pelo que asoma por debajo del gorro, a los lados.
    { kind: 'arc', cx: 600, cy: 570, rx: 242, ry: 278, from: 152, to: 202, count: 5, layers: 2, layerStep: 18 },
    { kind: 'arc', cx: 600, cy: 570, rx: 242, ry: 278, from: 338, to: 388, count: 5, layers: 2, layerStep: 18 },

    // Cejas.
    { kind: 'dots', size: 0.8, mirror: 1200, points: [[476, 496], [508, 486], [540, 492]] },

    // Bigote.
    {
      kind: 'dots', size: 0.95,
      points: [[508, 704], [540, 694], [572, 688], [600, 686], [628, 688], [660, 694], [692, 704]],
    },

    // La barba: la malla que cuelga.
    { kind: 'grid', x: 390, y: 650, cols: 22, rows: 25, spacing: 20, curve: 130 },
  ],
};
