import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch products for the authenticated user
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching products:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(products);
}