-- =========================
-- Supabase SQL – complete schema, permissive RLS policies, sample seeds,
-- and corrected KV snapshot upserts (INSERT ... SELECT/CTE style)
-- =========================

-- =========================
-- SCHEMA
-- =========================

-- USERS
create table if not exists public.users (
  id text primary key,
  name text not null,
  email text unique not null,
  password text not null, -- hash in production
  role text not null check (role in ('admin','customer','delivery')),
  created_at timestamptz not null default now()
);

-- HOMEPAGE CARDS
create table if not exists public.homepage_cards (
  id text primary key,
  title text not null,
  description text,
  category text,
  image text,
  created_at timestamptz not null default now()
);

-- PRODUCTS
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  original_price numeric(12,2),
  stock int not null default 0,
  stock_status text not null default 'in' check (stock_status in ('in','out')),
  category text,
  image text,
  homepage_card_id text references public.homepage_cards(id) on delete set null,
  created_at timestamptz not null default now()
);

-- DELIVERY AGENTS
create table if not exists public.delivery_agents (
  id text primary key,
  name text not null,
  email text unique not null,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);

-- AGENT LOCATIONS (latest per agent)
create table if not exists public.agent_locations (
  agent_id text primary key references public.delivery_agents(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  ts timestamptz not null default now()
);

-- ORDERS (header)
create table if not exists public.orders (
  id text primary key,
  customer_id text not null references public.users(id) on delete restrict,
  total numeric(12,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','picked_up','out_for_delivery','delivered')),
  date timestamptz not null default now(),
  dropoff jsonb,         -- { lat, lng }
  contact jsonb,         -- { name, mobile, altMobile, address, landmark, pincode }
  payment jsonb,         -- payment payload if any
  delivery_agent_id text references public.delivery_agents(id) on delete set null
);

-- ORDER ITEMS (lines)
create table if not exists public.order_items (
  id bigserial primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id) on delete restrict,
  product_name text not null,
  price numeric(12,2) not null,
  quantity int not null check (quantity > 0)
);
create index if not exists order_items_order_idx on public.order_items(order_id);
-- Ensure one row per product per order
-- 1) Cleanup existing duplicates (keep the latest id per (order_id, product_id))
with dups as (
  select order_id, product_id, max(id) as keep_id
  from public.order_items
  group by order_id, product_id
), to_delete as (
  select oi.id
  from public.order_items oi
  join dups d on oi.order_id = d.order_id and oi.product_id = d.product_id
  where oi.id <> d.keep_id
)
delete from public.order_items oi using to_delete td where oi.id = td.id;

-- 2) Create unique index (only if it doesn't exist)
do $$ begin
  perform 1 from pg_indexes where schemaname = 'public' and indexname = 'order_items_unique_order_product';
  if not found then
    execute 'create unique index order_items_unique_order_product on public.order_items(order_id, product_id)';
  end if;
end $$;

-- CARTS (per user) and CART ITEMS
create table if not exists public.carts (
  id text primary key,
  user_id text unique not null references public.users(id) on delete cascade,
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id bigserial primary key,
  cart_id text not null references public.carts(id) on delete cascade,
  product_id text not null references public.products(id) on delete restrict,
  product_name text not null,
  price numeric(12,2) not null,
  quantity int not null check (quantity > 0)
);
create index if not exists cart_items_cart_idx on public.cart_items(cart_id);

-- NOTIFICATIONS (per user)
create table if not exists public.notifications (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  msg text not null,
  ts timestamptz not null default now()
);
create index if not exists notifications_user_ts_idx on public.notifications(user_id, ts desc);

-- SEARCH LOGS (admin insights)
create table if not exists public.search_logs (
  id text primary key,
  term text unique not null,
  count int not null default 0,
  last_ts timestamptz not null default now()
);

-- OPTIONAL: KV snapshot table (for simple JSON sync if needed)
create table if not exists public.kv_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists kv_store_updated_at_idx on public.kv_store(updated_at desc);

-- =========================
-- RLS: ENABLE + PERMISSIVE POLICIES (frontend-only; tighten for prod)
-- =========================

alter table public.users enable row level security;
drop policy if exists "users select anon" on public.users;
drop policy if exists "users insert anon" on public.users;
drop policy if exists "users update anon" on public.users;
create policy "users select anon" on public.users for select to anon using (true);
create policy "users insert anon" on public.users for insert to anon with check (true);
create policy "users update anon" on public.users for update to anon using (true) with check (true);

alter table public.homepage_cards enable row level security;
drop policy if exists "homepage_cards select anon" on public.homepage_cards;
drop policy if exists "homepage_cards insert anon" on public.homepage_cards;
drop policy if exists "homepage_cards update anon" on public.homepage_cards;
create policy "homepage_cards select anon" on public.homepage_cards for select to anon using (true);
create policy "homepage_cards insert anon" on public.homepage_cards for insert to anon with check (true);
create policy "homepage_cards update anon" on public.homepage_cards for update to anon using (true) with check (true);

alter table public.products enable row level security;
drop policy if exists "products select anon" on public.products;
drop policy if exists "products insert anon" on public.products;
drop policy if exists "products update anon" on public.products;
create policy "products select anon" on public.products for select to anon using (true);
create policy "products insert anon" on public.products for insert to anon with check (true);
create policy "products update anon" on public.products for update to anon using (true) with check (true);

alter table public.delivery_agents enable row level security;
drop policy if exists "agents select anon" on public.delivery_agents;
drop policy if exists "agents insert anon" on public.delivery_agents;
drop policy if exists "agents update anon" on public.delivery_agents;
create policy "agents select anon" on public.delivery_agents for select to anon using (true);
create policy "agents insert anon" on public.delivery_agents for insert to anon with check (true);
create policy "agents update anon" on public.delivery_agents for update to anon using (true) with check (true);

alter table public.agent_locations enable row level security;
drop policy if exists "agent_locations select anon" on public.agent_locations;
drop policy if exists "agent_locations insert anon" on public.agent_locations;
drop policy if exists "agent_locations update anon" on public.agent_locations;
create policy "agent_locations select anon" on public.agent_locations for select to anon using (true);
create policy "agent_locations insert anon" on public.agent_locations for insert to anon with check (true);
create policy "agent_locations update anon" on public.agent_locations for update to anon using (true) with check (true);

alter table public.orders enable row level security;
drop policy if exists "orders select anon" on public.orders;
drop policy if exists "orders insert anon" on public.orders;
drop policy if exists "orders update anon" on public.orders;
create policy "orders select anon" on public.orders for select to anon using (true);
create policy "orders insert anon" on public.orders for insert to anon with check (true);
create policy "orders update anon" on public.orders for update to anon using (true) with check (true);

alter table public.order_items enable row level security;
drop policy if exists "order_items select anon" on public.order_items;
drop policy if exists "order_items insert anon" on public.order_items;
drop policy if exists "order_items update anon" on public.order_items;
drop policy if exists "order_items delete anon" on public.order_items;
create policy "order_items select anon" on public.order_items for select to anon using (true);
create policy "order_items insert anon" on public.order_items for insert to anon with check (true);
create policy "order_items update anon" on public.order_items for update to anon using (true) with check (true);
create policy "order_items delete anon" on public.order_items for delete to anon using (true);

alter table public.carts enable row level security;
drop policy if exists "carts select anon" on public.carts;
drop policy if exists "carts insert anon" on public.carts;
drop policy if exists "carts update anon" on public.carts;
create policy "carts select anon" on public.carts for select to anon using (true);
create policy "carts insert anon" on public.carts for insert to anon with check (true);
create policy "carts update anon" on public.carts for update to anon using (true) with check (true);

alter table public.cart_items enable row level security;
drop policy if exists "cart_items select anon" on public.cart_items;
drop policy if exists "cart_items insert anon" on public.cart_items;
drop policy if exists "cart_items update anon" on public.cart_items;
drop policy if exists "cart_items delete anon" on public.cart_items;
create policy "cart_items select anon" on public.cart_items for select to anon using (true);
create policy "cart_items insert anon" on public.cart_items for insert to anon with check (true);
create policy "cart_items update anon" on public.cart_items for update to anon using (true) with check (true);
create policy "cart_items delete anon" on public.cart_items for delete to anon using (true);

alter table public.notifications enable row level security;
drop policy if exists "notifications select anon" on public.notifications;
drop policy if exists "notifications insert anon" on public.notifications;
create policy "notifications select anon" on public.notifications for select to anon using (true);
create policy "notifications insert anon" on public.notifications for insert to anon with check (true);

alter table public.search_logs enable row level security;
drop policy if exists "search_logs select anon" on public.search_logs;
drop policy if exists "search_logs insert anon" on public.search_logs;
drop policy if exists "search_logs update anon" on public.search_logs;
create policy "search_logs select anon" on public.search_logs for select to anon using (true);
create policy "search_logs insert anon" on public.search_logs for insert to anon with check (true);
create policy "search_logs update anon" on public.search_logs for update to anon using (true) with check (true);

alter table public.kv_store enable row level security;
drop policy if exists "kv select anon" on public.kv_store;
drop policy if exists "kv insert anon" on public.kv_store;
drop policy if exists "kv update anon" on public.kv_store;
create policy "kv select anon" on public.kv_store for select to anon using (true);
create policy "kv insert anon" on public.kv_store for insert to anon with check (true);
create policy "kv update anon" on public.kv_store for update to anon using (true) with check (true);

-- =========================
-- SEEDS (optional)
-- =========================

-- Users (demo)
insert into public.users (id,name,email,password,role) values
('admin','Admin','admin@mangomart.com','admin123','admin')
on conflict (id) do update set name=excluded.name;

insert into public.users (id,name,email,password,role) values
('cust','Customer','customer@example.com','customer123','customer')
on conflict (id) do nothing;

insert into public.users (id,name,email,password,role) values
('delv','Delivery Agent','delivery@mangomart.com','delivery123','delivery')
on conflict (id) do nothing;

-- Delivery agents directory
insert into public.delivery_agents (id,name,email,status) values
('delv','Delivery Agent','delivery@mangomart.com','active')
on conflict (id) do nothing;

-- Homepage cards
insert into public.homepage_cards (id,title,description,category,image) values
('hc1','Fruits & Vegetables','Farm-fresh picks daily','Fruits','https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600'),
('hc2','Groceries','Foods, snacks, and beverages','Beverages','https://images.unsplash.com/photo-1505575967455-40e256f73376?w=1600'),
('hc3','Stationery & Cleaning','Home and office essentials','Others','https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1600')
on conflict (id) do update set title=excluded.title;

-- Products
insert into public.products (id,name,description,price,original_price,stock,stock_status,category,image,homepage_card_id) values
('prod_apples','Fresh Apples','Crisp and sweet Shimla apples',199,249,120,'in','Fruits','https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=1200','hc1'),
('prod_bananas','Bananas','Naturally ripened Cavendish bananas',99,120,200,'in','Fruits','https://images.unsplash.com/photo-1571772805064-207c8435df79?w=1200','hc1'),
('prod_milk','Organic Milk 1L','Farm fresh A2 milk',75,90,80,'in','Dairy','https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200','hc2'),
('prod_bread','Whole Wheat Bread','Soft and fiber-rich loaf',55,65,60,'in','Bakery','https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=1200','hc2')
on conflict (id) do update set name=excluded.name;

-- Backfill: ensure column exists for existing deployments
alter table public.products add column if not exists original_price numeric(12,2);

-- =========================
-- KV SNAPSHOT UPSERTS (corrected)
-- =========================

-- Separate statements
insert into public.kv_store (key, value)
select 'homepageCards',
       coalesce(jsonb_agg(to_jsonb(hc.*)), '[]'::jsonb)
from public.homepage_cards hc
on conflict (key) do update
set value = excluded.value, updated_at = now();

insert into public.kv_store (key, value)
select 'products',
       coalesce(jsonb_agg(to_jsonb(p.*)), '[]'::jsonb)
from public.products p
on conflict (key) do update
set value = excluded.value, updated_at = now();

-- Or combined via CTE
-- with payloads as (
--   select 'homepageCards' as key,
--          coalesce(jsonb_agg(to_jsonb(hc.*)), '[]'::jsonb) as value
--   from public.homepage_cards hc
--   union all
--   select 'products',
--          coalesce(jsonb_agg(to_jsonb(p.*)), '[]'::jsonb)
--   from public.products p
-- )
-- insert into public.kv_store (key, value)
-- select key, value from payloads
-- on conflict (key) do update
-- set value = excluded.value, updated_at = now();


