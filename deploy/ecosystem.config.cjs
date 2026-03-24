/**
 * PM2 — charge .env.local avant Next (évite process.env vide si démarrage sans reload).
 * Usage sur le serveur : pm2 startOrReload deploy/ecosystem.config.cjs
 */
const path = require('path')
const root = path.resolve(__dirname, '..')

require('dotenv').config({ path: path.join(root, '.env.local') })
require('dotenv').config({ path: path.join(root, '.env.production.local') })

module.exports = {
  apps: [
    {
      name: 'aigile',
      cwd: root,
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        ...process.env,
      },
    },
  ],
}
