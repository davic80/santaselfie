#!/usr/bin/env bash
#
# Elegir y recortar a oído el sonido de un vinilo.
#
#   ./scripts/audition.sh heehee "michael jackson hee hee compilation"
#
# 1) Busca 8 vídeos y te deja elegir uno (o pegar una URL).
# 2) Lo reproduce con ffplay mostrando el tiempo: apunta dónde empieza el grito
#    (flechas ←/→ para moverte 10 s, q para salir).
# 3) Pides inicio y duración, escuchas el corte y repites hasta que suene bien.
# 4) Guarda fuente, inicio y duración en sounds.tsv y genera el mp3.

set -euo pipefail
export LC_ALL=C

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE="${ROOT}/.cache"
TSV="${ROOT}/sounds.tsv"
mkdir -p "${CACHE}"

id="${1:?Uso: $0 <id> [\"búsqueda\" | URL]}"
query="${2:-}"
grep -q "^${id}"$'\t' "${TSV}" || { echo "No existe '${id}' en sounds.tsv"; exit 1; }
command -v ffplay >/dev/null || { echo "Falta ffplay (viene con ffmpeg: brew install ffmpeg)"; exit 1; }

if [[ -z "${query}" ]]; then
  read -rp "Búsqueda en YouTube o URL: " query
fi

if [[ "${query}" == http* ]]; then
  url="${query}"
else
  echo "==> Buscando: ${query}"
  rows=()
  while IFS= read -r line; do rows+=("${line}"); done < <(yt-dlp --flat-playlist --no-warnings \
    --print "%(duration_string)s	%(title)s	https://www.youtube.com/watch?v=%(id)s" \
    "ytsearch8:${query}")
  for i in "${!rows[@]}"; do
    IFS=$'\t' read -r d t _ <<<"${rows[$i]}"
    printf "  %d) [%s] %s\n" "$((i + 1))" "${d}" "${t}"
  done
  read -rp "Número (o pega una URL): " pick
  if [[ "${pick}" == http* ]]; then url="${pick}"
  else IFS=$'\t' read -r _ _ url <<<"${rows[$((pick - 1))]}"; fi
fi

raw="${CACHE}/${id}.m4a"
rm -f "${raw}"
echo "==> Descargando ${url}"
yt-dlp -q --no-playlist -f bestaudio -x --audio-format m4a -o "${CACHE}/${id}.%(ext)s" "${url}"

echo "==> Escucha y apunta el segundo donde empieza (q para cerrar)"
ffplay -nodisp -autoexit -loglevel quiet -stats "${raw}" || true

while true; do
  read -rp "Inicio en segundos (p.ej. 12.4, o 'v' para volver a oír desde ahí): " start
  if [[ "${start}" == v* ]]; then
    read -rp "Desde el segundo: " from
    ffplay -nodisp -autoexit -loglevel quiet -stats -ss "${from}" "${raw}" || true
    continue
  fi
  read -rp "Duración en segundos [1.5]: " dur; dur="${dur:-1.5}"
  ffplay -nodisp -autoexit -loglevel quiet -ss "${start}" -t "${dur}" "${raw}" || true
  read -rp "¿Vale? [s/N/r=repetir]: " ok
  [[ "${ok}" == r* ]] && { ffplay -nodisp -autoexit -loglevel quiet -ss "${start}" -t "${dur}" "${raw}" || true; read -rp "¿Vale? [s/N]: " ok; }
  [[ "${ok}" == [sSyY]* ]] && break
done

# Guarda inicio, duración y fuente (columnas 5, 6, 7) en sounds.tsv.
awk -F'\t' -v OFS='\t' -v id="${id}" -v s="${start}" -v d="${dur}" -v u="${url}" \
  '$1 == id { $5 = s; $6 = d; $7 = u } { print }' "${TSV}" > "${TSV}.tmp" && mv "${TSV}.tmp" "${TSV}"

"${ROOT}/scripts/fetch-sounds.sh" "${id}"
echo "==> ${id} listo. Escúchalo: afplay public/sounds/${id}.mp3"
