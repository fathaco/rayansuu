-- Add price to events (e.g. "100 ر.س" or "مجاني")
alter table public.events
  add column if not exists price text;

comment on column public.events.price is 'Display price for the event (e.g. 100 ر.س or مجاني)';
