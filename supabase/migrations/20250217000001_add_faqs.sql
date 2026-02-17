-- FAQs table: admin-managed frequently asked questions
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  question text not null,
  answer text not null,
  display_order integer default 0
);

comment on column public.faqs.question is 'FAQ question text';
comment on column public.faqs.answer is 'FAQ answer text';
comment on column public.faqs.display_order is 'Order for displaying FAQs (lower numbers appear first)';

alter table public.faqs enable row level security;

create policy "Allow public read faqs" on public.faqs for select using (true);
create policy "Allow public insert faqs" on public.faqs for insert with check (true);
create policy "Allow public update faqs" on public.faqs for update using (true);
create policy "Allow public delete faqs" on public.faqs for delete using (true);
