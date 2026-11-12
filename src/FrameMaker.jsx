import { useEffect, useRef, useState } from 'react'
import { celebrate } from './Confetti.jsx'
import { FORMATS, THEMES, drawFrame, exportFrame, loadFrameFonts, loadImage, photoRect } from './frame.js'

const START_POS = { zoom: 1, x: 0, y: 0 }
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export default function FrameMaker() {
  const canvasRef = useRef(null)
  const fileRef = useRef(null)
  const drag = useRef(null)
  const [logo, setLogo] = useState(null)
  const [img, setImg] = useState(null)
  const [sample, setSample] = useState(null)
  const [name, setName] = useState('')
  const [degree, setDegree] = useState('')
  const [format, setFormat] = useState('square')
  const [theme, setTheme] = useState('light')
  const [pos, setPos] = useState(START_POS)
  const [fontsReady, setFontsReady] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadImage('/auca_logo.png').then(setLogo, () => {})
    loadImage('/graduation-bg.jpg').then(setSample, () => {})
    loadFrameFonts().then(() => setFontsReady(true))
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return
    const id = requestAnimationFrame(() =>
      drawFrame(canvasRef.current, {
        format,
        theme,
        logo,
        // Until a photo is added, show a sample so people see what they'll get.
        img: img || sample,
        pos: img ? pos : START_POS,
        name: name.trim() || 'Your Name',
        degree: degree.trim() || (img ? '' : 'Your degree or programme'),
      })
    )
    return () => cancelAnimationFrame(id)
  }, [format, theme, img, sample, logo, name, degree, pos, fontsReady])

  const openFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG or PNG).')
      return
    }
    setError('')
    const url = URL.createObjectURL(file)
    try {
      const next = await loadImage(url)
      setImg(next)
      setPos(START_POS)
    } catch {
      setError('That image could not be opened. Try a JPG or PNG.')
    }
  }

  // Drag on the preview to reposition the photo.
  const onPointerDown = (e) => {
    if (!img) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerMove = (e) => {
    if (!drag.current || !img) return
    const canvas = canvasRef.current
    const ratio = canvas.width / canvas.clientWidth
    const dx = (e.clientX - drag.current.x) * ratio
    const dy = (e.clientY - drag.current.y) * ratio
    drag.current = { x: e.clientX, y: e.clientY }
    const rect = photoRect(format)
    setPos((p) => {
      const s = Math.max(rect.w / img.width, rect.h / img.height) * p.zoom
      const maxX = (img.width * s - rect.w) / 2
      const maxY = (img.height * s - rect.h) / 2
      return {
        ...p,
        x: maxX > 0 ? clamp(p.x + dx / maxX, -1, 1) : 0,
        y: maxY > 0 ? clamp(p.y + dy / maxY, -1, 1) : 0,
      }
    })
  }
  const endDrag = () => {
    drag.current = null
  }

  const save = async (share) => {
    setBusy(true)
    try {
      await exportFrame(canvasRef.current, name.trim(), { share })
      celebrate(140)
    } finally {
      setBusy(false)
    }
  }

  const canShareFiles = typeof navigator !== 'undefined' && !!navigator.canShare

  return (
    <div className="frame-maker">
      <div className="fm-controls">
        <div
          className={`dropzone ${dragOver ? 'over' : ''} ${img ? 'has-img' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            openFile(e.dataTransfer.files[0])
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-2-2l1.5-1.5a2 2 0 012.8 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="dz-title">{img ? 'Photo added' : 'Add your photo'}</p>
            <p className="dz-hint">{img ? 'Drag the preview to reposition' : 'JPG or PNG · drag & drop or browse'}</p>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current.click()}>
            {img ? 'Change' : 'Browse'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              openFile(e.target.files[0])
              e.target.value = ''
            }}
          />
        </div>
        {error && <p className="fm-error">{error}</p>}

        <label className="field">
          <span>Full name</span>
          <input
            type="text"
            value={name}
            maxLength={40}
            placeholder="e.g. Aline Uwase"
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="field">
          <span>
            Degree or programme <em>optional</em>
          </span>
          <input
            type="text"
            value={degree}
            maxLength={60}
            placeholder="e.g. BSc in Information Technology"
            onChange={(e) => setDegree(e.target.value)}
          />
        </label>

        <fieldset className="field">
          <span>Format</span>
          <div className="segmented" role="radiogroup">
            {Object.entries(FORMATS).map(([key, f]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={format === key}
                className={format === key ? 'on' : ''}
                onClick={() => setFormat(key)}
              >
                <strong>{f.label}</strong>
                <small>{f.hint}</small>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <span>Style</span>
          <div className="segmented swatches" role="radiogroup">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={theme === key}
                className={theme === key ? 'on' : ''}
                onClick={() => setTheme(key)}
              >
                <i style={{ background: t.bg }} aria-hidden="true" />
                <strong>{t.label}</strong>
              </button>
            ))}
          </div>
        </fieldset>

        <label className={`field ${img ? '' : 'disabled'}`}>
          <span>Zoom</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={pos.zoom}
            disabled={!img}
            onChange={(e) => setPos((p) => ({ ...p, zoom: Number(e.target.value) }))}
          />
        </label>

        <div className="fm-actions">
          <button type="button" className="btn btn-primary" onClick={() => save(false)} disabled={busy || !img}>
            {busy ? 'Preparing…' : img ? 'Download image' : 'Add a photo to download'}
          </button>
          {canShareFiles && (
            <button type="button" className="btn btn-outline" onClick={() => save(true)} disabled={busy || !img}>
              Share
            </button>
          )}
        </div>
        <p className="fm-privacy">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
          </svg>
          Your photo stays on your device. Nothing is uploaded.
        </p>
      </div>

      <div className={`fm-preview ${format}`}>
        {!img && <span className="sample-tag">Sample preview</span>}
        <canvas
          ref={canvasRef}
          className={img ? 'draggable' : ''}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          aria-label="Preview of your graduation frame"
        />
      </div>
    </div>
  )
}
