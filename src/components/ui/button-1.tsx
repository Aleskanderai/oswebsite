import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import './accent-buttons.css'

export interface Button1Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Restrained hover light; it never changes the label's black background. */
  accent?: string
}

/** A native button, with no demo destination or automatic external navigation. */
export const Button1 = forwardRef<HTMLButtonElement, Button1Props>(function Button1(
  { children = 'Continue', accent = '#8cbed8', className, style, type = 'button', ...props },
  ref,
) {
  const colors = { '--button-one-accent': accent, ...style } as CSSProperties
  return (
    <button {...props} ref={ref} type={type} className={cn('button-one', className)} style={colors}>
      <span className="button-one__label">{children}</span>
      <ArrowRight className="button-one__arrow" size={16} strokeWidth={1.7} aria-hidden="true" />
    </button>
  )
})

export default Button1
