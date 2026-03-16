create table if not exists public.waitlist_signups (
  id bigint generated always as identity primary key,
  email text not null unique,
  player_name text,
  favorite_mmorpg text not null,
  playstyle text not null,
  alpha_testing boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.waitlist_request_log (
  id bigint generated always as identity primary key,
  request_ip_hash text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists waitlist_request_log_lookup_idx
on public.waitlist_request_log (request_ip_hash, created_at desc);

alter table public.waitlist_signups enable row level security;
alter table public.waitlist_request_log enable row level security;

drop policy if exists "Allow public waitlist inserts" on public.waitlist_signups;
drop policy if exists "Allow public waitlist inserts" on public.waitlist_request_log;
