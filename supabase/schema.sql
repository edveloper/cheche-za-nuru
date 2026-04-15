create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.donation_funds (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  impact_summary text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.donation_intents (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  donor_name text not null,
  donor_email text not null,
  donor_phone text not null default '',
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'KES',
  purpose text not null default 'Support where it is needed most',
  fund_id uuid references public.donation_funds(id) on delete set null,
  is_recurring boolean not null default false,
  recurrence text not null default 'one_time',
  tribute_name text not null default '',
  donor_message text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'pledged', 'paid', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null default '',
  email text not null,
  phone text not null default '',
  interest text not null default '',
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'responded', 'archived')),
  submitted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.involvement_leads (
  id uuid primary key default gen_random_uuid(),
  interest_type text not null check (
    interest_type in (
      'donate',
      'volunteer',
      'partner',
      'sponsor',
      'in_kind',
      'media',
      'other'
    )
  ),
  organization_name text not null default '',
  contact_name text not null,
  email text not null,
  phone text not null default '',
  location text not null default '',
  support_area text not null default '',
  budget_range text not null default '',
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'in_progress', 'closed')),
  submitted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.program_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  program_type text not null check (program_type in ('education', 'healthcare', 'sports', 'community')),
  summary text not null default '',
  description text not null default '',
  location text not null default '',
  start_date timestamptz not null,
  end_date timestamptz,
  is_featured boolean not null default false,
  status text not null default 'scheduled' check (status in ('draft', 'scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.impact_metrics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  value_text text not null,
  numeric_value numeric(14, 2),
  unit text not null default '',
  category text not null check (category in ('education', 'healthcare', 'sports', 'cross_cutting')),
  metric_year integer,
  summary text not null default '',
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.impact_context_stats (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  value_text text not null,
  numeric_value numeric(14, 2),
  unit text not null default '',
  scope text not null default 'kenya',
  stat_year integer,
  summary text not null default '',
  source_name text not null,
  source_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  cover_image_path text not null default '',
  body_md text not null default '',
  author_name text not null default 'Cheche Za Nuru',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.voice_submissions (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  role_label text not null default '',
  location text not null default '',
  quote text not null,
  story_body text not null default '',
  photo_path text not null default '',
  is_public_submission boolean not null default true,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.story_galleries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  story_date date,
  cover_image_path text not null default '',
  layout_style text not null default 'editorial' check (layout_style in ('editorial', 'mosaic', 'stacked')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.story_gallery_items (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.story_galleries(id) on delete cascade,
  image_path text not null,
  caption text not null default '',
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.video_stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  video_path text not null,
  thumbnail_path text not null default '',
  duration_seconds integer,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_program_events_start_date on public.program_events(start_date);
create index if not exists idx_program_events_program_type on public.program_events(program_type);
create index if not exists idx_impact_metrics_category on public.impact_metrics(category);
create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_voice_submissions_status on public.voice_submissions(status);
create index if not exists idx_story_galleries_status on public.story_galleries(status);
create index if not exists idx_story_gallery_items_gallery on public.story_gallery_items(gallery_id, sort_order);
create index if not exists idx_video_stories_status on public.video_stories(status);
create index if not exists idx_involvement_leads_interest_type on public.involvement_leads(interest_type);

drop trigger if exists donation_funds_set_updated_at on public.donation_funds;
create trigger donation_funds_set_updated_at
before update on public.donation_funds
for each row execute function public.set_updated_at();

drop trigger if exists donation_intents_set_updated_at on public.donation_intents;
create trigger donation_intents_set_updated_at
before update on public.donation_intents
for each row execute function public.set_updated_at();

drop trigger if exists contact_submissions_set_updated_at on public.contact_submissions;
create trigger contact_submissions_set_updated_at
before update on public.contact_submissions
for each row execute function public.set_updated_at();

drop trigger if exists involvement_leads_set_updated_at on public.involvement_leads;
create trigger involvement_leads_set_updated_at
before update on public.involvement_leads
for each row execute function public.set_updated_at();

drop trigger if exists program_events_set_updated_at on public.program_events;
create trigger program_events_set_updated_at
before update on public.program_events
for each row execute function public.set_updated_at();

drop trigger if exists impact_metrics_set_updated_at on public.impact_metrics;
create trigger impact_metrics_set_updated_at
before update on public.impact_metrics
for each row execute function public.set_updated_at();

drop trigger if exists impact_context_stats_set_updated_at on public.impact_context_stats;
create trigger impact_context_stats_set_updated_at
before update on public.impact_context_stats
for each row execute function public.set_updated_at();

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists voice_submissions_set_updated_at on public.voice_submissions;
create trigger voice_submissions_set_updated_at
before update on public.voice_submissions
for each row execute function public.set_updated_at();

drop trigger if exists story_galleries_set_updated_at on public.story_galleries;
create trigger story_galleries_set_updated_at
before update on public.story_galleries
for each row execute function public.set_updated_at();

drop trigger if exists video_stories_set_updated_at on public.video_stories;
create trigger video_stories_set_updated_at
before update on public.video_stories
for each row execute function public.set_updated_at();

alter table public.donation_funds enable row level security;
alter table public.donation_intents enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.involvement_leads enable row level security;
alter table public.program_events enable row level security;
alter table public.impact_metrics enable row level security;
alter table public.impact_context_stats enable row level security;
alter table public.blog_posts enable row level security;
alter table public.voice_submissions enable row level security;
alter table public.story_galleries enable row level security;
alter table public.story_gallery_items enable row level security;
alter table public.video_stories enable row level security;

drop policy if exists "public can read active donation funds" on public.donation_funds;
create policy "public can read active donation funds"
on public.donation_funds
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "public can read scheduled events" on public.program_events;
create policy "public can read scheduled events"
on public.program_events
for select
to anon, authenticated
using (status in ('scheduled', 'completed'));

drop policy if exists "public can read impact metrics" on public.impact_metrics;
create policy "public can read impact metrics"
on public.impact_metrics
for select
to anon, authenticated
using (true);

drop policy if exists "public can read impact context stats" on public.impact_context_stats;
create policy "public can read impact context stats"
on public.impact_context_stats
for select
to anon, authenticated
using (true);

drop policy if exists "public can read published blog posts" on public.blog_posts;
create policy "public can read published blog posts"
on public.blog_posts
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "public can read approved voices" on public.voice_submissions;
create policy "public can read approved voices"
on public.voice_submissions
for select
to anon, authenticated
using (status = 'approved');

drop policy if exists "public can submit voices" on public.voice_submissions;
create policy "public can submit voices"
on public.voice_submissions
for insert
to anon, authenticated
with check (is_public_submission = true and status = 'pending');

drop policy if exists "public can read published galleries" on public.story_galleries;
create policy "public can read published galleries"
on public.story_galleries
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "public can read gallery items for published galleries" on public.story_gallery_items;
create policy "public can read gallery items for published galleries"
on public.story_gallery_items
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.story_galleries g
    where g.id = story_gallery_items.gallery_id
      and g.status = 'published'
  )
);

drop policy if exists "public can read published videos" on public.video_stories;
create policy "public can read published videos"
on public.video_stories
for select
to anon, authenticated
using (status = 'published');

-- Submission tables should typically be written through Next.js route handlers
-- using the service role key. Keep public reads disabled.
