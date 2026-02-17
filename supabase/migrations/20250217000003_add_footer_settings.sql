-- Footer settings: single row for admin-editable footer content
create table if not exists public.footer_settings (
  id integer primary key default 1 check (id = 1),
  tagline text,
  social_facebook text,
  social_youtube text,
  social_instagram text,
  social_twitter text,
  quick_links jsonb default '[]',
  sections jsonb default '[]',
  contact jsonb default '[]',
  copyright_text text,
  privacy_url text,
  terms_url text,
  updated_at timestamptz default now()
);

insert into public.footer_settings (id, tagline, social_facebook, social_youtube, social_instagram, social_twitter, quick_links, sections, contact, copyright_text, privacy_url, terms_url)
values (
  1,
  'منصة فتحة الإلكترونية هي الوجهة الأولى لطالبي العلوم الشرعية في العالم العربي',
  '#',
  '#',
  '#',
  '#',
  '[{"label":"عن المنصة","href":"#about"},{"label":"الدورات","href":"#courses"},{"label":"الأسئلة الشائعة","href":"#faq"},{"label":"تواصل معنا","href":"#contact"}]'::jsonb,
  '[{"label":"علوم القرآن","href":"#"},{"label":"الحديث الشريف","href":"#"},{"label":"الفقه وأصوله","href":"#"},{"label":"العقيدة","href":"#"}]'::jsonb,
  '[{"label":"info@fatha.com","href":"mailto:info@fatha.com"},{"label":"966500000000+","href":"tel:+966500000000"},{"label":"الرياض، السعودية","href":"#"}]'::jsonb,
  '© 2025 فتحة. جميع الحقوق محفوظة.',
  '#',
  '#'
)
on conflict (id) do nothing;

alter table public.footer_settings enable row level security;
create policy "Allow public read footer_settings" on public.footer_settings for select using (true);
create policy "Allow public update footer_settings" on public.footer_settings for update using (true);
create policy "Allow public insert footer_settings" on public.footer_settings for insert with check (true);
