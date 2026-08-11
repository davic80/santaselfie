import santa from './santa.js';
import grouch from './grouch.js';
import keeper from './keeper.js';
import wizard from './wizard.js';
import melchor from './melchor.js';
import gaspar from './gaspar.js';
import baltasar from './baltasar.js';
import yeti from './yeti.js';

export const CHARACTERS = [santa, grouch, keeper, wizard, melchor, gaspar, baltasar, yeti];

const loaded = new Map();

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src;
  });
}

/** Carga (una sola vez) las dos capas de dibujo del personaje. */
export async function loadArt(character) {
  if (loaded.has(character.id)) return loaded.get(character.id);

  const promise = Promise.all([
    loadImage(character.art.back),
    loadImage(character.art.front),
  ]).then(([background, foreground]) => {
    character.background = background;
    character.foreground = foreground;
    return character;
  });

  loaded.set(character.id, promise);
  return promise;
}
