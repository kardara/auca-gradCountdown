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

  drawCover(ctx, bg)
  const shade = ctx.createLinearGradient(0, 0, 0, H)
  shade.addColorStop(0, 'rgba(7, 26, 51, 0.80)')
  shade.addColorStop(0.5, 'rgba(7, 26, 51, 0.88)')
  shade.addColorStop(1, 'rgba(7, 26, 51, 0.97)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, W, H)

  // Logo in a white circle
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(W / 2, 270, 92, 0, Math.PI * 2)
  ctx.fill()
  ctx.drawImage(logo, W / 2 - 86, 184, 172, 172)

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '600 30px Inter, sans-serif'
  spaced(ctx, 'ADVENTIST UNIVERSITY OF CENTRAL AFRICA', W / 2, 440, 4)

  ctx.font = '600 34px Inter, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  spaced(ctx, 'GRADUATION CEREMONY', W / 2, 620, 10)

  ctx.font = '800 150px "Playfair Display", serif'
  ctx.fillStyle = '#fff'
  ctx.fillText('Class of', W / 2, 790)
  // Canvas can't enable Playfair's lining figures, so numbers use Inter.
  ctx.fillStyle = GOLD
  ctx.font = '600 128px Inter, sans-serif'
  spaced(ctx, '2026', W / 2 + 8, 945, 16)

  // Days left
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(240, 1060)
  ctx.lineTo(840, 1060)
  ctx.stroke()

  if (daysLeft > 0) {
    ctx.fillStyle = '#fff'
    ctx.font = '300 300px Inter, sans-serif'
    ctx.fillText(String(daysLeft), W / 2, 1360)
    ctx.fillStyle = GOLD
    ctx.font = '600 44px Inter, sans-serif'
    spaced(ctx, daysLeft === 1 ? 'DAY TO GO' : 'DAYS TO GO', W / 2, 1460, 12)
  } else {
    ctx.fillStyle = GOLD
    ctx.font = '600 120px "Playfair Display", serif'
    ctx.fillText('It’s today!', W / 2, 1320)
  }

  ctx.beginPath()
  ctx.moveTo(240, 1540)
  ctx.lineTo(840, 1540)
  ctx.stroke()

  ctx.fillStyle = '#fff'
  ctx.font = '600 46px Inter, sans-serif'
  ctx.fillText('13 – 15 November 2026', W / 2, 1640)
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.font = '400 36px Inter, sans-serif'
  ctx.fillText('Kigali, Rwanda', W / 2, 1700)

  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '400 30px Inter, sans-serif'
  ctx.fillText(window.location.host, W / 2, 1820)

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
