// AUCA 32nd Graduation programme for graduands, 13–15 November 2026 (Kigali time, UTC+2).
// The Wed/Thu preliminaries (nursing pinning, master's hooding) are left out on purpose.
// Source: official graduation programme booklet, pages 18–24. Session times
// follow the detailed day pages where they differ from the overview page.

export const MOTTO = 'Education for Eternity'
export const THEME = 'Grounded in Integrity, Shaping the Future with Excellence'
export const VENUE = 'AUCA Masoro Campus'
export const MAP_QUERY = 'Adventist University of Central Africa, Masoro, Kigali, Rwanda'
export const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

// The main event the countdown targets.
export const COMMENCEMENT_START = at('2026-11-15', '07:30')
export const COMMENCEMENT_END = at('2026-11-15', '13:00')
export const CELEBRATION_START = at('2026-11-13', '17:00')
export const GRADUATION_DAY = at('2026-11-15', '00:00')
// Conferment of Degrees: the big moment of Commencement
export const CONFERMENT_START = at('2026-11-15', '10:25')
export const CONFERMENT_END = at('2026-11-15', '11:25')

// AUCA Rwanda on YouTube: /live opens whatever the channel is streaming now
export const CHANNEL_URL = 'https://www.youtube.com/@aucarwanda3405'
export const LIVE_URL = `${CHANNEL_URL}/live`
export const REPLAYS_URL = `${CHANNEL_URL}/streams`
export const WEEK_START = at('2026-11-13', '00:00')
export const WEEK_END = at('2026-11-15', '23:59')

export function at(date, time) {
  return new Date(`${date}T${time}:00+02:00`)
}

const t = (time, activity, responsible, key = false) => ({ time, activity, responsible, key })
const n = (no, activity, responsible) => ({ no, activity, responsible })

export const DAYS = [
  {
    id: 'fri',
    date: '2026-11-13',
    weekday: 'Friday',
    short: 'Fri',
    day: 13,
    label: 'Day 1',
    title: 'Consecration Service',
    tab: 'Consecration',
    sessions: [
      {
        title: 'Consecration Service',
        start: '17:00',
        end: '19:00',
        people: [['Coordinator', 'Office of the Deputy Vice Chancellor for Academics']],
        items: [
          t('17:00', 'Songs of Praise', 'Niyigena Timothee'),
          t('17:30', 'Opening Hymn #590 SDAH', 'Niyigena Timothee'),
          t('17:35', 'Opening Prayer', 'Health Ministries Director - ECD'),
          t('17:40', 'Welcome and Introduction', 'Deputy Vice Chancellor for Academics - AUCA'),
          t('17:50', 'Special Music', 'Jasper Singers'),
          t('17:55', 'Message', 'Executive Secretary - ECD'),
          t('18:40', 'Prayer of Consecration', 'Education Director - ECD'),
          t('18:45', 'Response from Students', 'Graduand from Theology'),
          t('18:55', 'Special Music', 'Jasper Singers'),
          t('19:00', 'Benediction', 'Education Director - RUM'),
        ],
      },
    ],
  },
  {
    id: 'sat',
    date: '2026-11-14',
    weekday: 'Saturday',
    short: 'Sat',
    day: 14,
    label: 'Day 2',
    title: 'Sabbath Worship, Tribute & Thanksgiving',
    tab: 'Sabbath & Thanksgiving',
    sessions: [
      {
        title: 'Sabbath School Service',
        start: '09:00',
        end: '10:10',
        people: [['Coordinator', 'Elder Moses Kirui']],
        items: [
          n('01', 'Songs of Praise', 'Praise Team'),
          n('02', 'Welcome Remarks', 'Director, Sabbath School'),
          n('03', 'Opening Hymn', 'Choristers'),
          n('04', 'Scripture Reading and Opening Prayer', 'Graduands'),
          n('05', 'Special Feature', 'Graduands'),
          n('06', 'Special Item', 'Graduands'),
          n('07', 'Mission Report', 'Graduands'),
          n('08', 'Closing Prayer', 'Graduands'),
          n('09', 'Sabbath School Announcements', 'Director, Sabbath School'),
          n('10', 'Lesson Discussion', 'Graduands'),
        ],
      },
      {
        title: 'Divine Service',
        start: '10:10',
        end: '12:20',
        people: [['Coordinator', 'Pr. Makurumeza Clement']],
        items: [
          t('10:10', 'Announcements', 'Church Elder'),
          t('10:15', 'Prelude', 'Pianist'),
          t('10:20', 'Invocation', 'ECD President'),
          t('10:25', 'Welcome', 'Vice Chancellor - AUCA & Council Chair & RUM President'),
          t('10:35', 'Solemn Call to Worship', 'Education Director - ECD'),
          t('10:38', 'Opening Hymn #590 SDAH', 'Choristers & Graduands'),
          t('10:45', 'Scripture Reading and Prayer', 'Executive Secretary - ECD'),
          t('10:50', 'Tithes & Offerings', 'Treasurer - ECD'),
          t('11:00', 'Special Music', 'University Chorale'),
          t('11:05', 'Sermon', 'ECD President'),
          t('12:05', 'Closing Hymn #523 SDAH', 'Choristers & Graduands'),
          t('12:10', 'Benediction', 'Chancellor - ECD President Emeritus'),
          t('12:15', 'Marching Out', 'Pianist'),
        ],
      },
      {
        title: 'Tribute and Thanksgiving',
        start: '14:00',
        end: '17:00',
        people: [['Coordinator', 'Chairperson of the Graduation Committee & Vice Chairperson']],
        items: [
          t('14:00', 'Songs of Praise', 'Graduating Class'),
          t('14:17', 'Opening Prayer and Remarks', 'Graduating Class'),
          t('14:27', 'Special Music', 'Jasper Singers'),
          t('14:35', 'Parents, Spouses, Sponsors', 'Graduating Class'),
          t('15:17', 'Special Music', 'Way of Hope Choir'),
          t('15:25', 'Administrators, Faculty & Staff', 'Graduating Class'),
          t('16:07', 'Special Music', 'Jasper Singers'),
          t('16:15', 'Message', 'Dean - ASOME'),
          t('16:37', 'Special Music', 'Jasper Singers'),
          t('16:45', 'Closing Prayer', 'Director of Students’ Affairs'),
          t('16:50', 'Closing Remarks', 'President, Graduation Committee'),
        ],
      },
    ],
  },
  {
    id: 'sun',
    date: '2026-11-15',
    weekday: 'Sunday',
    short: 'Sun',
    day: 15,
    label: 'Day 3',
    title: 'Commencement',
    tab: 'Commencement',
    sessions: [
      {
        title: 'Commencement (Graduation)',
        start: '07:30',
        end: '13:00',
        venue: 'Masoro Campus',
        highlight: true,
        items: [
          t('07:30', 'Arrival of Graduands and Parents', 'MC'),
          t('08:30', 'Arrival of Distinguished Guests', 'Protocol'),
          t('09:00', 'Arrival of the Guest of Honor', 'Protocol'),
          t('09:15', 'Procession', 'Registrar', true),
          t('09:45', 'National Anthem', 'Choristers'),
          t('09:50', 'AUCA Anthem', 'Choristers'),
          t('09:55', 'Opening Prayer', 'Education Director - ECD'),
          t('10:00', 'Opening of the Ceremony', 'Chancellor - ECD President Emeritus'),
          t('10:05', 'Welcome Remarks', 'Vice Chancellor'),
          t('10:15', 'AUCA Council Chair’s Message', 'AUCA Council Chair & RUM President'),
          t('10:25', 'Conferment of Degrees', 'Deputy Vice Chancellor for Academics', true),
          t('11:25', 'Graduands’ Song (SDAH #590)', 'Graduands'),
          t('11:35', 'Best Performers Awards', 'Deputy Vice Chancellor for Academics', true),
          t('11:55', 'Response and Gift from the Graduands', 'Graduands’ Representatives'),
          t('12:05', 'Induction into the Alumni Association', 'Director of Students’ Affairs'),
          t('12:15', 'Chancellor’s Speech', 'Chancellor - ECD President Emeritus'),
          t('12:25', 'ECD President’s Message', 'ECD President'),
          t('12:35', 'Address by the Guest of Honor', 'Minister of Education', true),
          t('12:50', 'Closing of the Ceremony', 'Chancellor - ECD President Emeritus'),
          t('12:53', 'Prayer of Dedication', 'ECD Executive Secretary'),
          t('12:55', 'Recession', 'Protocol'),
          t('13:00', 'Reception of the Guests', 'Protocol'),
        ],
      },
    ],
  },
]

// Every session with absolute start/end times, in order.
export const SESSIONS = DAYS.flatMap((d) =>
  d.sessions.map((s) => ({
    ...s,
    dayId: d.id,
    weekday: d.weekday,
    startAt: at(d.date, s.start),
    endAt: at(d.date, s.end),
  }))
)

// What's on now, or the next session if nothing is.
export function currentAndNext(now) {
  const current = SESSIONS.find((s) => now >= s.startAt && now < s.endAt) || null
  const next = SESSIONS.find((s) => s.startAt > now) || null
  return { current, next }
}

// The id of the programme item that is running now within a session, if any.
export function liveItemIndex(day, session, now) {
  if (!session.items || !session.items[0].time) return -1
  const startAt = at(day.date, session.start)
  const endAt = at(day.date, session.end)
  if (now < startAt || now >= endAt) return -1
  let idx = -1
  session.items.forEach((it, i) => {
    if (at(day.date, it.time) <= now) idx = i
  })
  return idx
}

export function todayId(now) {
  const kigali = new Date(now.getTime() + 2 * 3600000).toISOString().slice(0, 10)
  const day = DAYS.find((d) => d.date === kigali)
  if (day) return day.id
  return now < WEEK_START ? DAYS[0].id : DAYS[DAYS.length - 1].id
}

export function downloadCalendar() {
  const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const esc = (s) => s.replace(/[,;\\]/g, (c) => `\\${c}`)
  const events = SESSIONS.flatMap((s, i) => [
    'BEGIN:VEVENT',
    `UID:auca-grad-2026-${i}@auca`,
    `DTSTAMP:${stamp(new Date('2026-11-01T00:00:00Z'))}`,
    `DTSTART:${stamp(s.startAt)}`,
    `DTEND:${stamp(s.endAt)}`,
    `SUMMARY:${esc(`AUCA Graduation · ${s.title}`)}`,
    `LOCATION:${esc(`${s.venue || VENUE}, Kigali, Rwanda`)}`,
    'END:VEVENT',
  ])
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AUCA//32nd Graduation//EN',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'auca-graduation-2026.ics'
  a.click()
  URL.revokeObjectURL(url)
}
