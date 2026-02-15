-- Add payment proof and confirmation to reservations (run in Supabase SQL Editor if not using migrations)
alter table public.reservations
  add column if not exists payment_proof_url text,
  add column if not exists payment_confirmed boolean not null default false;

comment on column public.reservations.payment_proof_url is 'URL of uploaded payment proof (receipt/transfer screenshot)';
comment on column public.reservations.payment_confirmed is 'Admin has confirmed payment received';
