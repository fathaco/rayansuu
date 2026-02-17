-- Add tutorial_link field to events table
alter table public.events add column if not exists tutorial_link text;

comment on column public.events.tutorial_link is 'Link to tutorial/course materials (shown only when reservation is confirmed)';
