import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const particles = [
  { x: -24, y: -18, color: '#ea745e', width: 3, height: 5, rotate: -35 },
  { x: -15, y: -29, color: '#b8bfcb', width: 4, height: 4, rotate: 20 },
  { x: 1, y: -32, color: '#f1c2af', width: 3, height: 5, rotate: -15 },
  { x: 19, y: -25, color: '#ea745e', width: 4, height: 4, rotate: 40 },
  { x: 28, y: -9, color: '#b8bfcb', width: 3, height: 5, rotate: 65 },
  { x: 24, y: 8, color: '#e5d8ca', width: 4, height: 4, rotate: -30 },
  { x: -22, y: 9, color: '#b8bfcb', width: 3, height: 5, rotate: 25 },
  { x: -30, y: -3, color: '#f1c2af', width: 4, height: 4, rotate: -55 },
] as const

/** Local, decorative celebration. The caller supplies confirmed success, never a click. */
export function SuccessParticles({ children, active, className }: {
  children: ReactNode
  active: boolean
  className?: string
}) {
  const reducedMotion = useReducedMotion()

  return (
    <span className={cn('relative inline-flex shrink-0 items-center justify-center', className)}>
      {active && !reducedMotion && (
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
          {particles.map((particle, index) => (
            <motion.span
              key={index}
              className="absolute rounded-full"
              style={{ width: particle.width, height: particle.height, backgroundColor: particle.color }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{
                x: [0, particle.x * 0.72, particle.x],
                y: [0, particle.y - 4, particle.y + 8],
                opacity: [0, 1, 0],
                scale: [0, 1, 0.45],
                rotate: [0, particle.rotate],
              }}
              transition={{ duration: 0.48, delay: index * 0.015, ease: 'easeOut' }}
            />
          ))}
        </span>
      )}
      {children}
    </span>
  )
}
