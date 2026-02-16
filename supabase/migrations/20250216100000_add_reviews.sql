-- Reviews: admin-posted student reviews (optional text and/or image)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  content text,
  image_url text
);

comment on column public.reviews.content is 'Review text (optional)';
comment on column public.reviews.image_url is 'Review image URL (optional)';

alter table public.reviews enable row level security;

create policy "Allow public read reviews" on public.reviews for select using (true);
create policy "Allow public insert reviews" on public.reviews for insert with check (true);
create policy "Allow public update reviews" on public.reviews for update using (true);
create policy "Allow public delete reviews" on public.reviews for delete using (true);
