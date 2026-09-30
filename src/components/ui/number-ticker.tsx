"use client"

import { useEffect, useMemo, useRef } from 'react'
import { useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

export interface NumberTickerProps {
  value: number
  direction?: 'up' | 'down'
  delay?: number
  decimalPlaces?: number
  className?: string
}

/** Real value first; the decorative count only starts in an actively rendering document. */
export function NumberTicker({ value, direction = 'up', delay = 0, decimalPlaces = 0, className }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const readingRef = useRef<HTMLSpanElement>(null)
  const animatingRef = useRef(false)
  const inView = useInView(ref, { once: true })
  const reducedMotion = useReducedMotion()
  const finiteValue = Number.isFinite(value) ? value : 0
  const start = direction === 'down' ? finiteValue : 0
  const end = direction === 'down' ? 0 : finiteValue
  const precision = Number.isFinite(decimalPlaces) ? Math.max(0, Math.min(20, Math.trunc(decimalPlaces))) : 0
  const formatter = useMemo(() => new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }), [precision])
  const initialText = formatter.format(start)
  const finalText = formatter.format(end)
  const motionValue = useMotionValue(end)
  const springValue = useSpring(motionValue, { damping: 40, stiffness: 200 })

  useMotionValueEvent(springValue, 'change', (latest) => {
    if (!readingRef.current || !animatingRef.current) return
    const bounded = Math.max(Math.min(start, end), Math.min(Math.max(start, end), latest))
    const activeDocument = document.visibilityState === 'visible' && document.hasFocus()
    readingRef.current.textContent = formatter.format(reducedMotion || !activeDocument ? end : bounded)
  })

  useEffect(() => {
    let frame: number | undefined
    let startTimer: number | undefined
    let settleTimer: number | undefined
    const activeDocument = () => document.visibilityState === 'visible' && document.hasFocus()
    const finish = () => {
      animatingRef.current = false
      if (frame !== undefined) window.cancelAnimationFrame(frame)
      if (startTimer !== undefined) window.clearTimeout(startTimer)
      if (settleTimer !== undefined) window.clearTimeout(settleTimer)
      motionValue.jump(end)
      springValue.jump(end)
      if (readingRef.current) readingRef.current.textContent = formatter.format(end)
    }
    finish()

    if (inView && !reducedMotion && activeDocument() && start !== end) {
      startTimer = window.setTimeout(() => {
        // A suspended RAF leaves the accurate, server-rendered value untouched.
        frame = window.requestAnimationFrame(() => {
          if (!activeDocument()) return
          motionValue.jump(start)
          springValue.jump(start)
          animatingRef.current = true
          if (readingRef.current) readingRef.current.textContent = formatter.format(start)
          motionValue.set(end)
          // Guarantee a final reading if spring frames stop after the entrance starts.
          settleTimer = window.setTimeout(finish, 2000)
        })
      }, Math.max(0, Number.isFinite(delay) ? delay : 0) * 1000)
    }
    const onVisibilityChange = () => { if (!activeDocument()) finish() }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('blur', finish)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('blur', finish)
      finish()
    }
  }, [delay, end, formatter, inView, motionValue, reducedMotion, springValue, start])

  return (
    <span ref={ref} className={cn('relative inline-grid whitespace-nowrap tabular-nums', className)}>
      <span className="sr-only">{finalText}</span>
      {/* Both endpoints reserve their width, so separators and digit changes cannot shift surrounding copy. */}
      <span aria-hidden className="invisible col-start-1 row-start-1">{initialText}</span>
      <span aria-hidden className="invisible col-start-1 row-start-1">{finalText}</span>
      <span ref={readingRef} aria-hidden className="col-start-1 row-start-1 text-right">{finalText}</span>
    </span>
  )
}
