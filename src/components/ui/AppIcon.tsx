import type { Brand } from '@/lib/brands'
import { cn } from '@/lib/utils'

/** A real app mark on a small white tile, the way the Dock and Aside show them. */
export function AppIcon({ brand, size = 32, className, bare = false }: { brand: Brand; size?: number; className?: string; bare?: boolean }) {
  // a `tile` brand is always drawn white on its own colour, even bare
  const glyph = Math.round(size * (bare ? (brand.tile ? 0.7 : 1) : 0.54))
  const mark = (
    <svg viewBox="0 0 24 24" width={glyph} height={glyph} aria-hidden="true">
      <path d={brand.path} fill={brand.tile ? '#fff' : `#${brand.hex}`} />
    </svg>
  )
  if (bare && !brand.tile) return <span className={cn('inline-flex shrink-0', className)}>{mark}</span>
  if (bare)
    return (
      <span className={cn('inline-flex shrink-0 items-center justify-center', className)} style={{ width: size, height: size, borderRadius: Math.round(size * 0.26), background: `#${brand.hex}` }}>
        {mark}
      </span>
    )
  // A `tile` brand (arXiv) keeps the white tile like the rest, with its own colour as a
  // smaller rounded square inside, so it sits in a row of marks without reading as a block.
  const inner = brand.tile ? (
    <span className="inline-flex items-center justify-center" style={{ width: Math.round(size * 0.62), height: Math.round(size * 0.62), borderRadius: Math.round(size * 0.16), background: `#${brand.hex}` }}>
      <svg viewBox="0 0 24 24" width={Math.round(size * 0.42)} height={Math.round(size * 0.42)} aria-hidden="true">
        <path d={brand.path} fill="#fff" />
      </svg>
    </span>
  ) : (
    mark
  )
  return (
    <span
      title={brand.title}
      className={cn('inline-flex shrink-0 items-center justify-center bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.09),0_1px_2px_rgba(0,0,0,0.05)]', className)}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.26) }}
    >
      {inner}
    </span>
  )
}

/** A few overlapping app tiles, for "this swarm uses these tools". */
export function AppStack({ brands, size = 28 }: { brands: Brand[]; size?: number }) {
  return (
    <span className="flex">
      {brands.map((b, i) => (
        <AppIcon key={b.title} brand={b} size={size} className={cn(i > 0 && '-ml-1.5', 'ring-2 ring-white')} />
      ))}
    </span>
  )
}
