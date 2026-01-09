-- Run this in Supabase SQL editor

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text check (role in ('user', 'designer', 'admin')) not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Global app settings table (for feature flags etc.)
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Seed default setting: allow designer applications by default
insert into public.app_settings (key, value)
values ('designer_applications_enabled', jsonb_build_object('enabled', true))
on conflict (key) do nothing;

-- Cards table
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
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

-- Design requests table
create table if not exists public.design_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  designer_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  status text check (status in ('Pending', 'In Progress', 'Completed', 'Rejected')) not null default 'Pending',
  assigned_to text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Designer applications table (users apply to become designers)
create table if not exists public.designer_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text check (status in ('pending', 'approved', 'rejected')) not null default 'pending',
  motivation text,
  portfolio_url text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
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

-- RLS: enable and basic policies
alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.cards enable row level security;
alter table public.print_requests enable row level security;
alter table public.design_requests enable row level security;
alter table public.designer_applications enable row level security;

-- Profiles policies
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can view all profiles') then
    create policy "Users can view all profiles" on public.profiles for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update own profile') then
    create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can insert own profile') then
    create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
  end if;
end $$;

-- App settings policies (readable by everyone, writable by admin/service)
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'app_settings' and policyname = 'Anyone can read settings') then
    create policy "Anyone can read settings" on public.app_settings for select using (true);
  end if;
end $$;

-- Cards policies
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'cards' and policyname = 'Allow read for anon') then
    create policy "Allow read for anon" on public.cards for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'cards' and policyname = 'Users can view own cards') then
    create policy "Users can view own cards" on public.cards for select to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'cards' and policyname = 'Users can create own cards') then
    create policy "Users can create own cards" on public.cards for insert to authenticated with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'cards' and policyname = 'Users can update own cards') then
    create policy "Users can update own cards" on public.cards for update to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'cards' and policyname = 'Users can delete own cards') then
    create policy "Users can delete own cards" on public.cards for delete to authenticated using (auth.uid() = user_id);
  end if;
end $$;

-- Service role policies (for server-side operations)
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

-- Design requests policies
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'design_requests' and policyname = 'Users can view own requests') then
    create policy "Users can view own requests" on public.design_requests for select to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'design_requests' and policyname = 'Designers can view all requests') then
    create policy "Designers can view all requests" on public.design_requests for select to authenticated using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'designer')
    );
  end if;
  if not exists (select 1 from pg_policies where tablename = 'design_requests' and policyname = 'Users can create requests') then
    create policy "Users can create requests" on public.design_requests for insert to authenticated with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'design_requests' and policyname = 'Designers can update assigned requests') then
    create policy "Designers can update assigned requests" on public.design_requests for update to authenticated using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'designer' and id = designer_id)
    );
  end if;
end $$;

-- Designer applications policies
do $$ begin
  -- Users can view and create their own applications
  if not exists (select 1 from pg_policies where tablename = 'designer_applications' and policyname = 'Users can view own applications') then
    create policy "Users can view own applications" on public.designer_applications for select to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'designer_applications' and policyname = 'Users can create applications') then
    create policy "Users can create applications" on public.designer_applications for insert to authenticated with check (auth.uid() = user_id);
  end if;
  -- Admins can view and update all applications
  if not exists (select 1 from pg_policies where tablename = 'designer_applications' and policyname = 'Admins can manage applications') then
    create policy "Admins can manage applications" on public.designer_applications for all to authenticated using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
  end if;
end $$;

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();



