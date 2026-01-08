-- SQL untuk menambahkan tabel customers
-- Jalankan query ini di Supabase SQL Editor

-- Create Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  address text,
  total_purchases numeric DEFAULT 0
);

-- Enable RLS for customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- RLS policies for customers
CREATE POLICY "Users can view their own customers"
  ON customers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own customers"
  ON customers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own customers"
  ON customers FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own customers"
  ON customers FOR DELETE
  USING (user_id = auth.uid());
