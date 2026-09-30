import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'

export function SectionHeading({
  title,
  sub,
  align = 'left',
  className,
}: {
  title: ReactNode
  sub?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div className={cn(align === 'center' ? 'mx-auto text-center' : 'text-left', 'max-w-[880px]', className)}>
      <Reveal>
        <h2 className="display text-[32px] sm:text-[40px] lg:text-[48px]">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.06}>
          <p
            className={cn(
              'mt-4 text-[16px] leading-[1.6] text-ink-2 sm:text-[17px]',
              align === 'center' ? 'mx-auto max-w-[560px]' : 'max-w-[600px]',
            )}
          >
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  )
}
