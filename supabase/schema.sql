-- BlackDrivo Database Schema
-- Run this in your Supabase SQL editor

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ─── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'user' check (role in ('user', 'driver', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.drivers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid,
  license_number text not null,
  license_expiry date not null,
  license_state text not null default 'NY',
  vehicle_make text not null,
  vehicle_model text not null,
  vehicle_year integer not null,
  vehicle_color text not null,
  vehicle_registration text not null,
  vehicle_class text not null check (vehicle_class in ('business', 'first_class', 'suv', 'van')),
  insurance_provider text,
  insurance_policy text,
  insurance_expiry date,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  is_available boolean not null default false,
  rating numeric(3, 2),
  total_rides integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  passenger_id uuid references public.users(id) on delete set null,
  driver_id uuid references public.drivers(id) on delete set null,
  ride_type text not null check (ride_type in ('one_way', 'hourly', 'city_to_city')),
  vehicle_class text not null check (vehicle_class in ('business', 'first_class', 'suv', 'van')),
  pickup_address text not null,
  pickup_lat double precision not null default 0,
  pickup_lng double precision not null default 0,
  dropoff_address text not null,
  dropoff_lat double precision not null default 0,
  dropoff_lng double precision not null default 0,
  scheduled_at timestamptz not null,
  distance_km numeric(8, 2),
  duration_min integer,
  hours integer,
  passengers integer not null default 1,
  fare_estimate numeric(10, 2) not null,
  fare_final numeric(10, 2),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  stripe_payment_intent_id text,
  notes text,
  flight_number text,
  passenger_first_name text,
  passenger_last_name text,
  passenger_email text,
  passenger_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null unique,
  user_id uuid references public.users(id) on delete set null,
  driver_id uuid references public.drivers(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ─── Triggers ────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_users_updated_at before update on public.users
  for each row execute function public.set_updated_at();

create trigger set_drivers_updated_at before update on public.drivers
  for each row execute function public.set_updated_at();

create trigger set_bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.users    enable row level security;
alter table public.drivers  enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews  enable row level security;

-- Users
create policy "Users can read own record" on public.users
  for select using (auth.uid() = id);

create policy "Users can insert own record" on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update own record" on public.users
  for update using (auth.uid() = id);

create policy "Admins read all users" on public.users
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Bookings
create policy "Passengers read own bookings" on public.bookings
  for select using (auth.uid() = passenger_id);

create policy "Passengers create bookings" on public.bookings
  for insert with check (auth.uid() = passenger_id);

create policy "Passengers update own bookings" on public.bookings
  for update using (auth.uid() = passenger_id);

create policy "Drivers read assigned bookings" on public.bookings
  for select using (
    exists (select 1 from public.drivers where user_id = auth.uid() and id = bookings.driver_id)
  );

create policy "Admins manage all bookings" on public.bookings
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Drivers
create policy "Drivers read own record" on public.drivers
  for select using (user_id = auth.uid());

create policy "Drivers update own record" on public.drivers
  for update using (user_id = auth.uid());

create policy "Drivers create own record" on public.drivers
  for insert with check (user_id = auth.uid());

create policy "Admins manage all drivers" on public.drivers
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index if not exists bookings_passenger_id_idx on public.bookings(passenger_id);
create index if not exists bookings_driver_id_idx    on public.bookings(driver_id);
create index if not exists bookings_status_idx       on public.bookings(status);
create index if not exists bookings_scheduled_at_idx on public.bookings(scheduled_at);
create index if not exists drivers_status_idx        on public.drivers(status);
create index if not exists drivers_user_id_idx       on public.drivers(user_id);
