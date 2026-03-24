#!/bin/bash
set -euo pipefail
# Infos serveur : deploy/server-info.txt (Hetzner systeme-salim, CX23, hel1)

REMOTE_HOST=${REMOTE_HOST:-root@204.168.181.120}
REMOTE_PATH=${REMOTE_PATH:-/var/www/aigile.lu}
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

ssh "${REMOTE_HOST}" "mkdir -p ${REMOTE_PATH}"

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
echo "🔧 Vérification des variables d'environnement (BETTER_AUTH_URL, NEXT_PUBLIC_APP_URL, Stripe)..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && (test -f deploy/ensure-env.sh && bash deploy/ensure-env.sh .env.local 2>/dev/null; test -f .env && bash deploy/ensure-env.sh .env 2>/dev/null) || true"
# Vérifier les vars requises pour le bouton livre (sinon /api/book/pricing → 404)
ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && (grep -q '^STRIPE_PRICE_ID_PREORDER=' .env.local 2>/dev/null || grep -q '^STRIPE_PRICE_ID_PREORDER=' .env 2>/dev/null) && (grep -q '^STRIPE_PRICE_ID_SALE=' .env.local 2>/dev/null || grep -q '^STRIPE_PRICE_ID_SALE=' .env 2>/dev/null) && (grep -q '^PREORDER_END_DATE=' .env.local 2>/dev/null || grep -q '^PREORDER_END_DATE=' .env 2>/dev/null) || echo '⚠️  Bouton livre: ajoutez STRIPE_PRICE_ID_PREORDER, STRIPE_PRICE_ID_SALE, PREORDER_END_DATE dans .env.local sur le serveur'"

echo ""
echo "🔄 Redémarrage PM2..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_PATH} && (pm2 restart aigile 2>/dev/null || pm2 start npm --name aigile -- start 2>/dev/null || echo '⚠️ pm2 non configuré - lancez: cd ${REMOTE_PATH} && npm start')"

# Mettre à jour nginx pour proxy vers Node (au lieu de servir static/out)
if [ -f "${PROJECT_ROOT}/deploy/nginx-aigile.conf" ]; then
  echo ""
  echo "🌐 Mise à jour de la config nginx (proxy vers Node)..."
  if ssh "${REMOTE_HOST}" "test -f /etc/letsencrypt/live/aigile.lu/fullchain.pem" 2>/dev/null; then
    ssh "${REMOTE_HOST}" "cp ${REMOTE_PATH}/deploy/nginx-aigile.conf /etc/nginx/sites-available/aigile.lu && nginx -t && systemctl reload nginx" || echo "⚠️ nginx reload échoué - vérifiez manuellement"
  else
    scp "${PROJECT_ROOT}/deploy/nginx-aigile.pressl.conf" "${REMOTE_HOST}:/etc/nginx/sites-available/aigile.lu"
    ssh "${REMOTE_HOST}" "nginx -t && systemctl reload nginx" || echo "⚠️ nginx reload échoué"
    echo "ℹ️  Pas encore de certificat TLS : après DNS + certbot, relancez deploy pour appliquer deploy/nginx-aigile.conf"
  fi
fi

echo ""
echo "📊 Test post-deploy SEO..."
curl -sI --max-time 15 https://aigile.lu/sitemap.xml | head -3 || true
curl -sI --max-time 15 https://aigile.lu/tools | head -3 || true
curl -sI --max-time 15 https://aigile.lu/robots.txt | head -3 || true

echo ""
echo -e "${GREEN}✅ Déploiement terminé!${NC}"
echo "🌐 Site: https://aigile.lu"
echo "📊 Vérifie GA4 realtime + GSC dans 24h"
