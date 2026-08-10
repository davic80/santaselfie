/**
 * Puntero unificado ratón/táctil. Guarda las coordenadas crudas de los eventos
 * y las convierte a coordenadas del escenario una vez por frame, para que las
 * herramientas vean un delta estable (x/y frente a px/py).
 */
export class Pointer {
  constructor(canvas, renderer) {
    this.renderer = renderer;
    this.x = 0;
    this.y = 0;
    this.px = 0;
    this.py = 0;
    this.clientX = 0;
    this.clientY = 0;
    this.inside = false;
    this.down = false;
    this.justPressed = false;

    this.pressQueued = false;
    this.releaseQueued = false;

    const move = (e) => {
      this.clientX = e.clientX;
      this.clientY = e.clientY;
      this.inside = true;
      if (this.down) e.preventDefault();
    };

    canvas.addEventListener('pointerdown', (e) => {
      canvas.setPointerCapture(e.pointerId);
      move(e);
      this.pressQueued = true;
      e.preventDefault();
    });

    canvas.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', () => { this.releaseQueued = true; });
    window.addEventListener('pointercancel', () => { this.releaseQueued = true; });
    canvas.addEventListener('pointerleave', () => {
      if (!this.down) this.inside = false;
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /** Se llama una vez por frame, antes de aplicar la herramienta. */
  sync() {
    const stage = this.renderer.toStage(this.clientX, this.clientY);
    this.px = this.x;
    this.py = this.y;
    this.x = stage.x;
    this.y = stage.y;

    this.justPressed = false;
    if (this.pressQueued) {
      this.pressQueued = false;
      this.down = true;
      this.justPressed = true;
      // En el primer frame no hay arrastre: evita un tirón desde el origen.
      this.px = this.x;
      this.py = this.y;
    }
    // Si el toque ha empezado y terminado dentro del mismo frame, retrasamos
    // la subida para que la herramienta llegue a aplicarse una vez.
    if (this.releaseQueued && !this.justPressed) {
      this.releaseQueued = false;
      this.down = false;
    }
  }
}
