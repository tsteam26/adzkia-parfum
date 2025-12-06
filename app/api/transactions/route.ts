import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch transactions for the authenticated user with related items
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(`
      *,
      transaction_items (
        *,
        products (
          name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(transactions);
}