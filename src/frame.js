// Draws the personalised graduation frame on a canvas. Everything runs in the
// browser: the photo is never uploaded anywhere.
//
// Design: editorial and restrained, like official university graduate frames.
// The photo is the hero; text is limited to one small caps line, the name in
// a serif, an optional degree line, and the AUCA seal.

const SANS = '"Hanken Grotesk", system-ui, sans-serif'
const SERIF = '"Instrument Serif", Georgia, serif'
const BLUE = '#0a57b5'
const GOLD = '#e9b632'

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
    meta: 'rgba(255,255,255,0.68)',
    rule: 'rgba(255,255,255,0.16)',
    placeholder: ['#0b3a72', '#1b4c88', 'rgba(255,255,255,0.6)'],
    sealRing: true,
  },
}

export const FORMATS = {
  square: { label: 'Square post', hint: '1080 × 1080 · Instagram, Facebook, LinkedIn', w: 1080, h: 1080 },
  story: { label: 'Status / story', hint: '1080 × 1920 · WhatsApp, Instagram stories', w: 1080, h: 1920 },
}

// Where the photo sits in each format (canvas pixels).
export function photoRect(format) {
  return format === 'story'
    ? { x: 90, y: 450, w: 900, h: 960, r: 6 }
    : { x: 56, y: 56, w: 968, h: 724, r: 6 }
}

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

function caps(ctx, text, x, y, size, color, spacing = 0.28) {
  ctx.font = `700 ${size}px ${SANS}`
  ctx.fillStyle = color
  ctx.letterSpacing = `${size * spacing}px`
  // Letter spacing adds trailing space; shift centred text to compensate.
  const nudge = ctx.textAlign === 'center' ? (size * spacing) / 2 : 0
  ctx.fillText(text, x + nudge, y)
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

function drawPhoto(ctx, img, rect, pos, theme) {
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
    const u = Math.min(rect.w, rect.h) / 10
    const cy = rect.y + rect.h * 0.46
    ctx.fillStyle = shape
    ctx.beginPath()
    ctx.arc(cx, cy, u * 1.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(cx, cy + u * 5, u * 3.2, u * 2.9, 0, Math.PI, 0)
    ctx.fill()
    ctx.textAlign = 'center'
    caps(ctx, 'YOUR PHOTO', cx, cy - u * 2.3, Math.round(u * 0.32), text, 0.3)
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
function drawBand(ctx, W, H) {
  const h = 12
  ctx.fillStyle = BLUE
  ctx.fillRect(0, H - h, W * 0.78, h)
  ctx.fillStyle = GOLD
  ctx.fillRect(W * 0.78, H - h, W * 0.22, h)
}

function drawSquare(ctx, { img, logo, name, degree, pos, theme }) {
  const W = 1080
  const H = 1080
  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, W, H)
  const rect = photoRect('square')
  drawPhoto(ctx, img, rect, pos, theme)

  // Text block, left; seal lockup, right, separated by a hairline.
  const left = rect.x
  const textW = 720
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  const { size, lines } = fitName(ctx, name || 'Your Name', textW, 84, 58)
  const lineH = size * 0.98
  const nameBlock = lineH * (lines.length - 1)
  const degreeH = degree ? 44 : 0
  // Vertically centre the block in the space under the photo.
  const blockH = 26 + 18 + size * 0.78 + nameBlock + degreeH
  let y = rect.y + rect.h + (H - 12 - rect.y - rect.h - blockH) / 2 + 20

  caps(ctx, 'CLASS OF 2026', left, y, 22, theme.eyebrow)
  y += 18 + size * 0.8
  ctx.font = `400 ${size}px ${SERIF}`
  ctx.fillStyle = name ? theme.name : theme.meta
  lines.forEach((line, i) => ctx.fillText(line, left, y + i * lineH))
  y += nameBlock

  if (degree) {
    fitSans(ctx, degree, textW, 27, 20)
    ctx.fillStyle = theme.meta
    ctx.fillText(degree, left, y + degreeH)
  }

  const divX = 806
  const midY = rect.y + rect.h + (H - 12 - rect.y - rect.h) / 2
  ctx.fillStyle = theme.rule
  ctx.fillRect(divX, midY - 96, 2, 192)

  const sealX = (divX + W - rect.x) / 2
  drawSeal(ctx, logo, sealX, midY - 22, 120, theme)
  ctx.textAlign = 'center'
  caps(ctx, '32ND GRADUATION', sealX, midY + 76, 14, theme.meta, 0.16)

  drawBand(ctx, W, H)
}

function drawStory(ctx, { img, logo, name, degree, pos, theme }) {
  const W = 1080
  const H = 1920
  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, W, H)

  // Header sits below WhatsApp's top overlay (~220px).
  drawSeal(ctx, logo, W / 2, 290, 120, theme)
  ctx.textAlign = 'center'
  caps(ctx, 'ADVENTIST UNIVERSITY OF CENTRAL AFRICA', W / 2, 405, 21, theme.meta, 0.22)

  const rect = photoRect('story')
  drawPhoto(ctx, img, rect, pos, theme)

  let y = rect.y + rect.h + 92
  caps(ctx, 'CLASS OF 2026', W / 2, y, 26, theme.eyebrow)

  const { size, lines } = fitName(ctx, name || 'Your Name', 900, 104, 70)
  const lineH = size * 0.98
  y += 26 + size * 0.82
  ctx.font = `400 ${size}px ${SERIF}`
  ctx.fillStyle = name ? theme.name : theme.meta
  lines.forEach((line, i) => ctx.fillText(line, W / 2, y + i * lineH))
  y += lineH * (lines.length - 1)

  if (degree) {
    fitSans(ctx, degree, 900, 32, 24)
    ctx.fillStyle = theme.meta
    y += 58
    ctx.fillText(degree, W / 2, y)
  }

  ctx.fillStyle = theme.rule
  ctx.fillRect(W / 2 - 160, 1722, 320, 2)
  caps(ctx, '32ND GRADUATION · 15 NOVEMBER 2026', W / 2, 1772, 19, theme.meta, 0.2)

  drawBand(ctx, W, H)
}

export function drawFrame(canvas, opts) {
  const f = FORMATS[opts.format]
  if (canvas.width !== f.w) canvas.width = f.w
  if (canvas.height !== f.h) canvas.height = f.h
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, f.w, f.h)
  const args = { ...opts, theme: THEMES[opts.theme] || THEMES.light }
  if (opts.format === 'story') drawStory(ctx, args)
  else drawSquare(ctx, args)
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
