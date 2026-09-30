import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import './accent-buttons.css'

export interface AntiMetalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Use a light accent with sufficient contrast against accentForeground. */
  accent?: string
  accentForeground?: string
}

/** A compact action whose expanding accent stays inside the reserved arrow area. */
export const AntiMetalButton = forwardRef<HTMLButtonElement, AntiMetalButtonProps>(function AntiMetalButton(
  { children = 'Continue', accent = '#d2e8f5', accentForeground = '#19313e', className, style, type = 'button', ...props },
  ref,
) {
  const colors = { '--anti-metal-accent': accent, '--anti-metal-accent-ink': accentForeground, ...style } as CSSProperties
  return (
    <button {...props} ref={ref} type={type} className={cn('anti-metal-button', className)} style={colors}>
      <span className="anti-metal-button__label">{children}</span>
      <span className="anti-metal-button__panel" aria-hidden="true">
        <span className="anti-metal-button__dots"><i /><i /><i /></span>
        <ChevronRight size={17} strokeWidth={1.8} />
      </span>
    </button>
  )
})

export default AntiMetalButton
