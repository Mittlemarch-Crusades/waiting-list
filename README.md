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
- validates again on the server
- posts to `app/api/waitlist/route.ts`
- inserts records into Supabase via the REST endpoint
- handles duplicate emails gracefully

To finish the Supabase setup:

1. Add your server env vars to `.env.local`.
2. Run the SQL in `supabase/waitlist.sql` inside the Supabase SQL editor.
3. Set `SUPABASE_URL`.
4. Set `SUPABASE_SECRET_KEY`.

The route now requires a server-only key. It will use `SUPABASE_SECRET_KEY` first and still accepts legacy `SUPABASE_SERVICE_ROLE_KEY`, but it no longer falls back to the publishable key.

Recommended `.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_sb_secret_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Security checklist:

1. Keep `SUPABASE_SECRET_KEY` only in `.env.local` locally and only in server environment variables in deployment.
2. Never prefix the secret with `NEXT_PUBLIC_`.
3. Never import `process.env.SUPABASE_SECRET_KEY` from a client component marked with `"use client"`.
4. Only access the secret from server files such as `app/api/**`, server actions, or other server-only modules.
5. If you accidentally expose the key, rotate it immediately in the Supabase dashboard and update the environment variable in your local machine and hosting provider.

Emergency response if the key is exposed:

1. Rotate the secret key in Supabase immediately.
2. Replace the old key in `.env.local` and in your deployment provider's environment settings.
3. Restart your local dev server and redeploy the app.
4. Check recent insert traffic in Supabase for abuse or unexpected volume.
5. Search the repo history for the old key and remove it from git history if it was ever committed.

The form payload already includes:

- `email`
- `playerName`
- `favoriteMmorpg`
- `playstyle`
- `alphaTesting`

## Notes

- The hero background uses layered image fallbacks plus atmospheric gradients.
- Motion respects `prefers-reduced-motion` for accessibility and mobile comfort.
- The audio player starts muted to comply with browser autoplay rules and lets the player enable music explicitly.
