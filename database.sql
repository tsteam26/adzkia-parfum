-- Create Profiles Table (for user management)
create table profiles (
  id uuid references auth.users primary key,
  store_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Products Table
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  stock_ml numeric default 0,
  cost_price_per_ml numeric default 0,
  selling_price_per_ml numeric default 0,
  user_id uuid references profiles(id)
);

-- Create Transactions Table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references profiles(id),
  total_amount numeric default 0,
  payment_method text default 'cash'
);

-- Create Transaction Items Table
create table transaction_items (
  id uuid default gen_random_uuid() primary key,
  transaction_id uuid references transactions(id) on delete cascade,
  product_id uuid references products(id),
  volume_ml numeric not null,
  subtotal numeric not null
);

-- (Optional) Trigger Function to deduct stock automatically when a transaction is created
create or replace function deduct_stock()
returns trigger as $$
begin
  update products
  set stock_ml = stock_ml - new.volume_ml
  where id = new.product_id;
  return new;
end;
$$ language plpgsql;

create trigger tr_deduct_stock
after insert on transaction_items
for each row execute function deduct_stock();

-- RLS (Row Level Security) setup
alter table profiles enable row level security;
alter table products enable row level security;
alter table transactions enable row level security;
alter table transaction_items enable row level security;

create policy "Users can view their own profiles"
  on profiles for select
  using (id = auth.uid());

create policy "Users can view their own products"
  on products for select
  using (user_id = auth.uid());

create policy "Users can insert their own products"
  on products for insert
  with check (user_id = auth.uid());

create policy "Users can update their own products"
  on products for update
  using (user_id = auth.uid());

create policy "Users can delete their own products"
  on products for delete
  using (user_id = auth.uid());

create policy "Users can view their own transactions"
  on transactions for select
  using (user_id = auth.uid());

create policy "Users can insert their own transactions"
  on transactions for insert
  with check (user_id = auth.uid());

create policy "Users can view their own transaction items"
  on transaction_items for select
  using (exists (
    select 1 from transactions
    where transactions.id = transaction_items.transaction_id
    and transactions.user_id = auth.uid()
  ));

-- RLS policy for profiles: Allow service role to insert profiles
create policy "Service Role Insert Profiles"
  on profiles for insert
  with check (auth.role() = 'service_role');

-- Additional RLS policies for transaction_items
create policy "Users can insert their own transaction items"
  on transaction_items for insert
  with check (exists (
    select 1 from transactions
    where transactions.id = transaction_items.transaction_id
    and transactions.user_id = auth.uid()
  ));

create policy "Users can update their own transaction items"
  on transaction_items for update
  using (exists (
    select 1 from transactions
    where transactions.id = transaction_items.transaction_id
    and transactions.user_id = auth.uid()
  ));

create policy "Users can delete their own transaction items"
  on transaction_items for delete
  using (exists (
    select 1 from transactions
    where transactions.id = transaction_items.transaction_id
    and transactions.user_id = auth.uid()
  ));

-- Create a trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, store_name)
  values (new.id, 'New Store');
  return new;
end;
$$;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
