type AigileWordmarkProps = {
  className?: string
  /** Hauteur en px — la largeur suit le ratio du viewBox */
  height?: number
  title?: string
}

const VIEWBOX_WIDTH = 300
const VIEWBOX_HEIGHT = 72

/**
 * Wordmark AIgile — A et I en pastilles or, « gile » en serif.
 * SVG scalable pour navbar, hero, manifeste, framework, etc.
 */
export function AigileWordmark({
  className,
  height = 56,
  title = 'AIgile',
}: AigileWordmarkProps) {
  const width = Math.round((height / VIEWBOX_HEIGHT) * VIEWBOX_WIDTH)
  const sizeProps = className
    ? {}
    : {
        width,
        height,
      }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="img"
      aria-label={title}
      className={className}
      {...sizeProps}
    >
      <title>{title}</title>
      <rect x="0" y="4" width="56" height="56" rx="12" fill="#FEDB10" />
      <text
        x="28"
        y="44"
        textAnchor="middle"
        fontFamily="var(--font-inter, Inter, system-ui, sans-serif)"
        fontWeight="800"
        fontSize="32"
        fill="#1C1B19"
      >
        A
      </text>
      <rect x="64" y="4" width="44" height="56" rx="12" fill="#FEDB10" />
      <text
        x="86"
        y="44"
        textAnchor="middle"
        fontFamily="var(--font-inter, Inter, system-ui, sans-serif)"
        fontWeight="800"
        fontSize="32"
        fill="#1C1B19"
      >
        I
      </text>
      <text
        x="118"
        y="50"
        fontFamily="var(--font-serif-display, Newsreader, Georgia, serif)"
        fontSize="52"
        fill="#1C1B19"
      >
        gile
      </text>
    </svg>
  )
}
