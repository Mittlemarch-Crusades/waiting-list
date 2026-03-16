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

The repository is ready to deploy to Vercel as a standard Next.js App Router project.

### 1. Prepare Supabase

1. Open your Supabase project.
2. In the SQL Editor, run `supabase/waitlist.sql`.
3. In the Supabase dashboard, go to Project Settings -> API.
4. Copy:
   - `Project URL`
   - `secret key`

### 2. Connect The Repository To Vercel

1. Open Vercel and create a new project.
2. Import the GitHub repository: `Mittlemarch-Crusades/waiting-list`.
3. Keep the framework preset as `Next.js`.
4. Do not put Supabase secrets in GitHub repository secrets for this deployment flow.

For a normal Vercel deployment, environment variables belong in Vercel project settings, not GitHub secrets. GitHub secrets are only needed if you are deploying through GitHub Actions.

### 3. Add Vercel Environment Variables

In Vercel -> Project Settings -> Environment Variables, add:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Optional:

- `NEXT_PUBLIC_APP_URL`
  Set this to your production site URL after Vercel gives you one.

Use these values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_sb_secret_key_here
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### 4. Deploy

1. Trigger the first Vercel deployment.
2. Wait for the production build to succeed.
3. Open the deployed site.
4. Submit a test waitlist entry with a real email you control.
5. Check `public.waitlist_signups` in Supabase to confirm the row was created.

### 5. After The First Successful Deploy

1. If you plan to use a custom domain, add it in Vercel and update `NEXT_PUBLIC_APP_URL`.
2. Rotate the secret key immediately if it was ever pasted anywhere public by mistake.
3. Keep `.env.local` local-only and never commit it.

### Deployment Checklist

- The repo contains no committed secret key.
- `.env.local` stays out of git.
- `SUPABASE_SECRET_KEY` is configured only in local env files and Vercel env settings.
- The waitlist table exists in Supabase.
- The site builds locally with `npm run build`.
- The site builds in Vercel.

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
