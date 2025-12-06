import { createClient } from "./server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const { data: todaySalesData, error: todaySalesError } = await supabase
    .from("transactions")
    .select("total_amount")
    .eq("user_id", user.id)
    .gte("created_at", `${today}T00:00:00.000Z`)
    .lte("created_at", `${today}T23:59:59.999Z`);

  if (todaySalesError) throw todaySalesError;

  const totalSalesToday = todaySalesData.reduce((sum, current) => sum + current.total_amount, 0);
  const totalTransactionsToday = todaySalesData.length;

  const { count: lowStockCount, error: lowStockError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lt("stock_ml", 50); // Assuming low stock is less than 50ml

  if (lowStockError) throw lowStockError;

  return {
    totalSalesToday,
    totalTransactionsToday,
    lowStockCount,
  };
}

export async function getSalesTrend() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("transactions")
    .select("created_at, total_amount")
    .eq("user_id", user.id)
    .gte("created_at", sevenDaysAgo.toISOString());

  if (error) throw error;

  const salesByDay = data.reduce((acc, curr) => {
    const date = new Date(curr.created_at).toLocaleDateString("en-CA"); // YYYY-MM-DD
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += curr.total_amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedDays = Object.keys(salesByDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return sortedDays.map(date => ({
    name: new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
    total: salesByDay[date],
  }));
}

export async function getTransactions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id,
      created_at,
      total_amount,
      user_id,
      payment_method,
      transaction_items (
        volume_ml,
        subtotal,
        products (
          name,
          cost_price_per_ml
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getProducts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) throw error;

  return data;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Profile does not exist, create one
      return await createUserProfile(user.id);
    }
    throw error;
  }

  return data;
}

export async function createUserProfile(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .insert({ id: userId, store_name: "Toko Saya" })
    .select()
    .single();

  if (error) throw error;

  return data;
}


export async function getTopSellingProducts(days: number = 30, limit: number = 5) {
  console.log(`getTopSellingProducts called with days=${days}, limit=${limit}`);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Calculate date range
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // 1. Get all products first to ensure we include products with 0 sales
  const { data: allProducts, error: productsError } = await supabase
    .from("products")
    .select("id, name, selling_price_per_ml, stock_ml")
    .eq("user_id", user.id);

  if (productsError) throw productsError;

  console.log(`Found ${allProducts.length} products for user ${user.id}`);

  // Initialize stats for all products
  const productStats: Record<string, any> = {};
  allProducts.forEach((product) => {
    productStats[product.id] = {
      id: product.id,
      name: product.name,
      selling_price_per_ml: product.selling_price_per_ml,
      stock_ml: product.stock_ml,
      total_volume_sold: 0,
      total_revenue: 0,
      transaction_count: 0,
    };
  });

  // 2. Get transaction items within date range
  const { data: transactionItems, error } = await supabase
    .from("transaction_items")
    .select(`
      volume_ml,
      subtotal,
      product_id,
      transactions!inner (
        created_at,
        user_id
      )
    `)
    .gte("transactions.created_at", startDate.toISOString())
    .eq("transactions.user_id", user.id);

  if (error) throw error;

  // 3. Aggregate data
  transactionItems.forEach((item) => {
    const productId = item.product_id;
    // Only count if product exists in our list (i.e., not deleted)
    if (productStats[productId]) {
      productStats[productId].total_volume_sold += item.volume_ml;
      productStats[productId].total_revenue += item.subtotal;
      productStats[productId].transaction_count += 1;
    }
  });

  // Convert to array
  const productsArray = Object.values(productStats);

  // Sort by volume
  const sortedByVolume = [...productsArray].sort(
    (a, b) => b.total_volume_sold - a.total_volume_sold
  );

  // Sort by revenue
  const sortedByRevenue = [...productsArray].sort(
    (a, b) => b.total_revenue - a.total_revenue
  );

  // Apply limit if specified
  const topByVolume = limit > 0 ? sortedByVolume.slice(0, limit) : sortedByVolume;
  const topByRevenue = limit > 0 ? sortedByRevenue.slice(0, limit) : sortedByRevenue;

  return {
    topByVolume,
    topByRevenue,
  };
}
