-- Add community link to footer_settings (used by "مجتمع أخوات داعم" feature card)
alter table public.footer_settings
  add column if not exists community_link text;

comment on column public.footer_settings.community_link is 'Link for the community feature card (مجتمع أخوات داعم) on the homepage.';
