export type Product = {
  id: string; // uuid is a string
  created_at: string; // timestamp is a string
  name: string;
  stock_ml: number;
  cost_price_per_ml: number;
  selling_price_per_ml: number;
  user_id?: string; // Optional user ID
};

export type TransactionWithDetails = {
  id: string;
  created_at: string;
  total_amount: number;
  user_id?: string;
  payment_method: string;
  transaction_items: Array<any>; // Using any to handle the complex nested structure from Supabase
};

export type Customer = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  name: string;
  address: string;
  total_purchases: number;
};
