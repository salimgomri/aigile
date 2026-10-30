/**
 * Liste les [À COMPLÉTER] / [À CONFIRMER] / [À CHOISIR] / [LIEN STRIPE] / [LIEN AMAZON]
 * --fail-indexable : échoue s'il en reste dans des pages indexables (hors noindex).
 */
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const TOKEN = /\[(?:À COMPLÉTER|À CONFIRMER|À CHOISIR|LIEN STRIPE|LIEN AMAZON)[^\]]*\]/g

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'docs',
  'archives',
  'private',
])

const INDEXABLE_GLOBS = [
  'app/page.tsx',
  'components/home-v2/',
  'app/mentions-legales/',
  'app/cgv/',
  'app/privacy/',
  'app/contact/',
  'app/kit/',
  'app/diagnostic/',
  'app/salim/',
  'components/salim/',
  'lib/site-facts.ts',
]

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name.startsWith('.')) continue
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full, acc)
    else if (/\.(ts|tsx|js|jsx|md|html|css)$/.test(name)) acc.push(full)
  }
  return acc
}

function isIndexable(file: string): boolean {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  if (rel.includes('home-v2/page.tsx') || rel.includes('home-legacy')) return false
  if (rel.includes('formations/')) return false
  if (rel.includes('/admin/')) return false
  if (rel.includes('telechargement')) return false
  return INDEXABLE_GLOBS.some((g) => rel === g || rel.startsWith(g))
}

const files = walk(ROOT)
const hits: { file: string; line: number; text: string; indexable: boolean }[] = []

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    const m = line.match(TOKEN)
    if (!m) return
    for (const t of m) {
      hits.push({
        file: path.relative(ROOT, file),
        line: i + 1,
        text: t,
        indexable: isIndexable(file),
      })
    }
  })
}

for (const h of hits) {
  const flag = h.indexable ? 'INDEXABLE' : 'ok'
  console.log(`${flag}\t${h.file}:${h.line}\t${h.text}`)
}

console.log(`\nTotal: ${hits.length} · dont indexables: ${hits.filter((h) => h.indexable).length}`)

const failIndexable = process.argv.includes('--fail-indexable')
if (failIndexable && hits.some((h) => h.indexable)) {
  console.error('\ncheck:todo — des [À COMPLÉTER] restent sur des pages indexables. Remplir avant mise en ligne.')
  process.exit(1)
}
