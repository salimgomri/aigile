#!/bin/bash
# Usage (une fois, depuis ton Mac) : REMOTE_HOST=root@IP ./deploy/bootstrap-aigile-server.sh
set -euo pipefail

REMOTE_HOST=${REMOTE_HOST:-root@204.168.181.120}
REMOTE_PATH=${REMOTE_PATH:-/var/www/aigile.lu}
if [ -d "/Volumes/T9/aigile" ]; then
  PROJECT_ROOT="/Volumes/T9/aigile"
else
  PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fi

echo "🔧 Bootstrap sur ${REMOTE_HOST} → ${REMOTE_PATH}"

ssh "${REMOTE_HOST}" "mkdir -p ${REMOTE_PATH}"

ssh "${REMOTE_HOST}" bash -s <<'REMOTE'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq nginx certbot python3-certbot-nginx curl ca-certificates
REMOTE

ssh "${REMOTE_HOST}" bash -s <<'REMOTE'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -qq nodejs
fi
command -v npm >/dev/null && npm install -g pm2
REMOTE

scp "${PROJECT_ROOT}/deploy/nginx-aigile.pressl.conf" "${REMOTE_HOST}:/etc/nginx/sites-available/aigile.lu"

ssh "${REMOTE_HOST}" bash -s <<'REMOTE'
set -euo pipefail
ln -sf /etc/nginx/sites-available/aigile.lu /etc/nginx/sites-enabled/aigile.lu
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
REMOTE

echo ""
echo "✅ nginx (HTTP) + Node + pm2 prêts."
echo ""
echo "1) DNS : enregistrement A aigile.lu → IP du serveur (+ www si besoin)."
echo "2) Puis sur le serveur : certbot --nginx -d aigile.lu -d www.aigile.lu"
echo "3) Copier .env.local sur ${REMOTE_PATH}/"
echo "4) REMOTE_HOST=${REMOTE_HOST} npm run deploy"
