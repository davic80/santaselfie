import { STAGE_WIDTH, STAGE_HEIGHT } from '../config.js';
import { hairPath, decorationPainters, BASE_RADIUS } from './shapes.js';

/**
 * Pintar un Path2D por mechón cuesta demasiado con ~900 mechones en pantalla,
 * así que cada combinación forma+variante+color+escala se rasteriza una vez a
 * un canvas offscreen y luego solo se hace drawImage.
 */
class SpriteCache {
  constructor() {
    this.map = new Map();
    this.scale = 1;
  }

  setScale(scale) {
    if (Math.abs(scale - this.scale) < 0.01) return;
    this.scale = scale;
    this.map.clear();
  }

  hair(shape, variant, color, size) {
    const bucket = Math.round(size * 10) / 10;
    const key = `${shape}|${variant}|${color}|${bucket}`;
    let sprite = this.map.get(key);
    if (sprite) return sprite;

    const pad = 4;
    const radius = BASE_RADIUS * bucket * 1.75; // holgura para lóbulos y aspect
    const half = Math.ceil(radius * this.scale) + pad;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = half * 2;

    const ctx = canvas.getContext('2d');
    ctx.translate(half, half);
    ctx.scale(this.scale * bucket, this.scale * bucket);
    ctx.fillStyle = color;
    ctx.strokeStyle = shade(color, -0.14);
    ctx.lineWidth = 1.6;
    ctx.lineJoin = 'round';
    const path = hairPath(shape, variant);
    ctx.fill(path);
    ctx.stroke(path);

    sprite = { canvas, half };
    this.map.set(key, sprite);
    return sprite;
  }

  decoration(type) {
    const key = `deco|${type}`;
    let sprite = this.map.get(key);
    if (sprite) return sprite;

    const half = Math.ceil(26 * this.scale);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = half * 2;
    const ctx = canvas.getContext('2d');
    ctx.translate(half, half);
    ctx.scale(this.scale, this.scale);
    decorationPainters[type](ctx);

    sprite = { canvas, half };
    this.map.set(key, sprite);
    return sprite;
  }
}

/** Aclara (amount > 0) u oscurece (amount < 0) un color hex. */
export function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const t = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const r = clamp((n >> 16) + ((t - (n >> 16)) * p));
  const g = clamp(((n >> 8) & 255) + ((t - ((n >> 8) & 255)) * p));
  const b = clamp((n & 255) + ((t - (n & 255)) * p));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sprites = new SpriteCache();
    this.scale = 1;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
  }

  /** Ajusta el canvas al hueco disponible manteniendo la relación del escenario. */
  resize(cssWidth, cssHeight) {
    const scale = Math.min(cssWidth / STAGE_WIDTH, cssHeight / STAGE_HEIGHT);
    this.scale = scale;
    this.canvas.style.width = `${STAGE_WIDTH * scale}px`;
    this.canvas.style.height = `${STAGE_HEIGHT * scale}px`;
    this.canvas.width = Math.round(STAGE_WIDTH * scale * this.dpr);
    this.canvas.height = Math.round(STAGE_HEIGHT * scale * this.dpr);
    this.sprites.setScale(scale * this.dpr);
  }

  /** Coordenadas de pantalla -> coordenadas del escenario. */
  toStage(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / this.scale,
      y: (clientY - rect.top) / this.scale,
    };
  }

  draw(character, cloth) {
    const { ctx } = this;
    const k = this.scale * this.dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.scale(k, k);

    if (character.background) {
      ctx.drawImage(character.background, 0, 0, STAGE_WIDTH, STAGE_HEIGHT);
    }
    ctx.restore();

    for (const h of cloth.hairs) {
      if (!h.alive) continue;
      const sprite = this.sprites.hair(h.shape, h.variant, h.color, h.size);
      const cos = Math.cos(h.rotation);
      const sin = Math.sin(h.rotation);
      ctx.setTransform(cos, sin, -sin, cos, h.x * k, h.y * k);
      ctx.drawImage(sprite.canvas, -sprite.half, -sprite.half);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (const h of cloth.hairs) {
      if (!h.alive || !h.decoration) continue;
      const sprite = this.sprites.decoration(h.decoration);
      ctx.drawImage(sprite.canvas, h.x * k - sprite.half, h.y * k - sprite.half);
    }

    if (character.foreground) {
      ctx.save();
      ctx.scale(k, k);
      ctx.drawImage(character.foreground, 0, 0, STAGE_WIDTH, STAGE_HEIGHT);
      ctx.restore();
    }
  }
}
