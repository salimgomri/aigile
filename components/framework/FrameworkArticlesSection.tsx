'use client'

import { ArrowUpRight, Clock } from 'lucide-react'
import { trackEvent } from '@/lib/gtag'
import type { FrameworkArticle } from '@/lib/framework/framework-articles'

type FrameworkArticlesSectionProps = {
  articles: FrameworkArticle[]
  lang: 'fr' | 'en'
  t: {
    uiEyebrowArticles: string
    uiArticlesTitle: string
    uiArticlesIntro: string
    articleReadOnLinkedIn: string
    articleComingSoon: string
    articleComingSoonHint: string
  }
}

export function FrameworkArticlesSection({ articles, lang, t }: FrameworkArticlesSectionProps) {
  if (articles.length === 0) return null

  return (
    <section id="fw-articles" className="fw-articles">
      <span className="fw-eyebrow">{t.uiEyebrowArticles}</span>
      <h2>{t.uiArticlesTitle}</h2>
      <p className="fw-articles__intro">{t.uiArticlesIntro}</p>

      <div className="fw-articles__grid">
        {articles.map((article, index) => {
          const indexLabel = String(index + 1).padStart(2, '0')
          const available = Boolean(article.link)

          if (available && article.link) {
            return (
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="fw-article-card fw-article-card--live"
                onClick={() =>
                  trackEvent('framework_article_click', {
                    source: 'framework_page',
                    article: article.id,
                    lang,
                  })
                }
              >
                <div className="fw-article-card__head">
                  <span className="fw-article-card__index" aria-hidden>
                    {indexLabel}
                  </span>
                  <span className="fw-article-card__badge fw-article-card__badge--live">
                    LinkedIn
                  </span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.desc}</p>
                <span className="fw-article-card__cta">
                  {t.articleReadOnLinkedIn}
                  <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden />
                </span>
              </a>
            )
          }

          return (
            <article
              key={article.id}
              className="fw-article-card fw-article-card--soon"
              aria-disabled="true"
            >
              <div className="fw-article-card__head">
                <span className="fw-article-card__index" aria-hidden>
                  {indexLabel}
                </span>
                <span className="fw-article-card__badge fw-article-card__badge--soon">
                  <Clock size={12} strokeWidth={2.2} aria-hidden />
                  {t.articleComingSoon}
                </span>
              </div>
              <h3>{article.title}</h3>
              <p>{article.desc}</p>
              <p className="fw-article-card__hint">{t.articleComingSoonHint}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
