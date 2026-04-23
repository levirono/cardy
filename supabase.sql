-- ==========================================================================
-- Cardy — Full Database Schema (run in Supabase SQL editor)
-- ==========================================================================

-- ── Profiles ───────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('user', 'designer', 'admin')) not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── App Settings ───────────────────────────────────────────────────────────
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.app_settings (key, value)
values ('designer_applications_enabled', jsonb_build_object('enabled', true))
on conflict (key) do nothing;

-- ── Cards ──────────────────────────────────────────────────────────────────
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  recipient_name text not null,
  message text not null,
  media_type text check (media_type in ('image','video','animation','text')) not null default 'text',
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
  template_id uuid, -- reference to card_templates (set below after table created)
  unlock_at timestamptz,
  is_locked boolean not null default false,
  key text,
  opened_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── Card Templates (designer uploads) ─────────────────────────────────────
create table if not exists public.card_templates (
  id uuid primary key default gen_random_uuid(),
  designer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  thumbnail_url text,
  preview_url text,
  category text check (category in ('birthday','anniversary','wedding','general','christmas','valentine','thank_you','graduation')) not null default 'general',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Now add FK from cards to card_templates
alter table public.cards
  add constraint if not exists cards_template_id_fkey
  foreign key (template_id) references public.card_templates(id) on delete set null;

-- ── Card Ratings ───────────────────────────────────────────────────────────
create table if not exists public.card_ratings (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.card_templates(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (template_id, user_id)  -- one rating per user per template
);

-- ── Design Requests ────────────────────────────────────────────────────────
create table if not exists public.design_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  designer_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  status text check (status in ('Pending','In Progress','Completed','Rejected')) not null default 'Pending',
  assigned_to text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Designer Applications ──────────────────────────────────────────────────
create table if not exists public.designer_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text check (status in ('pending','approved','rejected')) not null default 'pending',
  motivation text,
  portfolio_url text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

-- ── Print Requests ─────────────────────────────────────────────────────────
create table if not exists public.print_requests (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  recipient_name text not null,
  address_line text not null,
  wrap_style text check (wrap_style in ('classic','festive','minimal')) not null,
  note text,
  created_at timestamptz not null default now()
);

-- ── Valentines ─────────────────────────────────────────────────────────────
create table if not exists public.valentines (
  id uuid primary key default gen_random_uuid(),
  sender_name text,
  recipient text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ── Weddings ───────────────────────────────────────────────────────────────
create table if not exists public.weddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  couple_name_1 text not null,
  couple_name_2 text not null,
  wedding_date date not null,
  venue_name text,
  venue_address text,
  venue_lat numeric,
  venue_lng numeric,
  ceremony_time text,
  reception_time text,
  cover_image_url text,
  theme_color text default '#d4a5a5',
  theme_preset text check (theme_preset in ('classic','modern','rustic','floral','minimal','tropical','bohemian')) default 'classic',
  welcome_message text,
  story_text text,
  dress_code text,
  additional_info text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Wedding RSVPs ──────────────────────────────────────────────────────────
create table if not exists public.wedding_rsvps (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  guest_name text not null,
  guest_email text,
  attendance_status text check (attendance_status in ('attending','not_attending','maybe')) not null,
  how_they_know text check (how_they_know in ('bride','groom','both','other')) not null default 'both',
  how_they_know_detail text,
  dietary_restrictions text,
  plus_one boolean not null default false,
  plus_one_name text,
  message_to_couple text,
  created_at timestamptz not null default now()
);

-- ── Wedding Wishes ─────────────────────────────────────────────────────────
create table if not exists public.wedding_wishes (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  guest_name text not null,
  wish_message text not null,
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

-- ==========================================================================
-- RLS Setup
-- ==========================================================================

alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.cards enable row level security;
alter table public.card_templates enable row level security;
alter table public.card_ratings enable row level security;
alter table public.design_requests enable row level security;
alter table public.designer_applications enable row level security;
alter table public.print_requests enable row level security;
alter table public.valentines enable row level security;
alter table public.weddings enable row level security;
alter table public.wedding_rsvps enable row level security;
alter table public.wedding_wishes enable row level security;

-- ── Profiles policies ──────────────────────────────────────────────────────
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
drop policy if exists "profiles_service" on public.profiles;

create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_service" on public.profiles for all to service_role using (true) with check (true);

-- ── App settings policies ──────────────────────────────────────────────────
drop policy if exists "settings_read" on public.app_settings;
drop policy if exists "settings_service" on public.app_settings;

create policy "settings_read" on public.app_settings for select using (true);
create policy "settings_service" on public.app_settings for all to service_role using (true) with check (true);

-- ── Cards policies ─────────────────────────────────────────────────────────
drop policy if exists "cards_anon_read" on public.cards;
drop policy if exists "cards_auth_own" on public.cards;
drop policy if exists "cards_service" on public.cards;

create policy "cards_anon_read" on public.cards for select to anon using (true);
create policy "cards_auth_own" on public.cards for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cards_service" on public.cards for all to service_role using (true) with check (true);

-- ── Card Templates policies ────────────────────────────────────────────────
drop policy if exists "templates_read" on public.card_templates;
drop policy if exists "templates_designer_write" on public.card_templates;
drop policy if exists "templates_service" on public.card_templates;

create policy "templates_read" on public.card_templates for select using (is_active = true);
create policy "templates_designer_write" on public.card_templates for insert to authenticated
  with check (
    auth.uid() = designer_id and
    exists (select 1 from public.profiles where id = auth.uid() and role in ('designer','admin'))
  );
create policy "templates_designer_update" on public.card_templates for update to authenticated
  using (auth.uid() = designer_id);
create policy "templates_service" on public.card_templates for all to service_role using (true) with check (true);

-- ── Card Ratings policies ──────────────────────────────────────────────────
drop policy if exists "ratings_read" on public.card_ratings;
drop policy if exists "ratings_write" on public.card_ratings;
drop policy if exists "ratings_service" on public.card_ratings;

create policy "ratings_read" on public.card_ratings for select using (true);
create policy "ratings_write" on public.card_ratings for insert to authenticated with check (auth.uid() = user_id);
create policy "ratings_service" on public.card_ratings for all to service_role using (true) with check (true);

-- ── Design Requests policies ───────────────────────────────────────────────
drop policy if exists "dreq_user_select" on public.design_requests;
drop policy if exists "dreq_designer_select" on public.design_requests;
drop policy if exists "dreq_user_insert" on public.design_requests;
drop policy if exists "dreq_designer_update" on public.design_requests;
drop policy if exists "dreq_service" on public.design_requests;

create policy "dreq_user_select" on public.design_requests for select to authenticated
  using (auth.uid() = user_id);
create policy "dreq_designer_select" on public.design_requests for select to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('designer','admin')));
create policy "dreq_user_insert" on public.design_requests for insert to authenticated
  with check (auth.uid() = user_id);
create policy "dreq_designer_update" on public.design_requests for update to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('designer','admin')));
create policy "dreq_service" on public.design_requests for all to service_role using (true) with check (true);

-- ── Designer Applications policies ────────────────────────────────────────
drop policy if exists "dapp_user_select" on public.designer_applications;
drop policy if exists "dapp_user_insert" on public.designer_applications;
drop policy if exists "dapp_service" on public.designer_applications;

create policy "dapp_user_select" on public.designer_applications for select to authenticated
  using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "dapp_user_insert" on public.designer_applications for insert to authenticated
  with check (auth.uid() = user_id);
create policy "dapp_service" on public.designer_applications for all to service_role using (true) with check (true);

-- ── Print Requests policies ────────────────────────────────────────────────
drop policy if exists "print_service" on public.print_requests;
create policy "print_service" on public.print_requests for all to service_role using (true) with check (true);

-- ── Valentines policies ────────────────────────────────────────────────────
drop policy if exists "valentines_read" on public.valentines;
drop policy if exists "valentines_insert" on public.valentines;
drop policy if exists "valentines_service" on public.valentines;

create policy "valentines_read" on public.valentines for select using (true);
create policy "valentines_insert" on public.valentines for insert using (true) with check (true);
create policy "valentines_service" on public.valentines for all to service_role using (true) with check (true);

-- ── Wedding policies ───────────────────────────────────────────────────────
drop policy if exists "weddings_public_read" on public.weddings;
drop policy if exists "weddings_owner" on public.weddings;
drop policy if exists "weddings_service" on public.weddings;

create policy "weddings_public_read" on public.weddings for select
  using (is_published = true or auth.uid() = user_id);
create policy "weddings_owner" on public.weddings for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "weddings_service" on public.weddings for all to service_role using (true) with check (true);

-- ── Wedding RSVPs policies ─────────────────────────────────────────────────
drop policy if exists "rsvp_public_insert" on public.wedding_rsvps;
drop policy if exists "rsvp_owner_select" on public.wedding_rsvps;
drop policy if exists "rsvp_service" on public.wedding_rsvps;

create policy "rsvp_public_insert" on public.wedding_rsvps for insert using (true) with check (true);
create policy "rsvp_owner_select" on public.wedding_rsvps for select
  using (exists (select 1 from public.weddings where id = wedding_id and user_id = auth.uid()));
create policy "rsvp_service" on public.wedding_rsvps for all to service_role using (true) with check (true);

-- ── Wedding Wishes policies ────────────────────────────────────────────────
drop policy if exists "wishes_public_read" on public.wedding_wishes;
drop policy if exists "wishes_public_insert" on public.wedding_wishes;
drop policy if exists "wishes_owner" on public.wedding_wishes;
drop policy if exists "wishes_service" on public.wedding_wishes;

create policy "wishes_public_read" on public.wedding_wishes for select using (is_approved = true);
create policy "wishes_public_insert" on public.wedding_wishes for insert using (true) with check (true);
create policy "wishes_owner" on public.wedding_wishes for update to authenticated
  using (exists (select 1 from public.weddings where id = wedding_id and user_id = auth.uid()));
create policy "wishes_service" on public.wedding_wishes for all to service_role using (true) with check (true);

-- ==========================================================================
-- Functions & Triggers
-- ==========================================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at for weddings
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists weddings_updated_at on public.weddings;
create trigger weddings_updated_at
  before update on public.weddings
  for each row execute procedure public.set_updated_at();

drop trigger if exists design_requests_updated_at on public.design_requests;
create trigger design_requests_updated_at
  before update on public.design_requests
  for each row execute procedure public.set_updated_at();
