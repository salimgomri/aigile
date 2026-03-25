import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

/** Répertoire du projet (dossier contenant ce fichier), pas un lockfile parent (ex. /Volumes/T9/). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Removed 'output: export' to allow middleware and authentication
  // Static export is incompatible with Next.js middleware
  /** react-markdown v10 + unified (ESM) — évite des erreurs runtime Webpack côté client */
  transpilePackages: ['react-markdown'],
  images: {
    unoptimized: true,
  },
  basePath: '',
  // trailingSlash: true causes 500 errors with better-auth (get-session, sign-in/social)
  trailingSlash: false,
  /**
   * Plusieurs lockfiles (ex. parent + ce repo) : sans ça Next 15 infère une mauvaise racine
   * → 404 sur /_next/static/chunks/* en dev (HTML pointe vers des hashes absents).
   */
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
}

export default nextConfig
