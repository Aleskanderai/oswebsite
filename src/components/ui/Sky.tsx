import { useId, useRef } from 'react'
import { cn, media } from '@/lib/utils'
import { CloudPointerPixels } from './cloud-pointer-pixels'

/** Static clouds with the reference's softer blue; only nearby pointer flecks animate. */
export function Sky({ className }: { className?: string }) {
  const image = useRef<HTMLImageElement>(null)
  const filterId = `sky-blue-${useId().replace(/:/g, '')}`
  return (
    <div aria-hidden className={cn('pointer-events-none overflow-hidden bg-[#83c5ec]', className)}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            {/* Map the existing cloud luminance to #83c5ec → white, preserving the artwork. */}
            <feColorMatrix type="matrix" values=".754 0 0 0 .246 .349 0 0 0 .651 .115 0 0 0 .885 0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
      <img
        ref={image}
        src={media('hero-sky.webp')}
        alt=""
        fetchPriority="high"
        width={1536}
        height={1024}
        style={{ filter: `url(#${filterId}) blur(3px)` }}
        className="absolute inset-0 h-full w-full scale-[1.015] object-cover object-[18%_0%] sm:object-[50%_0%]"
      />
      <CloudPointerPixels imageRef={image} />
    </div>
  )
}
