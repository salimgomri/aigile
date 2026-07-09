import Image from 'next/image'

const LOGO_SRC = '/images/aigile-logo.svg'
const ASPECT = 118 / 50

const HEIGHTS = {
  nav: 44,
  md: 52,
  hero: 64,
  lg: 80,
} as const

export type AigileLogoSize = keyof typeof HEIGHTS

type AigileLogoProps = {
  size?: AigileLogoSize
  className?: string
  priority?: boolean
}

/** Logo officiel AIgile (SVG) — scalable, A+I en pastille or. */
export function AigileLogo({ size = 'nav', className, priority }: AigileLogoProps) {
  const height = HEIGHTS[size]
  const width = Math.round(height * ASPECT)

  return (
    <Image
      src={LOGO_SRC}
      alt="AIgile"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  )
}
