#!/bin/bash
# Copie les vars livre (STRIPE_PRICE_ID_PREORDER, STRIPE_PRICE_ID_SALE, PREORDER_END_DATE)
# de .env.local local vers le serveur OVH.
# Usage: cd /Volumes/T9/aigile && bash deploy/sync-book-env.sh

set -euo pipefail

REMOTE_HOST=${REMOTE_HOST:-root@144.91.91.88}
REMOTE_PATH=${REMOTE_PATH:-/var/www/aigile}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if [ ! -f .env.local ]; then
  echo "❌ .env.local introuvable."
  exit 1
fi

LINES=$(grep -E '^(STRIPE_PRICE_ID_PREORDER|STRIPE_PRICE_ID_SALE|PREORDER_END_DATE)=' .env.local || true)
if [ -z "$LINES" ]; then
  echo "❌ Aucune var livre trouvée dans .env.local"
  exit 1
fi

echo "📤 Copie des vars livre vers ${REMOTE_HOST}:${REMOTE_PATH}/.env.local"
echo "$LINES" | ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && touch .env.local && for v in STRIPE_PRICE_ID_PREORDER STRIPE_PRICE_ID_SALE PREORDER_END_DATE; do sed -i.bak \"/^\${v}=/d\" .env.local 2>/dev/null || true; done && cat >> .env.local && echo '✅ Vars livre mises à jour'"

echo ""
echo "🔄 Redémarrage PM2..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && pm2 restart aigile"
echo "✅ Terminé. Vérifiez https://aigile.lu/#book"
