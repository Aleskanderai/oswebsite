import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/*
  A frosted glass window: the background behind it (sky or gradient) shows through the
  bezel and title bar, the way Aside's sidebar lets its sky through. Alex's note on the
  product panel: "the background behind the product, plus glass and blur".
*/
export function Window({
  title,
  children,
  className,
  bodyClassName,
  size = 'md',
}: {
  title?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  size?: 'sm' | 'md'
}) {
  const sm = size === 'sm'
  return (
    <div
      className={cn(
        'relative bg-white/35 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65),0_0_0_1px_rgba(10,30,60,0.06),0_30px_60px_-30px_rgba(10,30,60,0.45)] [-webkit-backdrop-filter:saturate(170%)_blur(22px)] [backdrop-filter:saturate(170%)_blur(22px)]',
        sm ? 'rounded-[12px] p-1.5' : 'rounded-[14px] p-1.5 sm:rounded-[18px] sm:p-2',
        className,
      )}
    >
      <div className={cn('flex items-center', sm ? 'h-6 px-1.5' : 'h-7 px-2 sm:h-9')}>
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
        </span>
        {title && <span className={cn('mx-auto truncate pr-12 font-medium text-ink/70', sm ? 'text-[11px]' : 'text-[12px] sm:text-[13px]')}>{title}</span>}
      </div>
      <div className={cn('relative overflow-hidden bg-white shadow-[0_0_0_1px_rgba(10,30,60,0.08)]', sm ? 'mt-1 rounded-[8px]' : 'mt-1 rounded-[9px] sm:mt-1.5 sm:rounded-[11px]', bodyClassName)}>
        {children}
      </div>
    </div>
  )
}
