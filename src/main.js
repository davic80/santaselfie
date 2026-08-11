import { CHARACTERS, loadArt } from './characters/index.js';
import { DEFAULT_COLOR } from './config.js';
import { buildCloth } from './engine/build.js';
import { Renderer } from './engine/render.js';
import { Pointer } from './input.js';
import { toolById, TOOLS } from './tools/index.js';
import { buildToolbar } from './ui/toolbar.js';
import { savePhoto } from './ui/photo.js';

const canvas = document.querySelector('#stage');
const stageEl = document.querySelector('.stage');
const railLeft = document.querySelector('#rail-left');
const railRight = document.querySelector('#rail-right');
const cursorEl = document.querySelector('#cursor');

const renderer = new Renderer(canvas);
const pointer = new Pointer(canvas, renderer);

const state = {
  character: CHARACTERS[0],
  tool: TOOLS[1], // tijeras
  color: DEFAULT_COLOR,
  decoration: 'bauble',
};

let cloth = null;
let syncToolbar = null;

const app = {
  setCharacter(id) {
    const next = CHARACTERS.find((c) => c.id === id);
    if (!next || next === state.character) return;
    state.character = next;
    applyTheme();
    load();
  },
  setTool(id) {
    state.tool = toolById(id);
    updateCursor();
    syncToolbar(state);
  },
  setColor(color) {
    state.color = color;
    if (!state.tool.usesColor) app.setTool('spray');
    else syncToolbar(state);
  },
  setDecoration(decoration) {
    state.decoration = decoration;
    if (!state.tool.usesDecoration) app.setTool('decorate');
    else syncToolbar(state);
  },
  reset() {
    cloth = buildCloth(state.character);
  },
  savePhoto() {
    savePhoto(canvas, state.character);
  },
};

function applyTheme() {
  document.body.style.setProperty('--theme-a', state.character.theme[0]);
  document.body.style.setProperty('--theme-b', state.character.theme[1]);
}

function updateCursor() {
  cursorEl.textContent = state.tool.icon;
}

async function load() {
  document.body.classList.add('is-loading');
  await loadArt(state.character);
  cloth = buildCloth(state.character);
  document.body.classList.remove('is-loading');
  syncToolbar(state);
}

function resize() {
  const rect = stageEl.getBoundingClientRect();
  renderer.resize(rect.width, rect.height);
}

function frame() {
  requestAnimationFrame(frame);
  if (!cloth) return;

  pointer.sync();
  if (pointer.down) {
    state.tool.apply(cloth, pointer, state);
  }
  cloth.step();
  renderer.draw(state.character, cloth);

  // El cursor se voltea para enseñar hacia dónde sopla el secador, y se marca
  // en gris cuando la herramienta no puede actuar ahí (crecer fuera de la cara).
  const zoom = pointer.down ? 0.85 : 1;
  const flip = state.tool.direction ?? 1;
  cursorEl.style.transform =
    `translate(${pointer.clientX}px, ${pointer.clientY}px) scale(${zoom * flip}, ${zoom})`;
  cursorEl.classList.toggle('is-visible', pointer.inside);
  cursorEl.classList.toggle(
    'is-blocked',
    Boolean(state.tool.canApply) && !state.tool.canApply(pointer, state),
  );
}

syncToolbar = buildToolbar(railLeft, railRight, app);
applyTheme();
updateCursor();
resize();
window.addEventListener('resize', resize);
new ResizeObserver(resize).observe(stageEl);
load();
requestAnimationFrame(frame);
