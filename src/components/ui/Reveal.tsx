import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE } from '@/lib/utils'

type Props = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
}

/** Fade and lift once when the element scrolls into view. No blur: Alex flagged blur as the weird part. */
export function Reveal({ children, delay = 0, y = 12, className, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.48, ease: EASE, delay }}
    >
      {children}
    </Comp>
  )
}
