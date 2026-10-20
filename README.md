# SpeakEasy Desk

Responsive (desktop + tablet + mobile) frontend slice of https://apps.speakeasy.mobi/.

Pages: **Home** (`/`) and **My Learning** (`/learning`, reached from the Home "Start learning" button).

Stack: Vite + React + TypeScript, plain CSS (tokens in `src/index.css`).

```bash
npm install
npm run dev
```

## Breakpoints
- `< 768px`: the original mobile layout (single column, floating bottom nav, horizontal "Dive into Learning" carousel)
- `768–1199px`: icon-rail sidebar, stacked cards, 3-column learning grid
- `≥ 1200px`: full sidebar, 12-column grid (progress 7 | find level 5, feature cards 6 | 6)

Cards use CSS container queries to switch between compact and wide layouts.

## Routing
A tiny history-based router lives in `src/router.tsx` (no dependency). `/learning` renders on a white sheet and hides the mobile tab bar, mirroring the app's sub-page behaviour.

## Assets
All images, icons and the Parkinsans font in `public/assets` come from the original Flutter build; course illustrations in `public/assets/courses` come from the SpeakEasy backend. Poppins, the runtime UI font, loads from Google Fonts.
