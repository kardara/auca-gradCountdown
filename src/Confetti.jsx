import { useEffect, useRef } from 'react'

// Confetti on a fixed canvas: a big burst on load, then a burst every couple of
// seconds for a continuous celebration. Fire an extra one with celebrate().
const COLORS = ['#e9b632', '#f6d784', '#ffffff', '#3d8bf0', '#0b5cbf']
const REPEAT_MS = 5000
const MAX_PIECES = 500

export function celebrate(amount = 160) {
  window.dispatchEvent(new CustomEvent('celebrate', { detail: amount }))
}

const pick = (list) => list[(Math.random() * list.length) | 0]

export default function Confetti() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let pieces = []
    let w = 0
    let h = 0
    let raf = 0
    let last = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const burst = (n) => {
      n = Math.min(n, MAX_PIECES - pieces.length)
      for (let i = 0; i < n; i++) {
        const fromLeft = i % 2 === 0
        pieces.push({
          x: fromLeft ? -10 : w + 10,
          y: h * (0.35 + Math.random() * 0.3),
          vx: (fromLeft ? 1 : -1) * (4 + Math.random() * 9),
          vy: -(8 + Math.random() * 10),
          size: 6 + Math.random() * 7,
          ratio: 0.35 + Math.random() * 0.4,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          tilt: Math.random() * Math.PI,
          vt: 0.05 + Math.random() * 0.1,
          color: pick(COLORS),
          life: 0,
        })
      }
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    const tick = (t) => {
      const dt = Math.min(3, (t - last) / 16.67) // frames elapsed, capped after tab switches
      last = t
      ctx.clearRect(0, 0, w, h)
      pieces = pieces.filter((p) => p.y < h + 40 && p.life < 600)
      for (const p of pieces) {
        p.life += dt
        p.vy = Math.min(p.vy + 0.22 * dt, 4.2)
        p.vx *= Math.pow(0.985, dt)
        p.x += (p.vx + Math.sin(p.life / 18) * 0.6) * dt
        p.y += p.vy * dt
        p.rot += p.vr * dt
        p.tilt += p.vt * dt
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.scale(1, Math.cos(p.tilt))
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, (-p.size * p.ratio) / 2, p.size, p.size * p.ratio)
        ctx.restore()
      }
      raf = pieces.length ? requestAnimationFrame(tick) : 0
    }

    const onCelebrate = (e) => burst(e.detail || 160)
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('celebrate', onCelebrate)
    const first = setTimeout(() => burst(180), 700)
    // Smaller repeat bursts (fewer on phones); skipped while the tab is hidden.
    const repeat = setInterval(() => {
      if (!document.hidden) burst(w < 640 ? 45 : 80)
    }, REPEAT_MS)

    return () => {
      clearTimeout(first)
      clearInterval(repeat)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('celebrate', onCelebrate)
    }
  }, [])

  return <canvas ref={ref} className="confetti" aria-hidden="true" />
}
