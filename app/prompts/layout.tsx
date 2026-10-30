import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompts',
  robots: { index: false, follow: false },
}

export default function PromptsLayout({ children }: { children: React.ReactNode }) {
  return children
}
