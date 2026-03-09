#!/bin/bash
set -euo pipefail

REMOTE_HOST=${REMOTE_HOST:-root@144.91.91.88}
REMOTE_PATH=${REMOTE_PATH:-/var/www/aigile}
WEB_USER=${WEB_USER:-www-data}
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
  --exclude='out' \
  "${PROJECT_ROOT}/" "${REMOTE_HOST}:${REMOTE_PATH}/"

echo ""
echo -e "${GREEN}✅ Fichiers synchronisés${NC}"

# Supprimer l'ancien export statique (out) si présent - nginx doit proxy vers Node
echo ""
echo "🗑️  Suppression de l'ancien static export (out)..."
ssh "${REMOTE_HOST}" "rm -rf ${REMOTE_PATH}/out 2>/dev/null || true"

# Sur le serveur: npm install + permissions + restart
echo ""
echo "📦 Installation des dépendances sur le serveur..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && npm install --production"

echo ""
echo "🔐 Permissions (root pour PM2, nginx proxy ne lit pas les fichiers)..."
ssh "${REMOTE_HOST}" "chown -R root:root ${REMOTE_PATH} && chmod -R 755 ${REMOTE_PATH}"

echo ""
echo "🔄 Redémarrage PM2..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && (pm2 restart aigile 2>/dev/null || pm2 start npm --name aigile -- start 2>/dev/null || echo '⚠️ pm2 non configuré - lancez: cd ${REMOTE_PATH} && npm start')"

# Mettre à jour nginx pour proxy vers Node (au lieu de servir static/out)
if [ -f "${PROJECT_ROOT}/deploy/nginx-aigile.conf" ]; then
  echo ""
  echo "🌐 Mise à jour de la config nginx (proxy vers Node)..."
  ssh "${REMOTE_HOST}" "cp ${REMOTE_PATH}/deploy/nginx-aigile.conf /etc/nginx/sites-available/aigile.lu && nginx -t && systemctl reload nginx" || echo "⚠️ nginx reload échoué - vérifiez manuellement"
fi

echo ""
echo -e "${GREEN}✅ Déploiement terminé!${NC}"
echo "🌐 Site: https://aigile.lu"
