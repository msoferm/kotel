-- =============================================
-- Kotel — Supabase schema
-- =============================================
-- Run this in the Supabase Dashboard → SQL Editor.
-- Tables, indexes, and Row Level Security policies.
-- =============================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =============================================
-- 1) NOTES (פתקים לכותל)
-- =============================================
create table if not exists public.notes (
  id            uuid primary key default gen_random_uuid(),
  content       text not null check (char_length(content) between 1 and 1000),
  first_name    text,
  mother_name   text,
  intention     text,
  email         text,
  status        text not null default 'pending'
                  check (status in ('pending','printed','placed','archived')),
  created_at    timestamptz not null default now(),
  placed_at     timestamptz,
  -- Limited PII: no IP stored
  user_agent    text
);
create index if not exists notes_status_idx   on public.notes (status);
create index if not exists notes_created_idx  on public.notes (created_at desc);

-- =============================================
-- 2) NEWSLETTER SUBSCRIBERS
-- =============================================
create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  source        text,
  locale        text default 'he'
);
create index if not exists newsletter_email_idx on public.newsletter_subscribers (email);

-- =============================================
-- 3) EVENT INQUIRIES (בר/בת מצווה, חלאקה, וכו')
-- =============================================
create table if not exists public.event_inquiries (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  phone         text not null,
  email         text not null,
  event_type    text not null
                  check (event_type in ('bar_mitzvah','bat_mitzvah','halaka','other')),
  preferred_date date,
  notes         text,
  status        text not null default 'new'
                  check (status in ('new','contacted','scheduled','closed')),
  created_at    timestamptz not null default now()
);
create index if not exists events_status_idx on public.event_inquiries (status);

-- =============================================
-- 4) DONATION INTENTS (תרומות)
-- =============================================
-- Note: This stores INTENT only. Actual payment processing must go through
-- a PCI-compliant processor (Stripe, Tranzila, PayPal, etc.) — never store
-- card data here.
create table if not exists public.donation_intents (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  email         text not null,
  phone         text,
  amount_ils    integer not null check (amount_ils >= 10),
  frequency     text not null default 'once'
                  check (frequency in ('once','monthly')),
  in_memory_of  text,
  payment_status text not null default 'intent'
                  check (payment_status in ('intent','redirected','completed','failed','refunded')),
  created_at    timestamptz not null default now()
);
create index if not exists donations_status_idx on public.donation_intents (payment_status);

-- =============================================
-- 5) CONTACT MESSAGES
-- =============================================
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  full_name   text,
  email       text,
  phone       text,
  subject     text,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
-- Pattern: anyone (anon) can INSERT public-facing submissions.
-- Only authenticated/service-role can SELECT / UPDATE / DELETE.

alter table public.notes                  enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.event_inquiries        enable row level security;
alter table public.donation_intents       enable row level security;
alter table public.contact_messages       enable row level security;

-- Drop existing policies if re-running (idempotent)
drop policy if exists "anon insert notes"        on public.notes;
drop policy if exists "anon insert newsletter"   on public.newsletter_subscribers;
drop policy if exists "anon insert events"       on public.event_inquiries;
drop policy if exists "anon insert donations"    on public.donation_intents;
drop policy if exists "anon insert contact"      on public.contact_messages;

create policy "anon insert notes"
  on public.notes
  for insert
  to anon
  with check (true);

create policy "anon insert newsletter"
  on public.newsletter_subscribers
  for insert
  to anon
  with check (true);

create policy "anon insert events"
  on public.event_inquiries
  for insert
  to anon
  with check (true);

create policy "anon insert donations"
  on public.donation_intents
  for insert
  to anon
  with check (true);

create policy "anon insert contact"
  on public.contact_messages
  for insert
  to anon
  with check (true);

-- NOTE: No SELECT policies for anon — public users cannot read submissions.
-- Use the service_role key (server-side only) to read for admin views.
