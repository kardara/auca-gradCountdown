// Draws a 1080x1920 (9:16) image sized for WhatsApp / Instagram status.
const W = 1080
const H = 1920
const GOLD = '#d6b25e'

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawCover(ctx, img) {
  const scale = Math.max(W / img.width, H / img.height)
  const w = img.width * scale
  const h = img.height * scale
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h)
}

function spaced(ctx, text, x, y, spacing) {
  ctx.letterSpacing = `${spacing}px`
  ctx.fillText(text, x, y)
  ctx.letterSpacing = '0px'
}

export async function createStatusImage(daysLeft) {
  await document.fonts.ready
  const [bg, logo] = await Promise.all([loadImage('/graduation-bg.jpg'), loadImage('/auca_logo.png')])

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.textAlign = 'center'

  // Photo stays visible at the top and fades into navy behind the text.
  // Key content sits between y≈220 and y≈1720, clear of WhatsApp's status overlays.
  drawCover(ctx, bg)
  const shade = ctx.createLinearGradient(0, 0, 0, H)
  shade.addColorStop(0, 'rgba(7, 26, 51, 0.55)')
  shade.addColorStop(0.3, 'rgba(7, 26, 51, 0.6)')
  shade.addColorStop(0.55, 'rgba(7, 26, 51, 0.88)')
  shade.addColorStop(1, 'rgba(7, 26, 51, 0.97)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, W, H)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
  ctx.shadowBlur = 24

  // Logo in a white circle
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(W / 2, 330, 105, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.drawImage(logo, W / 2 - 98, 232, 196, 196)
  ctx.shadowBlur = 24

  ctx.fillStyle = '#fff'
  ctx.font = '600 32px Inter, sans-serif'
  spaced(ctx, 'ADVENTIST UNIVERSITY OF CENTRAL AFRICA', W / 2, 510, 4)

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '600 40px Inter, sans-serif'
  spaced(ctx, 'GRADUATION CEREMONY', W / 2, 720, 12)

  ctx.fillStyle = '#fff'
  ctx.font = '800 210px "Playfair Display", serif'
  ctx.fillText('Class of', W / 2, 935)
  // Canvas can't enable Playfair's lining figures, so numbers use Inter.
  ctx.fillStyle = GOLD
  ctx.font = '600 200px Inter, sans-serif'
  spaced(ctx, '2026', W / 2 + 10, 1140, 20)

  ctx.shadowBlur = 0
  ctx.fillStyle = GOLD
  ctx.fillRect(W / 2 - 60, 1220, 120, 4)

  if (daysLeft > 0) {
    ctx.fillStyle = '#fff'
    ctx.font = '300 340px Inter, sans-serif'
    ctx.fillText(String(daysLeft), W / 2, 1530)
    ctx.fillStyle = GOLD
    ctx.font = '600 50px Inter, sans-serif'
    spaced(ctx, daysLeft === 1 ? 'DAY TO GO' : 'DAYS TO GO', W / 2 + 7, 1620, 14)
  } else {
    ctx.fillStyle = GOLD
    ctx.font = '800 150px "Playfair Display", serif'
    ctx.fillText('It’s today!', W / 2, 1480)
  }

  ctx.fillStyle = '#fff'
  ctx.font = '600 52px Inter, sans-serif'
  ctx.fillText('13 – 15 November 2026', W / 2, 1730)
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.font = '400 40px Inter, sans-serif'
  ctx.fillText('Kigali, Rwanda', W / 2, 1792)

  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = '400 30px Inter, sans-serif'
  ctx.fillText(window.location.host, W / 2, 1870)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

// Opens the share sheet with the image on phones; downloads it elsewhere.
export async function shareStatusImage(daysLeft) {
  const blob = await createStatusImage(daysLeft)
  const file = new File([blob], 'auca-class-of-2026-status.png', { type: 'image/png' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
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
  URL.revokeObjectURL(url)
}
