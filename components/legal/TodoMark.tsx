import type { ReactNode } from 'react'

const TODO_RE = /(\[(?:À COMPLÉTER|À CONFIRMER|À CHOISIR|LIEN STRIPE|LIEN AMAZON)[^\]]*\])/g

export function isTodoToken(text: string): boolean {
  return (
    text.includes('[À COMPLÉTER') ||
    text.includes('[À CONFIRMER') ||
    text.includes('[À CHOISIR') ||
    text.includes('[LIEN STRIPE') ||
    text.includes('[LIEN AMAZON')
  )
}

export function TodoMark({ children }: { children: ReactNode }) {
  return (
    <mark className="todo-mark" title="À remplir par Salim avant mise en ligne">
      {children}
    </mark>
  )
}

/** Découpe un texte et surligne les jetons [À COMPLÉTER] / [À CONFIRMER] / etc. */
export function HighlightTodos({ text }: { text: string }) {
  if (!isTodoToken(text)) return <>{text}</>
  const parts = text.split(TODO_RE)
  return (
    <>
      {parts.map((part, i) =>
        isTodoToken(part) ? (
          <TodoMark key={`${part}-${i}`}>{part}</TodoMark>
        ) : (
          <span key={`${part}-${i}`}>{part}</span>
        ),
      )}
    </>
  )
}
