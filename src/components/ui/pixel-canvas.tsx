"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface PixelCanvasProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number
  speed?: number
  colors?: string[]
  variant?: 'default' | 'icon'
  noFocus?: boolean
}

/** A CSS-pixel particle; the canvas backing resolution is deliberately unrelated. */
class Pixel {
  x: number
  y: number
  color: string
  delay: number
  maxSize: number
  phase: number
  elapsed = 0
  size = 0

  constructor(x: number, y: number, color: string, delay: number) {
    this.x = x
    this.y = y
    this.color = color
    this.delay = delay
    this.maxSize = 1 + Math.random() * 1.7
    this.phase = Math.random() * Math.PI * 2
  }

  draw(context: CanvasRenderingContext2D, delta: number, active: boolean, speed: number) {
    if (active) {
      this.elapsed += delta
      if (this.elapsed < this.delay) return false
      const shimmer = 0.75 + Math.sin(this.elapsed * speed * 0.15 + this.phase) * 0.25
      this.size += (this.maxSize * shimmer - this.size) * Math.min(1, delta * 16)
    } else {
      this.elapsed = 0
      this.size = Math.max(0, this.size - delta * 12)
    }
    if (this.size < 0.02) return false
    context.fillStyle = this.color
    context.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
    return true
  }

  reset() {
    this.elapsed = 0
    this.size = 0
  }
}

/** Decorative hover/focus feedback for its parent, never a separate interaction target. */
export const PixelCanvas = forwardRef<HTMLDivElement, PixelCanvasProps>(function PixelCanvas(
  { gap = 9, speed = 25, colors = ['#f8fafc', '#cbd5e1', '#94a3b8'], variant = 'default', noFocus = false, style, ...props },
  forwardedRef,
) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // A stable value means a parent's fresh color-array literal will not restart the effect.
  const paletteKey = colors.join('|')
  useImperativeHandle(forwardedRef, () => hostRef.current!, [])

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    const parent = host?.parentElement
    const context = canvas?.getContext('2d')
    if (!host || !canvas || !parent || !context) return

    const palette = paletteKey.split('|').filter(Boolean)
    if (!palette.length) return
    const spacing = Math.max(4, Math.min(50, gap))
    const rate = Math.max(0, Math.min(100, speed))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let width = 0
    let height = 0
    let pixels: Pixel[] = []
    let frame: number | null = null
    let previousTime = 0
    let hovered = false
    let focused = false
    let visible = false
    let windowActive = document.hasFocus()

    const cancel = () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      frame = null
      previousTime = 0
    }
    const clear = () => {
      context.clearRect(0, 0, width, height)
      pixels.forEach((pixel) => pixel.reset())
    }
    const available = () => visible && !document.hidden && windowActive && !reducedMotion.matches
    const animate = (time: number) => {
      frame = null
      if (!available()) {
        clear()
        return
      }
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60
      previousTime = time
      const active = hovered || focused
      context.clearRect(0, 0, width, height)
      let hasPixels = false
      for (const pixel of pixels) {
        hasPixels = pixel.draw(context, delta, active, rate) || hasPixels
      }
      if (active || hasPixels) frame = window.requestAnimationFrame(animate)
      else previousTime = 0
    }
    const update = () => {
      if (!available()) {
        cancel()
        clear()
      } else if (frame === null && (hovered || focused || pixels.some((pixel) => pixel.size > 0))) {
        previousTime = 0
        frame = window.requestAnimationFrame(animate)
      }
    }
    const resize = () => {
      cancel()
      const bounds = host.getBoundingClientRect()
      width = Math.round(bounds.width)
      height = Math.round(bounds.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      pixels = []
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const distance = variant === 'icon'
            ? Math.hypot(x - width / 2, y - height / 2)
            : Math.hypot(x, height - y)
          pixels.push(new Pixel(x, y, palette[Math.floor(Math.random() * palette.length)], distance / 700))
        }
      }
      update()
    }
    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !finePointer.matches) return
      hovered = true
      update()
    }
    const onPointerLeave = () => {
      hovered = false
      update()
    }
    const onFocusIn = () => {
      focused = !noFocus && Boolean(parent.querySelector(':focus-visible'))
      update()
    }
    const onFocusOut = (event: FocusEvent) => {
      // Moving between children is still focus within the same card.
      if (event.relatedTarget instanceof Node && parent.contains(event.relatedTarget)) return
      focused = false
      update()
    }
    const onWindowFocus = () => {
      windowActive = true
      update()
    }
    const onWindowBlur = () => {
      windowActive = false
      hovered = false
      update()
    }
    const onPreferenceChange = () => {
      if (!finePointer.matches) hovered = false
      update()
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    const resizeObserver = new ResizeObserver(resize)
    intersectionObserver.observe(host)
    resizeObserver.observe(host)
    parent.addEventListener('pointerenter', onPointerEnter)
    parent.addEventListener('pointerleave', onPointerLeave)
    parent.addEventListener('pointercancel', onPointerLeave)
    parent.addEventListener('focusin', onFocusIn)
    parent.addEventListener('focusout', onFocusOut)
    document.addEventListener('visibilitychange', update)
    window.addEventListener('focus', onWindowFocus)
    window.addEventListener('blur', onWindowBlur)
    reducedMotion.addEventListener('change', onPreferenceChange)
    finePointer.addEventListener('change', onPreferenceChange)
    resize()

    return () => {
      cancel()
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      parent.removeEventListener('pointerenter', onPointerEnter)
      parent.removeEventListener('pointerleave', onPointerLeave)
      parent.removeEventListener('pointercancel', onPointerLeave)
      parent.removeEventListener('focusin', onFocusIn)
      parent.removeEventListener('focusout', onFocusOut)
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('focus', onWindowFocus)
      window.removeEventListener('blur', onWindowBlur)
      reducedMotion.removeEventListener('change', onPreferenceChange)
      finePointer.removeEventListener('change', onPreferenceChange)
    }
  }, [gap, speed, paletteKey, variant, noFocus])

  return (
    <div
      {...props}
      ref={hostRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', ...style }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
})
