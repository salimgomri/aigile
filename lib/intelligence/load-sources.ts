import 'server-only'

import fs from 'fs'
import path from 'path'
import { parse } from 'yaml'
import type { IntelligenceSourcesFile } from '@/lib/intelligence/types'

const FILE = path.join(process.cwd(), 'config', 'intelligence', 'sources.yml')

export function loadIntelligenceSources(): IntelligenceSourcesFile {
  const raw = fs.readFileSync(FILE, 'utf8')
  const data = parse(raw) as unknown as IntelligenceSourcesFile
  if (!data?.tiers || !Array.isArray(data.tiers)) {
    throw new Error('sources.yml: invalid structure (tiers missing)')
  }
  return data
}
