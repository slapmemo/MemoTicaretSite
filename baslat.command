#!/bin/bash
# ============================================================
# MemoTicaret baslatici (macOS)
# Cift tiklayarak calistir. 2 Terminal penceresi acar (backend + frontend)
# ve frontend hazir olunca tarayicida http://localhost:4200 acar.
# ============================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "MemoTicaret baslatiliyor..."

# Backend terminali
osascript -e "tell application \"Terminal\" to do script \"cd '$DIR/backend' && npm run dev\""

# Frontend terminali
osascript -e "tell application \"Terminal\" to do script \"cd '$DIR/frontend' && npm start\""

# Frontend derlenip ayaga kalkinca tarayicida ac (en fazla ~90 sn bekler)
echo "Frontend derleniyor, hazir olunca tarayici acilacak..."
for i in $(seq 1 45); do
  if curl -s -o /dev/null http://localhost:4200; then
    open http://localhost:4200
    echo "Tarayici acildi: http://localhost:4200"
    exit 0
  fi
  sleep 2
done

echo "Frontend beklenenden uzun surdu. Hazir olunca tarayicida su adresi ac: http://localhost:4200"
