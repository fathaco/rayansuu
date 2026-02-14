-- Run this in Supabase SQL Editor to create tables for events and reservations

-- Events table (each event has its own reservations)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text not null,
  description text not null,
  category text not null,
  hours text not null,
  lessons text not null,
  badge text,
  badge_color text,
  image_url text,
  is_new boolean default true
);

-- Reservations: one per event (event_id references events)
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled'))
);

-- Index for listing reservations by event
create index if not exists reservations_event_id_idx on public.reservations(event_id);
create index if not exists reservations_status_idx on public.reservations(status);

-- Optional: enforce one reservation per event per email at DB level (run in SQL Editor if needed):
-- CREATE UNIQUE INDEX reservations_event_email_unique ON public.reservations (event_id, lower(email));

-- Enable RLS (optional: adjust policies for your auth)
alter table public.events enable row level security;
alter table public.reservations enable row level security;

-- Allow public read for events, all operations for now (tighten with auth later)
create policy "Allow public read events" on public.events for select using (true);
create policy "Allow public insert events" on public.events for insert with check (true);
create policy "Allow public update events" on public.events for update using (true);
create policy "Allow public delete events" on public.events for delete using (true);

create policy "Allow public read reservations" on public.reservations for select using (true);
create policy "Allow public insert reservations" on public.reservations for insert with check (true);
create policy "Allow public update reservations" on public.reservations for update using (true);
