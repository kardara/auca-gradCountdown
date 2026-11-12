// Draws the personalised graduation frame on a canvas. Everything runs in the
// browser: the photo is never uploaded anywhere.
//
// One format: 4:5 portrait (1080 × 1350), the size Instagram prefers and one
// that WhatsApp status, Facebook and LinkedIn all show well. The photo window
// is tall so portrait graduation photos keep the cap and gown in frame.

const SANS = '"Hanken Grotesk", system-ui, sans-serif'
const SERIF = '"Instrument Serif", Georgia, serif'
const BLUE = '#0a57b5'
const GOLD = '#e9b632'

export const W = 1080
export const H = 1350

export const THEMES = {
  light: {
    label: 'Classic white',
    bg: '#ffffff',
    name: '#03254f',
    eyebrow: BLUE,
    meta: '#5d6b7e',
    rule: '#e2e7ee',
    placeholder: ['#eef2f7', '#d6dfea', '#8797ad'],
    sealRing: false,
  },
  navy: {
    label: 'AUCA navy',
    bg: '#03254f',
    name: '#ffffff',
    eyebrow: GOLD,
    meta: 'rgba(255,255,255,0.72)',
    rule: 'rgba(255,255,255,0.18)',
    placeholder: ['#0b3a72', '#1b4c88', 'rgba(255,255,255,0.6)'],
    sealRing: true,
  },
}

// Where the photo sits (canvas pixels).
export const PHOTO = { x: 48, y: 48, w: 984, h: 980, r: 6 }

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function loadFrameFonts() {
  return Promise.all(
    [`400 80px ${SERIF}`, `700 24px ${SANS}`, `500 28px ${SANS}`].map((f) => document.fonts.load(f))
  ).catch(() => {})
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function caps(ctx, text, x, y, size, color, spacing = 0.24) {
  ctx.font = `700 ${size}px ${SANS}`
  ctx.fillStyle = color
  ctx.letterSpacing = `${size * spacing}px`
  ctx.fillText(text, x, y)
  ctx.letterSpacing = '0px'
}

// Picks a font size that fits; wraps onto two lines when even min is too wide.
function fitName(ctx, text, maxWidth, max, min) {
  for (let size = max; size >= min; size -= 2) {
    ctx.font = `400 ${size}px ${SERIF}`
    if (ctx.measureText(text).width <= maxWidth) return { size, lines: [text] }
  }
  ctx.font = `400 ${min}px ${SERIF}`
  const words = text.split(/\s+/)
  for (let i = Math.ceil(words.length / 2); i > 0 && i < words.length; i--) {
    const a = words.slice(0, i).join(' ')
    const b = words.slice(i).join(' ')
    if (ctx.measureText(a).width <= maxWidth && ctx.measureText(b).width <= maxWidth) {
      return { size: min, lines: [a, b] }
    }
  }
  return { size: min, lines: [text] }
}

function fitSans(ctx, text, maxWidth, max, min) {
  let size = max
  for (; size > min; size -= 1) {
    ctx.font = `500 ${size}px ${SANS}`
    if (ctx.measureText(text).width <= maxWidth) break
  }
  ctx.font = `500 ${size}px ${SANS}`
  return size
}

function drawPhoto(ctx, img, pos, theme) {
  const rect = PHOTO
  ctx.save()
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, rect.r)
  ctx.clip()
  if (img) {
    const cover = Math.max(rect.w / img.width, rect.h / img.height)
    const s = cover * pos.zoom
    const dw = img.width * s
    const dh = img.height * s
    const maxX = (dw - rect.w) / 2
    const maxY = (dh - rect.h) / 2
    ctx.drawImage(img, rect.x + (rect.w - dw) / 2 + pos.x * maxX, rect.y + (rect.h - dh) / 2 + pos.y * maxY, dw, dh)
  } else {
    const [bg, shape, text] = theme.placeholder
    ctx.fillStyle = bg
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
    const cx = rect.x + rect.w / 2
    const u = rect.w / 10
    const cy = rect.y + rect.h * 0.42
    ctx.fillStyle = shape
    ctx.beginPath()
    ctx.arc(cx, cy, u * 1.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(cx, cy + u * 5.4, u * 3.2, u * 3.1, 0, Math.PI, 0)
    ctx.fill()
    ctx.textAlign = 'center'
    caps(ctx, 'YOUR PHOTO', cx, cy - u * 2.4, 28, text, 0.3)
  }
  ctx.restore()
}

function drawSeal(ctx, logo, cx, cy, size, theme) {
  if (theme.sealRing) {
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(cx, cy, size / 2 + 6, 0, Math.PI * 2)
    ctx.fill()
  }
  if (logo) ctx.drawImage(logo, cx - size / 2, cy - size / 2, size, size)
}

// Thin brand band along the bottom edge: AUCA blue with a gold end.
function drawBand(ctx) {
  const h = 12
  ctx.fillStyle = BLUE
  ctx.fillRect(0, H - h, W * 0.78, h)
  ctx.fillStyle = GOLD
  ctx.fillRect(W * 0.78, H - h, W * 0.22, h)
}

export function drawFrame(canvas, { img, logo, name, degree, pos, theme: themeKey }) {
  const theme = THEMES[themeKey] || THEMES.light
  if (canvas.width !== W) canvas.width = W
  if (canvas.height !== H) canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, W, H)
  drawPhoto(ctx, img, pos, theme)

  // Text block on the left; AUCA seal on the right behind a hairline.
  const left = PHOTO.x
  const textW = 700
  const bandTop = PHOTO.y + PHOTO.h
  const bandBottom = H - 12
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  const { size, lines } = fitName(ctx, name, textW, 92, 60)
  const lineH = size * 0.98
  const degreeGap = degree ? 46 : 0
  // Heights: eyebrow cap, gap, name, extra lines, degree, gap, date line.
  const blockH = 22 + 20 + size * 0.8 + lineH * (lines.length - 1) + degreeGap + 44 + 18
  let y = bandTop + (bandBottom - bandTop - blockH) / 2 + 22

  caps(ctx, 'CLASS OF 2026', left, y, 28, theme.eyebrow)
  y += 20 + size * 0.8
  ctx.font = `400 ${size}px ${SERIF}`
  ctx.fillStyle = theme.name
  lines.forEach((line, i) => ctx.fillText(line, left, y + i * lineH))
  y += lineH * (lines.length - 1)

  if (degree) {
    fitSans(ctx, degree, textW, 32, 24)
    ctx.fillStyle = theme.meta
    y += degreeGap
    ctx.fillText(degree, left, y)
  }

  caps(ctx, '32ND GRADUATION · 15 NOVEMBER 2026', left, y + 44 + 4, 21, theme.meta, 0.16)

  const divX = 800
  const midY = (bandTop + bandBottom) / 2
  ctx.fillStyle = theme.rule
  ctx.fillRect(divX, midY - 100, 2, 200)
  drawSeal(ctx, logo, (divX + W - left) / 2, midY, 150, theme)

  drawBand(ctx)
}

// Opens the share sheet on phones; downloads the PNG elsewhere.
export async function exportFrame(canvas, name, { share }) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  const slug = (name || 'graduate').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const file = new File([blob], `auca-class-of-2026-${slug || 'graduate'}.png`, { type: 'image/png' })
  if (share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'AUCA Class of 2026' })
      return
    } catch (err) {
      if (err.name === 'AbortError') return
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
