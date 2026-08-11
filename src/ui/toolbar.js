import { TOOLS } from '../tools/index.js';
import { DECORATIONS, COFFEE_URL } from '../config.js';
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

function group(className) {
  const el = document.createElement('div');
  el.className = `group ${className}`;
  return el;
}

/**
 * Reparte los controles en dos raíles. El CSS decide si acaban a los lados del
 * personaje (pantalla horizontal) o juntos en una barra abajo (vertical).
 */
export function buildToolbar(left, right, app) {
  left.innerHTML = '';
  right.innerHTML = '';

  // --- Herramientas ---
  const tools = group('group--tools');
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

  // --- Color: solo el selector nativo del sistema ---
  const colors = group('group--colors');
  const picker = document.createElement('input');
  picker.type = 'color';
  picker.className = 'picker';
  picker.title = 'Elegir color';
  picker.setAttribute('aria-label', 'Elegir color');
  picker.addEventListener('input', () => app.setColor(picker.value));
  const pickerLabel = Object.assign(document.createElement('span'), {
    className: 'group__label',
    textContent: 'Color',
  });
  colors.append(picker, pickerLabel);

  // --- Adornos ---
  const decos = group('group--decorations');
  for (const d of DECORATIONS) {
    const el = button('deco', '', DECORATION_NAMES[d]);
    el.dataset.decoration = d;
    el.append(decorationThumb(d));
    el.addEventListener('click', () => app.setDecoration(d));
    decos.append(el);
  }

  // --- Personajes ---
  const chars = group('group--characters');
  for (const c of CHARACTERS) {
    const el = button('chip', `${c.emoji} ${c.name}`, `Cambiar a ${c.name}`);
    el.dataset.character = c.id;
    el.addEventListener('click', () => app.setCharacter(c.id));
    chars.append(el);
  }

  // --- Acciones ---
  const actions = group('group--actions');
  const reset = button('action', '↺ Reiniciar', 'Volver a empezar');
  reset.addEventListener('click', () => app.reset());
  const photo = button('action action--primary', '📸 Guardar foto', 'Descargar la selfie');
  photo.addEventListener('click', () => app.savePhoto());
  actions.append(reset, photo);

  // --- Pie: café y versión ---
  const footer = group('group--footer');
  const coffee = document.createElement('a');
  coffee.className = 'coffee';
  coffee.href = COFFEE_URL;
  coffee.target = '_blank';
  coffee.rel = 'noopener noreferrer';
  coffee.textContent = '☕ Invítame a un café';
  const version = Object.assign(document.createElement('span'), {
    className: 'version',
    textContent: `v${__APP_VERSION__}`,
  });
  footer.append(coffee, version);

  left.append(tools, colors, decos);
  right.append(chars, actions, footer);

  /** Refresca el estado visual (qué está seleccionado) sin reconstruir el DOM. */
  return function sync(state) {
    for (const el of right.querySelectorAll('[data-character]')) {
      el.classList.toggle('is-active', el.dataset.character === state.character.id);
    }
    for (const el of left.querySelectorAll('[data-tool]')) {
      el.classList.toggle('is-active', el.dataset.tool === state.tool.id);
    }
    for (const el of left.querySelectorAll('[data-decoration]')) {
      el.classList.toggle('is-active', el.dataset.decoration === state.decoration);
    }
    colors.classList.toggle('is-dim', !state.tool.usesColor);
    decos.classList.toggle('is-dim', !state.tool.usesDecoration);
    picker.value = /^#[0-9a-f]{6}$/i.test(state.color) ? state.color : '#ffffff';
  };
}
