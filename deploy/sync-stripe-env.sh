#!/bin/bash
# Copie les vars Stripe (clés + price IDs) de .env.local local vers le serveur de prod.
# Nécessaire car le deploy exclut .env.local — le serveur doit avoir les clés live.
# IP / chemin : deploy/server-info.txt
# Usage: cd /Volumes/T9/aigile && bash deploy/sync-stripe-env.sh

set -euo pipefail

REMOTE_HOST=${REMOTE_HOST:-root@204.168.181.120}
REMOTE_PATH=${REMOTE_PATH:-/var/www/aigile.lu}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if [ ! -f .env.local ]; then
  echo "❌ .env.local introuvable."
  exit 1
fi

# Vars Stripe à synchroniser
VARS="STRIPE_SECRET_KEY STRIPE_PUBLISHABLE_KEY STRIPE_WEBHOOK_SECRET"
VARS="$VARS STRIPE_PRICE_ID_PREORDER STRIPE_PRICE_ID_SALE STRIPE_PRICE_ID_PRO_MONTHLY STRIPE_PRICE_ID_PRO_ANNUAL"
VARS="$VARS STRIPE_PRICE_ID_DAY_PASS STRIPE_PRICE_ID_CREDITS_10 PREORDER_END_DATE"

LINES=$(grep -E "^($(echo $VARS | tr ' ' '|'))=" .env.local || true)
if [ -z "$LINES" ]; then
  echo "❌ Aucune var Stripe trouvée dans .env.local"
  exit 1
fi

echo "📤 Copie des vars Stripe vers ${REMOTE_HOST}:${REMOTE_PATH}/.env.local"
for v in $VARS; do
  ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && sed -i.bak \"/^${v}=/d\" .env.local 2>/dev/null || true"
done
echo "$LINES" | ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && cat >> .env.local"
echo "✅ Vars Stripe mises à jour"

echo ""
echo "🔄 Redémarrage PM2..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && pm2 restart aigile"
echo "✅ Terminé. Stripe en mode live sur aigile.lu"
echo ""
echo "Vérifiez: curl -s -X POST https://aigile.lu/api/checkout/validate-coupon -H 'Content-Type: application/json' -d '{\"code\":\"SALIM10\",\"productId\":\"book_preorder\"}'"
