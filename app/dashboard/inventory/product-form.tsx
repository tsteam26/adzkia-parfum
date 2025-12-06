"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/types";

// Define the form schema with coercion - should match the action schema
const formSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter."),
  stock_ml: z.coerce.number().min(0, "Stok tidak boleh negatif."),
  cost_price_per_ml: z.coerce.number().min(0, "Harga modal tidak boleh negatif."),
  selling_price_per_ml: z.coerce.number().min(0, "Harga jual tidak boleh negatif."),
});

export type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  isPending,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? "",
      stock_ml: product?.stock_ml ?? 0,
      cost_price_per_ml: product?.cost_price_per_ml ?? 0,
      selling_price_per_ml: product?.selling_price_per_ml ?? 0,
    },
  });

  const onSubmitHandler = (data: ProductFormValues) => {
    // Parse data with the schema to apply coercion
    const parsedData = formSchema.parse(data);
    onSubmit(parsedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Produk</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Baccarat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock_ml"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Stok Awal (ml)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="cost_price_per_ml"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Harga Modal per ml</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="selling_price_per_ml"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Harga Jual per ml</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
    </Form>
  );
}