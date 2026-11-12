import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import Confetti, { celebrate } from './Confetti.jsx'
import FrameMaker from './FrameMaker.jsx'
import {
  CELEBRATION_START,
  COMMENCEMENT_END,
  COMMENCEMENT_START,
  DAYS,
  MAP_URL,
  MOTTO,
  THEME,
  currentAndNext,
  downloadCalendar,
  liveItemIndex,
  todayId,
} from './programme.js'

const EASE = [0.22, 1, 0.36, 1]

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function useShare() {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const data = {
      title: 'AUCA 32nd Graduation · Class of 2026',
      text: 'AUCA Class of 2026 graduation, 13–15 November at Masoro Campus. See the programme and make your graduation frame:',
      url: window.location.origin,
    }
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch {
        // share sheet closed
      }
      return
    }
    try {
      await navigator.clipboard.writeText(data.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable
    }
  }
  return { share, copied }
}

const pad = (n) => String(n).padStart(2, '0')
const kigaliDate = (d) => new Date(d.getTime() + 2 * 3600000).toISOString().slice(0, 10)
const fmtDay = (d) => d.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Africa/Kigali' })
const fmtTime = (d) =>
  d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kigali' })

// Counts to the opening service first, then to Commencement.
function countdownTarget(now) {
  if (now < CELEBRATION_START)
    return { at: CELEBRATION_START, label: 'Celebrations begin in', when: 'Friday 13 November · 17:00' }
  if (now < COMMENCEMENT_START)
    return { at: COMMENCEMENT_START, label: 'Commencement begins in', when: 'Sunday 15 November · 07:30' }
  return null
}

function Digit({ value }) {
  // Re-keying restarts a short CSS fade each time the number changes.
  return (
    <span className="value">
      <span key={value} className="digit">
        {value}
      </span>
    </span>
  )
}

function Countdown({ now, target }) {
  const diff = Math.max(0, target.at - now)
  const units = [
    [Math.floor(diff / 86400000), 'Days'],
    [Math.floor((diff / 3600000) % 24), 'Hours'],
    [Math.floor((diff / 60000) % 60), 'Minutes'],
    [Math.floor((diff / 1000) % 60), 'Seconds'],
  ]
  return (
    <div className="countdown">
      <p className="countdown-label">
        {target.label} <span>{target.when}</span>
      </p>
      <div className="units" role="timer">
        {units.map(([v, l]) => (
          <div className="unit" key={l}>
            <Digit value={pad(v)} />
            <span className="label">{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NowNext({ now, onSelect }) {
  const { current, next } = currentAndNext(now)
  if (!current && !next) return null
  const s = current || next
  return (
    <button type="button" className={`now-next ${current ? 'is-live' : ''}`} onClick={() => onSelect(s.dayId)}>
      <span className={current ? 'pulse' : 'dot'} aria-hidden="true" />
      <span className="nn-label">{current ? 'Happening now' : 'Up next'}</span>
      <span className="nn-title">{s.title}</span>
      <span className="nn-meta">{current ? `until ${s.end}` : `${fmtDay(s.startAt)} · ${fmtTime(s.startAt)}`}</span>
    </button>
  )
}

const heroItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

function Hero({ now }) {
  const { share, copied } = useShare()
  const target = countdownTarget(now)
  const live = now >= COMMENCEMENT_START && now < COMMENCEMENT_END

  // Big confetti burst the moment a countdown reaches zero.
  const stage = target ? target.label : 'done'
  const prevStage = useRef(stage)
  useEffect(() => {
    if (prevStage.current !== stage) celebrate(320)
    prevStage.current = stage
  }, [stage])

  return (
    <section className="hero" id="top">
      <motion.div
        className="hero-media"
        aria-hidden="true"
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      />
      <div className="container hero-inner">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        >
          <motion.p className="eyebrow" variants={heroItem}>
            AUCA · 32nd Graduation
          </motion.p>
          <motion.h1 variants={heroItem}>
            Class of <em>2026</em>
          </motion.h1>
          <motion.p className="lede" variants={heroItem}>
            Three days, one celebration. <strong>13 – 15 November 2026</strong> · Masoro Campus, Kigali
          </motion.p>

          <motion.div variants={heroItem}>
            {target ? (
              <Countdown now={now} target={target} />
            ) : (
              <p className="hero-status">{live ? 'Commencement is underway.' : 'Congratulations, graduates.'}</p>
            )}
          </motion.div>

          <motion.div className="hero-actions" variants={heroItem}>
            <a className="btn btn-gold" href="#frame">
              Create your photo frame
            </a>
            <a className="btn btn-ghost" href="#programme">
              View the programme
            </a>
          </motion.div>
          <motion.div className="text-links" variants={heroItem}>
            <button type="button" onClick={downloadCalendar}>
              Add to calendar
            </button>
            <button type="button" onClick={share}>
              {copied ? 'Link copied ✓' : 'Share this page'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function SessionBlock({ day, session, now }) {
  const live = liveItemIndex(day, session, now)
  const timed = session.items && session.items[0].time
  return (
    <article className="session">
      <header className="session-head">
        <h4>{session.title}</h4>
        <p className="session-meta">
          {session.start} – {session.end}
          {session.venue && <> · {session.venue}</>}
        </p>
      </header>

      {session.people && (
        <dl className="people">
          {session.people.map(([role, who]) => (
            <div key={role}>
              <dt>{role}</dt>
              <dd>{who}</dd>
            </div>
          ))}
        </dl>
      )}

      {session.items && (
        <table className="items">
          <thead>
            <tr>
              <th>{timed ? 'Time' : 'No.'}</th>
              <th>Activity</th>
              <th>Responsible</th>
            </tr>
          </thead>
          <tbody>
            {session.items.map((it, i) => (
              <tr key={i} className={`${i === live ? 'live' : ''} ${it.key ? 'key' : ''}`}>
                <td className="t">
                  <span>{it.time || it.no}</span>
                </td>
                <td className="a">
                  {it.key && <span className="key-mark" aria-label="Key moment" />}
                  {it.activity}
                  {i === live && <span className="live-tag">Now</span>}
                </td>
                <td className="r">{it.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  )
}

function Programme({ now }) {
  const [selected, setSelected] = useState(() => todayId(now))
  const day = DAYS.find((d) => d.id === selected)
  const today = kigaliDate(now)

  return (
    <section className="section" id="programme">
      <div className="container">
        <header className="section-head">
          <h2>The programme</h2>
          <p className="section-lead">Three days, one celebration. Friday 13 to Sunday 15 November.</p>
        </header>

        <NowNext now={now} onSelect={setSelected} />

        <div>
          <div className="day-tabs" role="tablist" aria-label="Programme days">
            {DAYS.map((d, i) => (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={selected === d.id}
                className={`day-tab ${selected === d.id ? 'on' : ''} ${d.date < today ? 'past' : ''}`}
                onClick={() => setSelected(d.id)}
              >
                <span className="dt-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="dt-date">
                  {d.short} {d.day} Nov
                  {d.date === today && <i>Today</i>}
                </span>
                <span className="dt-title">{d.tab}</span>
                {selected === d.id && <motion.span className="dt-bar" layoutId="dt-bar" transition={{ duration: 0.4, ease: EASE }} />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={day.id}
              className="day-panel"
              role="tabpanel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {day.sessions.map((s) => (
                <SessionBlock key={s.title} day={day} session={s} now={now} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Venue() {
  return (
    <section className="venue-strip" id="venue">
      <div className="container venue-inner">
        <div>
          <h3>AUCA Masoro Campus</h3>
          <p>Masoro Hill, Ndera, Gasabo · Kigali, Rwanda · Attendance by invitation</p>
        </div>
        <a className="btn btn-ghost" href={MAP_URL} target="_blank" rel="noopener noreferrer">
          Open in Google Maps
        </a>
      </div>
    </section>
  )
}

export default function App() {
  const now = useNow()

  return (
    <MotionConfig reducedMotion="user">
      <Confetti />
      <header className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#top">
            <img src="/auca_logo.png" alt="" />
            <span>
              <b>AUCA</b>
              <small>32nd Graduation</small>
            </span>
          </a>
          <nav>
            <a href="#programme">Programme</a>
            <a href="#frame" className="nav-cta">
              Photo frame
            </a>
          </nav>
        </div>
      </header>

      <main>
        <Hero now={now} />

        <section className="theme-block" aria-label="Theme and motto">
          <div className="container theme-inner">
            <p>
              <span className="tb-label">Theme</span> “{THEME}”
            </p>
            <p>
              <span className="tb-label">Motto</span> {MOTTO}
            </p>
          </div>
        </section>

        <Programme now={now} />

        <section className="section" id="frame">
          <div className="container">
            <header className="section-head">
              <h2>Your graduation frame</h2>
              <p className="section-lead">
                Add your photo and name to get a portrait frame (1080 × 1350) that fits your WhatsApp status,
                Instagram, Facebook and LinkedIn.
              </p>
            </header>
            <FrameMaker />
          </div>
        </section>

        <Venue />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <img src="/auca_logo.png" alt="AUCA logo" />
            <div>
              <p>Adventist University of Central Africa</p>
              <p className="muted">32nd Graduation · 13 – 15 November 2026 · Masoro Campus, Kigali</p>
            </div>
          </div>
          <p className="footer-motto">{MOTTO}</p>
        </div>
      </footer>
    </MotionConfig>
  )
}
