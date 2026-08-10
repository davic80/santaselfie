import back from './art/grouch-back.svg';
import front from './art/grouch-front.svg';

export default {
  id: 'grouch',
  name: 'El Gruñón',
  emoji: '😾',
  art: { back, front },
  theme: ['#1f5f3a', '#0a2a1c'],
  hairShape: 'spiky',
  hairColor: '#e8f3dc',

  zones: [
    { kind: 'arc', cx: 600, cy: 570, rx: 234, ry: 274, from: 152, to: 202, count: 5, layers: 2, layerStep: 18 },
    { kind: 'arc', cx: 600, cy: 570, rx: 234, ry: 274, from: 338, to: 388, count: 5, layers: 2, layerStep: 18 },

    // Cejas enormes y despeinadas: su rasgo principal.
    { kind: 'dots', size: 1.15, mirror: 1200, points: [[452, 512], [488, 492], [526, 504]] },

    { kind: 'grid', x: 430, y: 660, cols: 18, rows: 18, spacing: 20, curve: 140 },
  ],
};
