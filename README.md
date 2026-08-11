# Barba — selfie navideña

Corta, peina y pinta la barba y el pelo de ocho personajes. Inspirado en el
*Santa Selfie* de Google Santa Tracker, reescrito desde cero en JavaScript
moderno sin dependencias de runtime.

**En producción:** https://barba.ojoalprecio.com

## Cómo funciona

El pelo no son sprites sueltos: es una **simulación de tela con integración de
Verlet**. Cada mechón es una partícula sujeta a sus vecinos por uniones de
distancia; la fila superior está anclada a la cara y el resto cuelga por
gravedad.

- **Cortar** rompe las uniones de un mechón y lo desancla → cae y desaparece.
- **Pintar** cambia el color de cada partícula (no hay sprites pretintados:
  cualquier color vale). El color se elige con `<input type="color">`, que en
  iOS y Android abre la rueda de color nativa del sistema.
- **Peinar** desplaza las partículas moviendo su posición anterior, que es como
  se les da velocidad en Verlet.

## Personajes

Los personajes son **datos, no código** (`src/characters/*.js`): dos capas SVG
(detrás y delante del pelo) más una lista de zonas donde nace el pelo. Añadir
uno nuevo son dos SVG y un fichero de definición.

```js
zones: [
  { kind: 'arc',  cx: 600, cy: 570, rx: 242, ry: 278, from: 152, to: 202, count: 5 },
  { kind: 'dots', points: [[508, 704], [540, 694]] },
  { kind: 'grid', x: 390, y: 650, cols: 22, rows: 25, spacing: 20, curve: 130 },
]
```

- `grid` — malla que cuelga (la barba, las melenas largas).
- `arc` — mechones fijos repartidos por un arco de elipse (el cráneo).
- `dots` — mechones fijos en posiciones concretas (cejas, bigote).

Los ocho personajes (Papá Noel, El Gruñón, El Guardabosques, El Mago, Melchor,
Gaspar, Baltasar y El Yeti) son dibujos originales, inspirados en arquetipos
navideños y de cuento; no reproducen ningún diseño con derechos de autor.

La interfaz se reparte en dos raíles: en pantalla **horizontal** se colocan a
los lados con el personaje centrado; en **vertical** caen juntos a una barra
abajo. Es solo CSS (`display: contents` en horizontal), sin JS de layout.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Estructura

```
src/
  engine/   verlet.js (física) · build.js (zonas → malla)
            shapes.js (formas de mechón) · render.js (canvas + caché de sprites)
  tools/    tijeras, spray, secador, peine, crecer, limpiar, adornos
  characters/  definiciones + arte SVG
  ui/       barra de herramientas y exportación de la foto
```

## Despliegue

CI publica la imagen en `ghcr.io/davic80/santaselfie:latest` en cada push a
`main`. En el servidor:

```bash
cp .env.example .env   # ajusta PROXY_NETWORK
./deploy.sh
```

La app queda detrás del Caddy compartido; el bloque a añadir al Caddyfile está
en `Caddyfile`.

## Licencia

MIT.
