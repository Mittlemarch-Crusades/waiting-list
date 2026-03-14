# Mittlemarch Landing Page

A cinematic teaser landing page for an upcoming MMORPG set in the world of Mittlemarch, built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app/` - App Router pages, layout, global styles, and mock API route
- `components/` - Modular UI sections and interactive systems
- `config/world.ts` - Centralized editable world name, copy, nav, and content
- `public/images` - Replaceable concept art and parallax background layers
- `public/audio` - Replaceable background music

## Replace Assets

Drop your production art and music into the following paths:

- `public/images/mittlemarch-mountains.jpg`
- `public/images/mittlemarch-ruins.png`
- `public/images/mittlemarch-fog.png`
- `public/images/mittlemarch-cavalry.jpg`
- `public/images/mittlemarch-shrine.jpg`
- `public/images/mittlemarch-hall.jpg`
- `public/audio/mittlemarch-theme.mp3`

If these files are missing, the page still renders with atmospheric gradients and fallback styling.

## Update Text And Branding

Edit `config/world.ts` to change:

- world name
- hero copy
- feature cards
- gallery titles
- waitlist messaging
- footer text

Typography is configured in `app/layout.tsx`, where you can swap the heading, serif, and body fonts.

## Waitlist Integration

The waitlist form currently:

- validates on the client
- stores submissions in browser local storage under `mittlemarch-waitlist`
- posts to `app/api/waitlist/route.ts`

To connect a real backend:

1. Replace the fetch target in `components/waitlist-form.tsx`.
2. Remove or repurpose the local storage block if you no longer want local persistence.
3. Swap the mock route for one of these:
   - Supabase insert
   - Firebase Firestore document write
   - Resend / email service call
   - Custom backend API

The form payload already includes:

- `email`
- `playerName`
- `favoriteMmorpg`
- `playstyle`
- `alphaTesting`
- `submittedAt`

## Notes

- The hero background uses layered image fallbacks plus atmospheric gradients.
- Motion respects `prefers-reduced-motion` for accessibility and mobile comfort.
- The audio player starts muted to comply with browser autoplay rules and lets the player enable music explicitly.
