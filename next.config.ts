import type { NextConfig } from 'next'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

/** Répertoire du projet (dossier contenant ce fichier), pas un lockfile parent (ex. /Volumes/T9/). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/**
 * Sortie build Next.js : par défaut `.next` dans le repo.
 * Si `NEXT_DIST_DIR` est défini (ex. dans `.env.local`), il prime.
 * Sinon, dépôt sur le volume T9 (`/Volumes/T9/aigile/...`) → build dans un dossier voisin sur le même volume :
 * `/Volumes/T9/aigile-next-build` (évite de mélanger avec la racine du repo, tout reste sur T9).
 */
function resolveDistDir(): string {
  if (process.env.NEXT_DIST_DIR?.trim()) {
    return path.resolve(projectRoot, process.env.NEXT_DIST_DIR.trim())
  }
  const onT9 =
    projectRoot.startsWith('/Volumes/T9/') && fs.existsSync('/Volumes/T9')
  if (onT9) {
    return path.resolve(projectRoot, '..', 'aigile-next-build')
  }
  return '.next'
}

const nextConfig: NextConfig = {
  distDir: resolveDistDir(),
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
