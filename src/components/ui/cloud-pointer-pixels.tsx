import { useEffect, useRef, type RefObject } from 'react'

type Fleck = { x: number; y: number; born: number; size: number; white: boolean }

/** Small cloud-only marks. Nothing moves until a mouse does, and the RAF ends after fading. */
export function CloudPointerPixels({ imageRef }: { imageRef: RefObject<HTMLImageElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    const section = canvas?.closest('section')
    if (!canvas || !image || !section) return
    const context = canvas.getContext('2d')
    if (!context) return
    const allowed = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const sample = document.createElement('canvas')
    sample.width = 192
    sample.height = 128
    const sampleContext = sample.getContext('2d', { willReadFrequently: true })
    let pixels: Uint8ClampedArray | null = null
    let flecks: Fleck[] = []
    let frame = 0
    let last = 0
    let visible = true
    let width = 0
    let height = 0

    const load = () => {
      if (!sampleContext || !image.naturalWidth) return
      try {
        sampleContext.drawImage(image, 0, 0, sample.width, sample.height)
        pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data
      } catch { pixels = null }
    }
    const clear = () => {
      cancelAnimationFrame(frame)
      frame = 0
      flecks = []
      context.clearRect(0, 0, width, height)
    }
    const resize = () => {
      clear()
      width = canvas.clientWidth
      height = canvas.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const draw = (now: number) => {
      frame = 0
      context.clearRect(0, 0, width, height)
      flecks = flecks.filter((fleck) => now - fleck.born < 650)
      for (const fleck of flecks) {
        const life = (now - fleck.born) / 650
        const alpha = Math.min(life * 8, 1) * (1 - life) * (fleck.white ? .46 : .22)
        context.fillStyle = fleck.white ? `rgba(255,255,255,${alpha})` : `rgba(91,151,195,${alpha})`
        context.fillRect(fleck.x, fleck.y, fleck.size, fleck.size)
      }
      if (flecks.length) frame = requestAnimationFrame(draw)
    }
    const move = (event: PointerEvent) => {
      if (!allowed.matches || !visible || document.hidden || event.pointerType !== 'mouse' || !pixels) return
      if (event.target instanceof Element && event.target.closest('a,button,input,h1,#product,dialog')) return
      const now = performance.now()
      if (now - last < 45) return
      last = now
      const bounds = canvas.getBoundingClientRect()
      const imageBounds = image.getBoundingClientRect()
      const scale = Math.max(imageBounds.width / image.naturalWidth, imageBounds.height / image.naturalHeight)
      const drawnWidth = image.naturalWidth * scale
      const drawnHeight = image.naturalHeight * scale
      const position = getComputedStyle(image).objectPosition.split(' ').map((value) => Number.parseFloat(value) / 100)
      const imageLeft = imageBounds.left + (imageBounds.width - drawnWidth) * position[0]
      const imageTop = imageBounds.top + (imageBounds.height - drawnHeight) * position[1]
      for (let i = 0; i < 4; i++) {
        const x = Math.round((event.clientX - bounds.left + (Math.random() - .5) * 64) / 9) * 9
        const y = Math.round((event.clientY - bounds.top + (Math.random() - .5) * 64) / 9) * 9
        if (x < 0 || x > width || y < 0 || y > height) continue
        const sx = Math.floor((x + bounds.left - imageLeft) / drawnWidth * sample.width)
        const sy = Math.floor((y + bounds.top - imageTop) / drawnHeight * sample.height)
        if (sx < 0 || sx >= sample.width || sy < 0 || sy >= sample.height) continue
        const red = pixels[(sy * sample.width + sx) * 4]
        // The source sky is cyan. Its red channel cleanly separates it from cloud edges.
        if (red < 178 || flecks.some((fleck) => fleck.x === x && fleck.y === y)) continue
        flecks.push({ x, y, born: now, size: i % 3 ? 2 : 3, white: red < 225 })
      }
      flecks = flecks.slice(-48)
      if (flecks.length && !frame) frame = requestAnimationFrame(draw)
    }
    const visibility = () => { if (document.hidden) clear() }
    const preferences = () => { if (!allowed.matches) clear() }
    const observer = new ResizeObserver(resize)
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) clear() })
    observer.observe(canvas)
    intersection.observe(canvas)
    image.addEventListener('load', load)
    if (image.complete) load()
    section.addEventListener('pointermove', move, { passive: true })
    allowed.addEventListener('change', preferences)
    document.addEventListener('visibilitychange', visibility)
    resize()
    return () => {
      clear()
      observer.disconnect()
      intersection.disconnect()
      image.removeEventListener('load', load)
      section.removeEventListener('pointermove', move)
      allowed.removeEventListener('change', preferences)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [imageRef])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
