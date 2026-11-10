-- Lipa: baza za oblak. V Supabase odpri SQL Editor, prilepi vse in klikni Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  code text unique default upper(substr(md5(random()::text), 1, 6)),
  partner uuid references public.profiles(id) on delete set null,
  goal int not null default 150,
  reward text not null default '',
  created_at timestamptz default now()
);

create table if not exists public.progress (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

create table if not exists public.cheers (
  id bigserial primary key,
  from_id uuid not null references auth.users on delete cascade,
  to_id uuid not null references auth.users on delete cascade,
  emoji text,
  msg text check (char_length(msg) <= 140),
  seen boolean not null default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.cheers enable row level security;

-- kdo je moj partner
create or replace function public.my_partner() returns uuid
language sql stable security definer set search_path = public as $$
  select partner from public.profiles where id = auth.uid()
$$;

-- profil se ustvari sam ob registraciji
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Learner'));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- pravila: vidiš sebe in svojega partnerja, nikogar drugega
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select using (id = auth.uid() or id = public.my_partner());
drop policy if exists "profiles update name" on public.profiles;
create policy "profiles update name" on public.profiles for update using (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (name) on public.profiles to authenticated;

drop policy if exists "progress read" on public.progress;
create policy "progress read" on public.progress for select using (user_id = auth.uid() or user_id = public.my_partner());
drop policy if exists "progress insert" on public.progress;
create policy "progress insert" on public.progress for insert with check (user_id = auth.uid());
drop policy if exists "progress update" on public.progress;
create policy "progress update" on public.progress for update using (user_id = auth.uid());

drop policy if exists "cheers read" on public.cheers;
create policy "cheers read" on public.cheers for select using (to_id = auth.uid() or from_id = auth.uid());
drop policy if exists "cheers send" on public.cheers;
create policy "cheers send" on public.cheers for insert with check (from_id = auth.uid() and to_id = public.my_partner());
drop policy if exists "cheers seen" on public.cheers;
create policy "cheers seen" on public.cheers for update using (to_id = auth.uid());

-- povezovanje s kodo
create or replace function public.link_partner(c text) returns text
language plpgsql security definer set search_path = public as $$
declare p public.profiles;
begin
  select * into p from public.profiles where code = upper(trim(c)) and id <> auth.uid();
  if p.id is null then raise exception 'No one has that code. Check it and try again.'; end if;
  if p.partner is not null and p.partner <> auth.uid() then raise exception 'That person is already connected with someone else.'; end if;
  update public.profiles set partner = p.id where id = auth.uid();
  update public.profiles set partner = auth.uid() where id = p.id;
  return p.name;
end $$;

create or replace function public.unlink_partner() returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set partner = null where id = public.my_partner();
  update public.profiles set partner = null where id = auth.uid();
end $$;

create or replace function public.set_pair_goal(g int, r text) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set goal = greatest(10, g), reward = left(coalesce(r, ''), 140)
  where id = auth.uid() or id = public.my_partner();
end $$;

grant execute on function public.link_partner(text), public.unlink_partner(), public.set_pair_goal(int, text) to authenticated;
