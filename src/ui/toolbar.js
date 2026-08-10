import { TOOLS } from '../tools/index.js';
import { PALETTE, DECORATIONS } from '../config.js';
import { CHARACTERS } from '../characters/index.js';
import { decorationPainters } from '../engine/shapes.js';

const DECORATION_NAMES = {
  bauble: 'Bola',
  bow: 'Lazo',
  holly: 'Acebo',
  star: 'Estrella',
  snowflake: 'Copo',
};

/** Miniatura de un adorno, para el botón de la barra. */
function decorationThumb(type) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 52;
  const ctx = canvas.getContext('2d');
  ctx.translate(26, 26);
  decorationPainters[type](ctx);
  canvas.className = 'thumb';
  return canvas;
}

function button(className, label, title) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.title = title || label;
  el.setAttribute('aria-label', title || label);
  if (label) el.textContent = label;
  return el;
}

export function buildToolbar(root, app) {
  root.innerHTML = '';

  // --- Personajes ---
  const chars = document.createElement('div');
  chars.className = 'group group--characters';
  for (const c of CHARACTERS) {
    const el = button('chip', `${c.emoji} ${c.name}`, `Cambiar a ${c.name}`);
    el.dataset.character = c.id;
    el.addEventListener('click', () => app.setCharacter(c.id));
    chars.append(el);
  }

  // --- Herramientas ---
  const tools = document.createElement('div');
  tools.className = 'group group--tools';
  for (const t of TOOLS) {
    const el = button('tool', t.icon, `${t.name} — ${t.hint}`);
    el.dataset.tool = t.id;
    el.append(Object.assign(document.createElement('span'), {
      className: 'tool__name',
      textContent: t.name,
    }));
    el.addEventListener('click', () => app.setTool(t.id));
    tools.append(el);
  }

  // --- Colores ---
  const colors = document.createElement('div');
  colors.className = 'group group--colors';
  for (const c of PALETTE) {
    const el = button('swatch', '', `Color ${c}`);
    el.style.setProperty('--swatch', c);
    el.dataset.color = c;
    el.addEventListener('click', () => app.setColor(c));
    colors.append(el);
  }
  const picker = document.createElement('input');
  picker.type = 'color';
  picker.className = 'picker';
  picker.title = 'Color libre';
  picker.addEventListener('input', () => app.setColor(picker.value));
  colors.append(picker);

  // --- Adornos ---
  const decos = document.createElement('div');
  decos.className = 'group group--decorations';
  for (const d of DECORATIONS) {
    const el = button('deco', '', DECORATION_NAMES[d]);
    el.dataset.decoration = d;
    el.append(decorationThumb(d));
    el.addEventListener('click', () => app.setDecoration(d));
    decos.append(el);
  }

  // --- Acciones ---
  const actions = document.createElement('div');
  actions.className = 'group group--actions';
  const reset = button('action', '↺ Reiniciar', 'Volver a empezar');
  reset.addEventListener('click', () => app.reset());
  const photo = button('action action--primary', '📸 Guardar foto', 'Descargar la selfie');
  photo.addEventListener('click', () => app.savePhoto());
  actions.append(reset, photo);

  root.append(chars, tools, colors, decos, actions);

  /** Refresca el estado visual (qué está seleccionado) sin reconstruir el DOM. */
  return function sync(state) {
    for (const el of root.querySelectorAll('[data-character]')) {
      el.classList.toggle('is-active', el.dataset.character === state.character.id);
    }
    for (const el of root.querySelectorAll('[data-tool]')) {
      el.classList.toggle('is-active', el.dataset.tool === state.tool.id);
    }
    for (const el of root.querySelectorAll('[data-color]')) {
      el.classList.toggle('is-active', el.dataset.color === state.color);
    }
    for (const el of root.querySelectorAll('[data-decoration]')) {
      el.classList.toggle('is-active', el.dataset.decoration === state.decoration);
    }
    colors.classList.toggle('is-dim', !state.tool.usesColor);
    decos.classList.toggle('is-dim', !state.tool.usesDecoration);
    picker.value = /^#[0-9a-f]{6}$/i.test(state.color) ? state.color : '#ffffff';
  };
}
