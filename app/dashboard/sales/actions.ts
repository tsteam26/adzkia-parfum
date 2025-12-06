"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for transaction item
const transactionItemSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    stock_ml: z.number(),
    selling_price_per_ml: z.number(),
  }),
  volume_ml: z.number().min(1, "Volume harus lebih dari 0"),
  subtotal: z.number().min(0, "Subtotal tidak boleh negatif"),
});

export async function createTransaction(cartItems: any, total: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("CreateTransaction action called with cartItems:", cartItems);
  console.log("User authenticated:", !!user);

  if (!user) {
    console.log("Authentication error: User not authenticated");
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Validate cart items and check stock availability
    for (const item of cartItems) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, name, stock_ml, selling_price_per_ml")
        .eq("id", item.product.id)
        .eq("user_id", user.id)
        .single();

      if (productError) {
        console.error("Error fetching product:", productError);
        return { success: false, message: `Produk tidak ditemukan: ${item.product.id}` };
      }

      if (!product) {
        return { success: false, message: `Produk tidak ditemukan: ${item.product.id}` };
      }

      if (product.stock_ml < item.volume_ml) {
        return {
          success: false,
          message: `Stok tidak mencukupi untuk ${product.name}. Tersedia: ${product.stock_ml} ml, diminta: ${item.volume_ml} ml`
        };
      }

      // Verify subtotal calculation is correct
      const expectedSubtotal = product.selling_price_per_ml * item.volume_ml;
      if (Math.abs(item.subtotal - expectedSubtotal) > 0.01) { // Allow small rounding differences
        return {
          success: false,
          message: `Subtotal tidak valid untuk ${product.name}. Harus: ${expectedSubtotal}, Diberikan: ${item.subtotal}`
        };
      }
    }

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert([{
        user_id: user.id,
        total_amount: total,
        payment_method: "cash", // Default payment method
      }])
      .select()
      .single();

    if (transactionError) {
      console.error("Error creating transaction:", transactionError);
      return { success: false, message: transactionError.message };
    }

    // Create transaction items
    const transactionItemsToInsert = cartItems.map((item: any) => ({
      transaction_id: transaction.id,
      product_id: item.product.id,
      volume_ml: item.volume_ml,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabase
      .from("transaction_items")
      .insert(transactionItemsToInsert);

    if (itemsError) {
      console.error("Error creating transaction items:", itemsError);

      // If items fail to insert, delete the transaction we just created
      await supabase
        .from("transactions")
        .delete()
        .eq("id", transaction.id);

      return { success: false, message: itemsError.message };
    }

    console.log("Transaction created successfully:", transaction.id);

    revalidatePath("/dashboard/sales");
    revalidatePath("/dashboard/inventory");
    return { success: true, message: "Transaksi berhasil disimpan." };
  } catch (error) {
    console.error("Transaction error:", error);
    return { success: false, message: `Error: ${(error as Error).message}` };
  }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("DeleteTransaction action called with id:", id);
  console.log("User authenticated:", !!user);

  if (!user) {
    console.log("Delete transaction - Authentication error: User not authenticated");
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Check that the transaction belongs to the current user
    const { data: transaction, error: fetchError } = await supabase
      .from("transactions")
      .select("id, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      console.error("Error fetching transaction to delete:", fetchError);
      return { success: false, message: "Transaksi tidak ditemukan" };
    }

    if (!transaction) {
      return { success: false, message: "Transaksi tidak ditemukan" };
    }

    // Delete the transaction (this will also delete related transaction_items due to the foreign key constraint with CASCADE)
    const { error: deleteError } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting transaction:", deleteError);
      return { success: false, message: deleteError.message };
    }

    console.log("Transaction deleted successfully:", id);

    revalidatePath("/dashboard/sales");
    return { success: true, message: "Transaksi berhasil dihapus." };
  } catch (error) {
    console.error("Delete transaction error:", error);
    return { success: false, message: `Error: ${(error as Error).message}` };
  }
}