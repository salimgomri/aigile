import 'server-only'

import fs from 'fs'
import path from 'path'
import { parse } from 'yaml'

export type FrameworkArticle = {
  id: string
  title: string
  desc: string
  link: string | null
}

type ArticleLocale = {
  title?: string
  desc?: string
  link?: string | null
}

type ArticlesYaml = Record<string, { fr?: ArticleLocale; en?: ArticleLocale }>

const ARTICLES_PATH = path.join(process.cwd(), 'config', 'articles', 'framework.yml')

let cache: { fr: FrameworkArticle[]; en: FrameworkArticle[] } | null = null

function normalizeLink(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function loadArticles(): { fr: FrameworkArticle[]; en: FrameworkArticle[] } {
  const raw = fs.readFileSync(ARTICLES_PATH, 'utf8')
  const doc = parse(raw) as ArticlesYaml

  const ids = Object.keys(doc).sort((a, b) => {
    const na = Number.parseInt(a.replace(/\D/g, ''), 10) || 0
    const nb = Number.parseInt(b.replace(/\D/g, ''), 10) || 0
    return na - nb
  })

  const fr: FrameworkArticle[] = []
  const en: FrameworkArticle[] = []

  for (const id of ids) {
    const entry = doc[id]
    if (!entry) continue

    fr.push({
      id,
      title: entry.fr?.title?.trim() ?? '',
      desc: entry.fr?.desc?.trim() ?? '',
      link: normalizeLink(entry.fr?.link),
    })

    en.push({
      id,
      title: entry.en?.title?.trim() ?? '',
      desc: entry.en?.desc?.trim() ?? '',
      link: normalizeLink(entry.en?.link),
    })
  }

  return { fr, en }
}

export function getFrameworkArticlesByLang(): { fr: FrameworkArticle[]; en: FrameworkArticle[] } {
  if (!cache) {
    cache = loadArticles()
  }
  return cache
}
