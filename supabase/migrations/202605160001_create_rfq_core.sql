create extension if not exists "pgcrypto";

create table if not exists public.comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  comparison_id uuid not null references public.comparisons(id) on delete cascade,
  name text not null,
  file_path text,
  quote_number text,
  quote_date text,
  currency text,
  payment_terms text,
  overall_lead_time text,
  created_at timestamptz not null default now()
);

create table if not exists public.line_items (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  item_name text not null,
  normalized_item_name text not null,
  description text,
  quantity numeric,
  unit_price numeric,
  total_price numeric,
  unit_of_measure text,
  lead_time text,
  minimum_order_quantity numeric,
  notes text,
  confidence_score numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.comparison_results (
  id uuid primary key default gen_random_uuid(),
  comparison_id uuid not null references public.comparisons(id) on delete cascade,
  result_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.comparisons enable row level security;
alter table public.suppliers enable row level security;
alter table public.line_items enable row level security;
alter table public.comparison_results enable row level security;

create policy "users can manage own comparisons"
on public.comparisons
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can view own suppliers"
on public.suppliers
for all
using (
  exists (
    select 1 from public.comparisons
    where comparisons.id = suppliers.comparison_id
    and comparisons.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.comparisons
    where comparisons.id = suppliers.comparison_id
    and comparisons.user_id = auth.uid()
  )
);

create policy "users can view own line items"
on public.line_items
for all
using (
  exists (
    select 1
    from public.suppliers
    join public.comparisons on comparisons.id = suppliers.comparison_id
    where suppliers.id = line_items.supplier_id
    and comparisons.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.suppliers
    join public.comparisons on comparisons.id = suppliers.comparison_id
    where suppliers.id = line_items.supplier_id
    and comparisons.user_id = auth.uid()
  )
);

create policy "users can view own comparison results"
on public.comparison_results
for all
using (
  exists (
    select 1 from public.comparisons
    where comparisons.id = comparison_results.comparison_id
    and comparisons.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.comparisons
    where comparisons.id = comparison_results.comparison_id
    and comparisons.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('quote-pdfs', 'quote-pdfs', false)
on conflict (id) do nothing;

create policy "users can access own quote pdfs"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'quote-pdfs'
  and auth.uid()::text = split_part(name, '/', 1)
)
with check (
  bucket_id = 'quote-pdfs'
  and auth.uid()::text = split_part(name, '/', 1)
);
