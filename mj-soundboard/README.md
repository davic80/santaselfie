# mj-soundboard

Soundboard de Michael Jackson con 16 vinilos de sus discos (Off the Wall, Thriller,
Bad, Dangerous, HIStory…). Cada uno tiene la galleta de un color y su sonido (gritos y
muletillas: *hee-hee*, *ow*, *shamone*…), y gira mientras suena.
Funciona con el ratón, con pantalla táctil y con el teclado (`1234 / QWER / ASDF / ZXCV`).
Es HTML + Web Audio puro, sin build. Si falta algún mp3, ese botón emite un *blip* de 8 bits.

> Uso privado: son clips muy cortos de material con copyright. La web lleva `noindex`.

## 1. Conseguir los sonidos (yt-dlp + ffmpeg)

`sounds.tsv` define cada vinilo: id, etiqueta, color de la galleta, tecla, inicio y
duración del corte, la fuente (una URL de YouTube o `ytsearch1:consulta`), el disco y el año.

Portadas (opcional): deja `public/covers/<id>.jpg` (cuadrada, unos 300 px) y se usa
como galleta del vinilo en lugar del color con el título.

```bash
pip install yt-dlp          # y ffmpeg del gestor de paquetes
./scripts/fetch-sounds.sh   # descarga a .cache/ y genera public/sounds/*.mp3 + sounds.json
```

Las búsquedas de `ytsearch1:` son un punto de partida. Lo suyo es escuchar cada
original, cambiar `source` por la URL buena (las recopilaciones de "hee-hee" de YouTube
van muy bien) y ajustar `start`/`duration`. Para regenerar un solo botón:
`./scripts/fetch-sounds.sh heehee`. Cada corte sale en mono, normalizado a -14 LUFS
y con fundidos de entrada y salida.

Si cambias la etiqueta, el color o la tecla, vuelve a lanzar el script (aunque sea con
un id que no exista) para regenerar `public/sounds.json`.

Prueba en local: `cd public && python3 -m http.server 8080`.

## 2. Imagen y despliegue (igual que santaselfie)

La CI publica `ghcr.io/davic80/mj-soundboard:latest` con cada push a `main`.
Los mp3 tienen que estar commiteados en `public/sounds/`.

En el servidor:

```bash
cp .env.example .env        # PROXY_NETWORK = red del Caddy, MJ_SOUNDBOARD_HOST = mj.ojoalprecio.com
./deploy.sh
```

Después añade el bloque de `Caddyfile` al Caddyfile compartido y recarga Caddy:
`docker exec <caddy> caddy reload --config /etc/caddy/Caddyfile`.
