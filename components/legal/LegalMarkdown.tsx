import fs from 'fs'
import path from 'path'
import ReactMarkdown from 'react-markdown'
import { HighlightTodos } from '@/components/legal/TodoMark'
import { getContactEmail } from '@/lib/site-facts'

function injectContact(md: string): string {
  const email = getContactEmail()
  return md.replace(/\[À COMPLÉTER : e-mail de contact professionnel\]/g, email.includes('@') ? email : '[À COMPLÉTER : e-mail de contact professionnel]')
}

export function readRefonteMarkdown(relativePath: string): string {
  const full = path.join(process.cwd(), 'docs/refonte', relativePath)
  return injectContact(fs.readFileSync(full, 'utf8'))
}

export function LegalMarkdown({ source }: { source: string }) {
  return (
    <div className="legal-prose">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl font-bold text-aigile-navy mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-aigile-navy mt-10 mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-aigile-navy mt-8 mb-3">{children}</h3>
          ),
          p: ({ children }) => <p className="text-gray-800 leading-relaxed mb-4">{children}</p>,
          li: ({ children }) => {
            const text = flattenText(children)
            return (
              <li className="mb-2 text-gray-800 leading-relaxed">
                <HighlightTodos text={text} />
              </li>
            )
          },
          a: ({ href, children }) => (
            <a href={href} className="text-aigile-blue hover:underline">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold text-aigile-navy">{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
          hr: () => <hr className="my-8 border-gray-200" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border border-gray-200">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-aigile-navy text-white text-left px-3 py-2 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-gray-200 px-3 py-2 align-top">
              <HighlightTodos text={flattenText(children)} />
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-aigile-gold pl-4 my-4 text-gray-700 italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}

function flattenText(node: unknown): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenText).join('')
  if (typeof node === 'object' && node !== null && 'props' in node) {
    const props = (node as { props?: { children?: unknown } }).props
    return flattenText(props?.children)
  }
  return ''
}
