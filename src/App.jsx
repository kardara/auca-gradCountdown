import { useEffect, useState } from 'react'
import { shareStatusImage } from './statusImage.js'

// Kigali time (CAT, UTC+2). Change these if the official times are announced.
const GRAD_START = new Date('2026-11-13T08:00:00+02:00')
const GRAD_END = new Date('2026-11-15T23:59:59+02:00')
// The progress line tracks the last 30 days before graduation.
const STRETCH_START = new Date(GRAD_START.getTime() - 30 * 24 * 60 * 60 * 1000)

const DAYS = [
  { date: '13', weekday: 'Friday', title: 'Day One' },
  { date: '14', weekday: 'Saturday', title: 'Day Two' },
  { date: '15', weekday: 'Sunday', title: 'Day Three' },
]

function getTimeLeft(now) {
  const diff = Math.max(0, GRAD_START - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function getPhase(now) {
  if (now < GRAD_START) return 'before'
  if (now <= GRAD_END) return 'live'
  return 'after'
}

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function CapIcon() {
  return (
    <svg className="cap-icon" viewBox="0 0 64 48" aria-hidden="true">
      <path d="M32 4 L60 16 L32 28 L4 16 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 22 v10 c0 5 7 9 16 9 s16 -4 16 -9 v-10" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M52 19.5 v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="52" cy="36" r="2.5" fill="currentColor" />
    </svg>
  )
}

function downloadCalendarFile() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AUCA//Graduation Countdown//EN',
    'BEGIN:VEVENT',
    'UID:auca-graduation-2026@auca',
    'DTSTAMP:20261101T000000Z',
    'DTSTART;VALUE=DATE:20261113',
    'DTEND;VALUE=DATE:20261116',
    'SUMMARY:AUCA Graduation – Class of 2026',
    'LOCATION:Adventist University of Central Africa\\, Kigali\\, Rwanda',
    'DESCRIPTION:Celebrating the AUCA Class of 2026.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'auca-graduation-2026.ics'
  a.click()
  URL.revokeObjectURL(url)
}

function useShare() {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const data = {
      title: 'AUCA Graduation – Class of 2026',
      text: 'Counting down to the AUCA Class of 2026 graduation, 13–15 November in Kigali!',
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch {
        // user closed the share sheet
      }
      return
    }
    try {
      await navigator.clipboard.writeText(data.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable (e.g. insecure context)
    }
  }
  return { share, copied }
}

function TimeUnit({ value, label }) {
  return (
    <div className="unit">
      <span className="value">{String(value).padStart(2, '0')}</span>
      <span className="label">{label}</span>
    </div>
  )
}

export default function App() {
  const now = useNow()
  const { share, copied } = useShare()
  const [making, setMaking] = useState(false)
  const phase = getPhase(now)
  const t = getTimeLeft(now)
  const progress = Math.min(
    100,
    Math.max(0, ((now - STRETCH_START) / (GRAD_START - STRETCH_START)) * 100)
  )
  const liveDay = phase === 'live' ? Math.min(3, Math.floor((now - GRAD_START) / 86400000) + 1) : 0
  const daysToGo = Math.max(0, Math.ceil((GRAD_START - now) / 86400000))

  const makeStatusImage = async () => {
    setMaking(true)
    try {
      await shareStatusImage(daysToGo)
    } finally {
      setMaking(false)
    }
  }

  return (
    <div className="page">
      <div className="backdrop" aria-hidden="true" />
      <header className="topbar">
        <div className="brand">
          <img src="/auca_logo.png" alt="AUCA logo" />
          <span>Adventist University of Central Africa</span>
        </div>
        <span className="topbar-date">13 – 15 Nov 2026</span>
      </header>

      <main className="hero">
        <CapIcon />

        <p className="eyebrow">
          {phase === 'before' && 'Graduation Ceremony'}
          {phase === 'live' && `Graduation · Day ${liveDay}`}
          {phase === 'after' && 'Congratulations, Graduates'}
        </p>
        <h1 className="title">
          Class of <span className="year">2026</span>
        </h1>
        <p className="subtitle">
          {phase === 'before' &&
            'Years of hard work, one proud moment. Join us in Kigali as we celebrate every graduate.'}
          {phase === 'live' && 'The celebration is underway. Congratulations to every graduate.'}
          {phase === 'after' && 'Thank you for celebrating with the AUCA community.'}
        </p>

        {phase === 'before' && (
          <>
            <section className="countdown" aria-live="polite">
              <TimeUnit value={t.days} label="Days" />
              <TimeUnit value={t.hours} label="Hours" />
              <TimeUnit value={t.minutes} label="Minutes" />
              <TimeUnit value={t.seconds} label="Seconds" />
            </section>

            <div className="progress" aria-label={`${progress.toFixed(0)}% of the final 30 days complete`}>
              <div className="fill" style={{ width: `${progress}%` }} />
            </div>
          </>
        )}

        <div className="actions">
          {phase === 'before' && (
            <button type="button" className="btn btn-primary" onClick={downloadCalendarFile}>
              Add to calendar
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={share}>
            {copied ? 'Link copied ✓' : 'Share the countdown'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={makeStatusImage} disabled={making}>
            {making ? 'Preparing…' : 'Post to status'}
          </button>
        </div>

        <section className="schedule">
          {DAYS.map((d, i) => (
            <div key={d.date} className={`day ${liveDay === i + 1 ? 'active' : ''}`}>
              <span className="day-num">{d.date}</span>
              <div>
                <p className="day-title">{d.title}</p>
                <p className="day-meta">{d.weekday}, November</p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="footer">Kigali, Rwanda · AUCA Graduation 2026</footer>
    </div>
  )
}
