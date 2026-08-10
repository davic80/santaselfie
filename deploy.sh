#!/usr/bin/env bash
#
# santaselfie — desplegar / actualizar en el servidor.
#
# Descarga la última imagen publicada por CI en GHCR y levanta el stack con
# docker compose, detrás del Caddy compartido.
#
# Uso:  ./deploy.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

echo "==> Actualizando repo (compose, Caddyfile, scripts)"
git pull --ff-only || echo "   (git pull omitido; sigo con los ficheros locales)"

echo "==> Descargando la última imagen"
docker compose pull

echo "==> Reiniciando el stack"
docker compose up -d

docker image prune -f >/dev/null || true
echo "==> Listo. https://${SANTASELFIE_HOST:-barba.ojoalprecio.com}"
