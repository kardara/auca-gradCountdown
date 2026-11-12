# AUCA 32nd Graduation · Class of 2026

Website for the Adventist University of Central Africa graduation, 13–15 November 2026 at Masoro Campus, Kigali.

- **Celebration feel**: one navy-and-gold design, confetti on load and on frame download, and scroll reveals (via `motion`; all motion is skipped when the visitor's device asks for reduced motion)
- **Countdown** to the opening service, then to Commencement (Sunday 15 November, 07:30), with a "happening now / up next" indicator
- **Programme** for the three graduand days (Fri–Sun) from the official booklet; today's day opens by default and the running item is highlighted
- **Photo frame maker**: graduates add a photo, name and (optionally) degree, then download or share a
  branded 4:5 portrait image (1080×1350) for WhatsApp status, Instagram, Facebook or LinkedIn, in white or navy.
  Runs fully in the browser: photos are never uploaded.
- **Add to calendar** (.ics with every session) and **Share** (native share / copy link)
- Link preview card (Open Graph) for WhatsApp and social media

## Run locally

```bash
npm install
npm run dev
```

## Editing

- Programme content and times: `src/programme.js`
- Frame design (canvas drawing): `src/frame.js`

## Deploy

Import the repo on [vercel.com/new](https://vercel.com/new). Vercel detects Vite automatically
(build: `npm run build`, output: `dist`). The link-preview URL uses the Vercel production domain;
for a custom domain, set the `SITE_URL` environment variable (e.g. `https://grad.example.com`).
