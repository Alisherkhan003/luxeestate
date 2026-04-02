-- =====================================================
-- LuxeEstate — Supabase Database Setup
-- Run this ONCE in: supabase.com → SQL Editor → New Query
-- =====================================================

-- 1. Properties table
create table if not exists properties (
  id          bigserial primary key,
  title       text        not null,
  type        text        not null check (type in ('villa','house','apartment','plot','commercial')),
  status      text        not null default 'available' check (status in ('available','sold')),
  price       numeric     not null,
  location    text        not null,
  area        text        default '',
  beds        text        default '',
  baths       text        default '',
  description text        default '',
  image_urls  text[]      default '{}',
  featured    boolean     default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Enable Row Level Security
alter table properties enable row level security;

-- 3. Public can READ all properties
create policy "Public can read properties"
  on properties for select
  using (true);

-- 4. Only authenticated users (admin) can INSERT / UPDATE / DELETE
create policy "Admin can insert"
  on properties for insert
  with check (auth.role() = 'authenticated');

create policy "Admin can update"
  on properties for update
  using (auth.role() = 'authenticated');

create policy "Admin can delete"
  on properties for delete
  using (auth.role() = 'authenticated');

-- 5. Storage bucket for property images
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

-- 6. Storage policies
create policy "Public can view images"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "Admin can upload images"
  on storage.objects for insert
  with check (bucket_id = 'property-images' and auth.role() = 'authenticated');

create policy "Admin can delete images"
  on storage.objects for delete
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');

-- =====================================================
-- DONE! Now:
-- 1. Go to Authentication → Users → Add User
-- 2. Enter your admin email and password
-- 3. That's your admin login!
-- =====================================================
