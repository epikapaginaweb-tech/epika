-- Épika Academy · esquema inicial
-- Ejecutar en Supabase → SQL Editor sobre un proyecto nuevo.

create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  headline text,
  bio text,
  experience text,
  specialty text,
  visible boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  image_url text,
  category text not null default 'programa' check (category in ('programa', 'seminario', 'otro')),
  modality text not null default 'virtual' check (modality in ('presencial', 'virtual', 'hibrida')),
  short_description text,
  summary text,
  objectives text[] not null default '{}',
  audience text,
  requirements text[] not null default '{}',
  modules jsonb not null default '[]',
  teacher_id uuid references public.teachers(id) on delete set null,
  duration text,
  schedule text,
  start_date date,
  price numeric(12, 2),
  currency text not null default 'USD',
  payment_methods text[] not null default '{}',
  includes text[] not null default '{}',
  certificate text,
  brief_url text,
  brief_public boolean not null default false,
  visible boolean not null default false,
  featured boolean not null default false,
  rating numeric(2,1) not null default 5,
  show_ecuador boolean not null default true,
  coming_soon boolean not null default false,
  price_credit numeric(12, 2),
  cash_note text,
  credit_note text,
  academic_hours int,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  kind text not null default 'consulta' check (kind in ('consulta', 'reserva')),
  full_name text not null,
  email text not null,
  phone text not null,
  course_id uuid references public.courses(id) on delete set null,
  course_title text,
  message text,
  privacy_accepted_at timestamptz not null,
  status text not null default 'nueva' check (status in ('nueva', 'contactada', 'inscrita')),
  payment_status text not null default 'sin_comprobante'
    check (payment_status in ('sin_comprobante', 'en_revision', 'aprobado', 'rechazado')),
  receipt_path text,
  upload_token uuid not null default gen_random_uuid(),
  cedula text,
  username text,
  credentials_sent_at timestamptz,
  notes text,
  birth_date date,
  education text,
  city text,
  address text
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  visible boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete set null,
  name text not null,
  course text,
  quote text not null,
  photo_url text,
  authorized boolean not null default false,
  visible boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

create index if not exists courses_visible_sort_idx on public.courses (visible, sort);
create index if not exists inquiries_status_idx on public.inquiries (status, created_at desc);

drop trigger if exists teachers_touch on public.teachers;
create trigger teachers_touch before update on public.teachers
  for each row execute function public.touch_updated_at();
drop trigger if exists courses_touch on public.courses;
create trigger courses_touch before update on public.courses
  for each row execute function public.touch_updated_at();
drop trigger if exists inquiries_touch on public.inquiries;
create trigger inquiries_touch before update on public.inquiries
  for each row execute function public.touch_updated_at();

-- RLS: el público solo lee contenido visible. Todo lo demás pasa por el servidor (service role).
alter table public.teachers enable row level security;
alter table public.courses enable row level security;
alter table public.inquiries enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "public read teachers" on public.teachers;
create policy "public read teachers" on public.teachers for select using (visible);
drop policy if exists "public read courses" on public.courses;
create policy "public read courses" on public.courses for select using (visible);
drop policy if exists "public read faqs" on public.faqs;
create policy "public read faqs" on public.faqs for select using (visible);
drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select using (visible and authorized);
drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using (true);

-- Storage: imágenes y briefs públicos; comprobantes privados.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']),
  ('receipts', 'receipts', false, 8388608,
    array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
