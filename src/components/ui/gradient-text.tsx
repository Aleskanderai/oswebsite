"use client"

import { useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { useInView, type MotionProps } from 'motion/react'
import { cn } from '@/lib/utils'
import './gradient-text.css'

export interface GradientTextProps extends Omit<HTMLAttributes<HTMLElement>, keyof MotionProps> {
  children: ReactNode
  as?: ElementType
}

/** The supplied flowing-color text, clipped to the glyphs so any surface stays clear. */
export function GradientText({ className, children, as: Component = 'span', ...props }: GradientTextProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.1 })

  return (
    <Component ref={ref} className={cn('gradient-text', className)} data-active={inView} {...props}>
      {children}
    </Component>
  )
}
