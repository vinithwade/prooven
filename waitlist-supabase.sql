-- Run in Supabase: SQL Editor → New query → paste → Run

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint waitlist_signups_email_unique unique (email)
);

alter table public.waitlist_signups enable row level security;

-- No policies for anon/authenticated: only the service role (used in Vercel) can insert/read.
