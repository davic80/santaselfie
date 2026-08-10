import { STAGE_WIDTH, STAGE_HEIGHT } from '../config.js';

/**
 * Compone la selfie sobre un fondo sólido (el canvas del juego es
 * transparente) y la descarga, o la comparte si el dispositivo puede.
 */
export async function savePhoto(canvas, character) {
  const out = document.createElement('canvas');
  const scale = 1200 / STAGE_WIDTH;
  out.width = Math.round(STAGE_WIDTH * scale);
  out.height = Math.round(STAGE_HEIGHT * scale);

  const ctx = out.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, out.height);
  gradient.addColorStop(0, character.theme[0]);
  gradient.addColorStop(1, character.theme[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0, out.width, out.height);

  const blob = await new Promise((resolve) => out.toBlob(resolve, 'image/png'));
  if (!blob) return;

  const filename = `selfie-${character.id}.png`;
  const file = new File([blob], filename, { type: 'image/png' });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Mi selfie navideña' });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
