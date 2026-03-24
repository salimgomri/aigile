#!/bin/bash
# Copie TOUTES les vars de .env.local local vers le serveur de prod (Hetzner).
# Puis applique ensure-env pour forcer les URLs prod (aigile.lu).
# IP / chemin par défaut : deploy/server-info.txt
# Usage: cd /Volumes/T9/aigile && bash deploy/sync-env.sh

set -euo pipefail

REMOTE_HOST=${REMOTE_HOST:-root@204.168.181.120}
REMOTE_PATH=${REMOTE_PATH:-/var/www/aigile.lu}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if [ ! -f .env.local ]; then
  echo "❌ .env.local introuvable."
  exit 1
fi

echo "📤 Copie de .env.local vers ${REMOTE_HOST}:${REMOTE_PATH}/"
# Backup serveur puis remplacement
ssh "${REMOTE_HOST}" "cp ${REMOTE_PATH}/.env.local ${REMOTE_PATH}/.env.local.bak.$(date +%Y%m%d%H%M) 2>/dev/null || true"
scp -q .env.local "${REMOTE_HOST}:${REMOTE_PATH}/.env.local"

echo "🔧 Application des URLs prod (BETTER_AUTH_URL, NEXT_PUBLIC_*)..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && bash deploy/ensure-env.sh .env.local"

echo ""
echo "🔄 Redémarrage PM2..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && pm2 restart aigile"

echo ""
echo "✅ Terminé. Toutes les vars sont synchronisées (Stripe, Supabase, Resend, Google, etc.)"
echo "   Les URLs ont été forcées à https://aigile.lu pour la prod."
