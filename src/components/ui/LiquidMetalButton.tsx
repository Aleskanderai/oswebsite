import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/** Reflective silver shell and a black face, inside the original 44px CTA footprint. */
export function LiquidMetalButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cn('liquid-metal-control group relative inline-flex h-11 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-[9px] px-3.5 text-[13px] font-medium text-white sm:px-4 sm:text-[14px]', className)}>
      {children}
    </button>
  )
}
