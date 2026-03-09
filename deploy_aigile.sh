#!/bin/bash
set -euo pipefail

REMOTE_HOST=${REMOTE_HOST:-root@144.91.91.88}
REMOTE_PATH=${REMOTE_PATH:-/var/www/aigile}
# Si exécuté depuis T9, utiliser ce chemin, sinon le chemin local
if [ -d "/Volumes/T9/aigile" ]; then
    PROJECT_ROOT="/Volumes/T9/aigile"
else
    PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🚀 Déploiement de aigile.lu${NC}"
echo "Serveur: ${REMOTE_HOST}"
echo "Destination: ${REMOTE_PATH}"
echo ""

# Build Next.js
echo "📦 Build Next.js..."
cd "${PROJECT_ROOT}"
npm run build
echo ""

rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env.local' \
  --exclude='.env' \
  --exclude='.DS_Store' \
  --exclude='._*' \
  --exclude='*.md' \
  --exclude='.next/cache' \
  --exclude='tests' \
  --exclude='scripts' \
  --exclude='supabase' \
  "${PROJECT_ROOT}/" "${REMOTE_HOST}:${REMOTE_PATH}/"

echo ""
echo -e "${GREEN}✅ Fichiers synchronisés${NC}"

# Sur le serveur: npm install + restart
echo ""
echo "📦 Installation des dépendances sur le serveur..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && npm install --production && (pm2 restart aigile 2>/dev/null || pm2 start npm --name aigile -- start 2>/dev/null || echo '⚠️ pm2 non configuré - lancez: cd ${REMOTE_PATH} && npm start')"

echo ""
echo -e "${GREEN}✅ Déploiement terminé!${NC}"
echo "🌐 Site: https://aigile.lu"
