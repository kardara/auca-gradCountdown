# AUCA Graduation Countdown · Class of 2026

A countdown to the Adventist University of Central Africa graduation, 13–15 November 2026 in Kigali.

- Live countdown, ceremony-day and post-ceremony states
- **Add to calendar** (.ics), **Share the countdown** (native share / copy link)
- **Status image**: generates a 1080×1920 "X days to go" image for WhatsApp / Instagram status
- Link preview card (Open Graph) for WhatsApp and social media

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Import the repo on [vercel.com/new](https://vercel.com/new). Vercel detects Vite automatically
(build: `npm run build`, output: `dist`). The link-preview URL uses the Vercel production domain;
for a custom domain, set the `SITE_URL` environment variable (e.g. `https://grad.example.com`).

The ceremony start time is set by `GRAD_START` in `src/App.jsx`.
