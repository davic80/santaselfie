#!/usr/bin/env bash
#
# Descarga y recorta los sonidos de sounds.tsv con yt-dlp + ffmpeg.
# Genera public/sounds/<id>.mp3 (mono, normalizado, con fundido) y
# public/sounds.json para la web.
#
# Uso:  ./scripts/fetch-sounds.sh          # todos
#       ./scripts/fetch-sounds.sh heehee   # solo uno (para reajustar el corte)

set -euo pipefail
export LC_ALL=C   # punto decimal en awk/ffmpeg aunque el sistema esté en español

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${ROOT}/public/sounds"
CACHE="${ROOT}/.cache"
mkdir -p "${OUT}" "${CACHE}"

command -v yt-dlp >/dev/null || { echo "Falta yt-dlp (pip install yt-dlp)"; exit 1; }
command -v ffmpeg >/dev/null || { echo "Falta ffmpeg"; exit 1; }

ONLY="${1:-}"

while IFS=$'\t' read -r id label color key start dur src album year; do
  [[ -z "${id}" || "${id}" == \#* ]] && continue
  [[ -n "${ONLY}" && "${ONLY}" != "${id}" ]] && continue

  raw="${CACHE}/${id}.m4a"
  if [[ ! -f "${raw}" ]]; then
    echo "==> ${id}: descargando (${src})"
    yt-dlp -q --no-playlist -f bestaudio -x --audio-format m4a \
      -o "${CACHE}/${id}.%(ext)s" "${src}"
  fi

  echo "==> ${id}: recortando ${start}s +${dur}s"
  fade_out_start=$(awk "BEGIN{print (${dur} > 0.1) ? ${dur} - 0.08 : 0}")
  ffmpeg -loglevel error -y -ss "${start}" -t "${dur}" -i "${raw}" \
    -af "afade=t=in:d=0.02,afade=t=out:st=${fade_out_start}:d=0.08,loudnorm=I=-14:TP=-1.5" \
    -ac 1 -ar 44100 -codec:a libmp3lame -q:a 4 "${OUT}/${id}.mp3"
done < "${ROOT}/sounds.tsv"

# Manifest para el front. "file" solo aparece si existe el mp3, con un hash
# del contenido para que el navegador no use una versión vieja en caché.
json_escape() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }
{
  echo "["
  sep=""
  while IFS=$'\t' read -r id label color key start dur src album year; do
    [[ -z "${id}" || "${id}" == \#* ]] && continue
    file=""
    if [[ -f "${OUT}/${id}.mp3" ]]; then
      v="$(cksum < "${OUT}/${id}.mp3" | cut -d' ' -f1)"
      file=",\"file\":\"sounds/${id}.mp3?v=${v}\""
    fi
    if [[ -f "${ROOT}/public/covers/${id}.jpg" ]]; then
      file="${file},\"cover\":\"covers/${id}.jpg\""
    fi
    printf '%s  {"id":"%s","label":"%s","color":"%s","key":"%s","album":"%s","year":"%s"%s}' \
      "${sep}" "${id}" "$(json_escape "${label}")" "${color}" "${key}" \
      "$(json_escape "${album}")" "${year}" "${file}"
    sep=$',\n'
  done < "${ROOT}/sounds.tsv"
  printf '\n]\n'
} > "${ROOT}/public/sounds.json"

echo "==> Listo: ${OUT}"
