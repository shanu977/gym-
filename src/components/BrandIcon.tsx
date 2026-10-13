type BrandIconProps = { size?: number; title?: string; className?: string }

export function BrandIcon({ size = 26, title, className }: BrandIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <g fill="currentColor">
        <rect x="4" y="18" width="10" height="28" rx="4" />
        <rect x="50" y="18" width="10" height="28" rx="4" />
      </g>
      <path d="M14 38H24L32 22L40 38H50" fill="none" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
    </svg>
  )
}
