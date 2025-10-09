-- Run this in Supabase SQL editor

-- Cards table
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  recipient_name text not null,
  message text not null,
  media_type text check (media_type in ('image','video','animation','text')) not null,
  media_url text,
  background_color text,
  text_color text,
  title_color text,
  message_color text,
  font_family text,
  title_align text check (title_align in ('left','center','right')),
  message_align text check (message_align in ('left','center','right')),
  title_size text,
  message_size text,
  theme_preset text,
  unlock_at timestamptz,
  is_locked boolean not null default false,
  key text,
  opened_at timestamptz,
  created_at timestamptz not null default now()
);

-- Print requests table
create table if not exists public.print_requests (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  recipient_name text not null,
  address_line text not null,
  wrap_style text check (wrap_style in ('classic','festive','minimal')) not null,
  note text,
  created_at timestamptz not null default now()
);

-- RLS: enable and basic policies (customize as needed)
alter table public.cards enable row level security;
alter table public.print_requests enable row level security;

-- Simple read for anon (public gallery) - tighten if needed
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'cards' and policyname = 'Allow read for anon') then
    create policy "Allow read for anon" on public.cards for select to anon using (true);
  end if;
end $$;

-- Insert/update/delete only with service role (our server-side uses service key)
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'cards' and policyname = 'Service write') then
    create policy "Service write" on public.cards for all to service_role using (true) with check (true);
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'print_requests' and policyname = 'Service write') then
    create policy "Service write" on public.print_requests for all to service_role using (true) with check (true);
  end if;
end $$;



