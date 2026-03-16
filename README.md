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

## Deployment

Netlify supports modern Next.js App Router projects with zero configuration through its OpenNext adapter, including route handlers like `app/api/waitlist/route.ts`.

### Local Development

You can keep using:

```bash
npm run dev
```

Next.js will load `.env.local` automatically in local development, so this project will continue to work locally without Netlify CLI as long as your `.env.local` contains:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_sb_secret_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 1. Prepare Supabase

1. Open your Supabase project.
2. In SQL Editor, run `supabase/waitlist.sql`.
3. In Supabase Project Settings -> API, copy:
   - `Project URL`
   - `secret key`

### 2. Connect The Repository To Netlify

1. Open Netlify.
2. Choose `Add new site` -> `Import an existing project`.
3. Connect GitHub and select `Mittlemarch-Crusades/waiting-list`.
4. Netlify should detect the project as `Next.js` automatically.
5. Leave the build command as `npm run build` if Netlify asks.

Netlify's current Next.js docs say App Router and route handlers are supported out of the box through the OpenNext adapter.

### 3. Add Netlify Environment Variables

In Netlify -> Site configuration -> Environment variables, add:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Optional:

- `NEXT_PUBLIC_APP_URL`
  Set this to your Netlify production URL or custom domain.

Example production values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_sb_secret_key_here
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
```

Do not put these in GitHub repository secrets for normal Netlify Git-based deploys. Set them in Netlify directly.

### 4. Deploy

1. Trigger the first Netlify deployment.
2. Wait for the production build to complete.
3. Open the deployed site.
4. Submit a real test waitlist entry.
5. In Supabase Table Editor, confirm the row appears in `public.waitlist_signups`.

### 5. After The First Successful Deploy

1. If you add a custom domain in Netlify, update `NEXT_PUBLIC_APP_URL`.
2. Keep `.env.local` local-only and never commit it.
3. Keep `SUPABASE_SECRET_KEY` only in local env files and Netlify environment variables.
4. Rotate the secret key immediately if it is ever exposed.

### Deployment Checklist

- The repo contains no committed secret key.
- `.env.local` stays out of git.
- `SUPABASE_SECRET_KEY` is configured only in local env files and Netlify env settings.
- The waitlist table exists in Supabase.
- The site builds locally with `npm run build`.
- The site deploys successfully on Netlify.

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
