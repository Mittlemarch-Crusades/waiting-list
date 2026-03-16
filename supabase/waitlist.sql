create table if not exists public.waitlist_signups (
  id bigint generated always as identity primary key,
  email text not null unique,
  player_name text,
  favorite_mmorpg text not null,
  playstyle text not null,
  alpha_testing boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.waitlist_signups enable row level security;

drop policy if exists "Allow public waitlist inserts" on public.waitlist_signups;
