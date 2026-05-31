#!/usr/bin/env bash
# Comprime JPEG grandes sin redimensionar las que ya son livianas.
# Uso: ./scripts/optimize-images.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG="$ROOT/images"
QUALITY=82
MAX_PX=1920
MIN_BYTES=800000

total_before=0
total_after=0

for f in "$IMG"/*.jpg "$IMG"/*.jpeg; do
  [ -f "$f" ] || continue
  before=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  if [ "$before" -lt "$MIN_BYTES" ]; then
    echo "Omitido (ya liviano): $(basename "$f") — $((before / 1024)) KB"
    continue
  fi
  total_before=$((total_before + before))
  tmp="${f}.opt.tmp"
  sips -Z "$MAX_PX" "$f" --out "$tmp" >/dev/null
  sips -s format jpeg -s formatOptions "$QUALITY" "$tmp" --out "$f" >/dev/null
  rm -f "$tmp"
  after=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  total_after=$((total_after + after))
  echo "$(basename "$f"): $((before / 1024)) KB → $((after / 1024)) KB (-$(( (before - after) * 100 / before ))%)"
done

png="$IMG/cacho-burger.png"
if [ -f "$png" ]; then
  before=$(stat -f%z "$png" 2>/dev/null || stat -c%s "$png")
  if [ "$before" -gt 500000 ]; then
    sips -Z 1000 "$png" >/dev/null
    after=$(stat -f%z "$png" 2>/dev/null || stat -c%s "$png")
    echo "cacho-burger.png: $((before / 1024)) KB → $((after / 1024)) KB"
  fi
fi

if [ "$total_after" -gt 0 ]; then
  echo ""
  echo "JPEG optimizados: $((total_before / 1024)) KB → $((total_after / 1024)) KB (ahorro $(( (total_before - total_after) / 1024 )) KB)"
fi
