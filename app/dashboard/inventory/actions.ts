"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter."),
  stock_ml: z.number().min(0, "Stok tidak boleh negatif."),
  cost_price_per_ml: z.number().min(0, "Harga modal tidak boleh negatif."),
  selling_price_per_ml: z.number().min(0, "Harga jual tidak boleh negatif."),
});

export async function addProduct(values: z.infer<typeof formSchema>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("AddProduct action called with values:", values);
  console.log("User authenticated:", !!user);

  if (!user) {
    console.log("Authentication error: User not authenticated");
    return { success: false, message: "User not authenticated" };
  }

  try {
    const validatedValues = formSchema.parse(values);
    console.log("Validated values:", validatedValues);

    const insertValues = {
      name: validatedValues.name,
      stock_ml: validatedValues.stock_ml,
      cost_price_per_ml: validatedValues.cost_price_per_ml,
      selling_price_per_ml: validatedValues.selling_price_per_ml,
      user_id: user.id
    };

    console.log("Attempting to insert:", insertValues);

    const { error } = await supabase.from("products").insert(insertValues);

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, message: error.message };
    }

    console.log("Product inserted successfully");

    revalidatePath("/dashboard/inventory");
    return { success: true, message: "Produk berhasil ditambahkan." };
  } catch (validationError) {
    console.error("Validation error:", validationError);
    return { success: false, message: `Validation error: ${(validationError as Error).message}` };
  }
}

export async function updateProduct(
  id: string,
  values: z.infer<typeof formSchema>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("UpdateProduct action called with id:", id, "and values:", values);
  console.log("User authenticated:", !!user);

  if (!user) {
    console.log("Update - Authentication error: User not authenticated");
    return { success: false, message: "User not authenticated" };
  }

  try {
    const validatedValues = formSchema.parse(values);
    console.log("Update - Validated values:", validatedValues);

    const updateValues = {
      name: validatedValues.name,
      stock_ml: validatedValues.stock_ml,
      cost_price_per_ml: validatedValues.cost_price_per_ml,
      selling_price_per_ml: validatedValues.selling_price_per_ml
    };

    console.log("Update - Attempting to update with:", updateValues);

    const { error } = await supabase.from("products").update(updateValues).eq("id", id).eq("user_id", user.id);

    if (error) {
      console.error("Supabase update error:", error);
      return { success: false, message: error.message };
    }

    console.log("Product updated successfully");

    revalidatePath("/dashboard/inventory");
    return { success: true, message: "Produk berhasil diperbarui." };
  } catch (validationError) {
    console.error("Update validation error:", validationError);
    return { success: false, message: `Validation error: ${(validationError as Error).message}` };
  }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("DeleteProduct action called with id:", id);
  console.log("User authenticated:", !!user);

  if (!user) {
    console.log("Delete - Authentication error: User not authenticated");
    return { success: false, message: "User not authenticated" };
  }

  console.log("Delete - Attempting to delete product with id:", id);

  const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    console.error("Supabase delete error:", error);
    return { success: false, message: error.message };
  }

  console.log("Product deleted successfully");

  revalidatePath("/dashboard/inventory");
  return { success: true, message: "Produk berhasil dihapus." };
}

