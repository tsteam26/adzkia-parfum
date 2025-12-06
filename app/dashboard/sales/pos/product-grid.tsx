"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { Product } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Package, Grid3x3, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari produk parfum..."
            className="pl-10 h-12 text-base rounded-xl border-2 focus:border-purple-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "gradient-primary text-white" : ""}
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "gradient-primary text-white" : ""}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto p-1 pr-2">
          {filteredProducts.map((product) => {
            const isLowStock = product.stock_ml < 500;

            return (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-300 dark:hover:border-purple-700 overflow-hidden relative"
                onClick={() => addItem(product)}
              >
                {/* Stock Badge */}
                {isLowStock && (
                  <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 z-10 text-xs">
                    Stok Rendah
                  </Badge>
                )}

                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="relative pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {product.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-3">
                  {/* Stock Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className={isLowStock ? "text-orange-600 dark:text-orange-400 font-medium" : "text-muted-foreground"}>
                      {product.stock_ml} ml
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-1">
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Rp {new Intl.NumberFormat("id-ID").format(product.selling_price_per_ml)}
                    </div>
                    <span className="text-xs text-muted-foreground">per ml</span>
                  </div>

                  {/* Add Button */}
                  <div className="pt-2">
                    <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">Tambah</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">Produk tidak ditemukan</p>
                  <p className="text-sm text-muted-foreground">
                    Coba kata kunci lain untuk mencari produk
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="max-h-[600px] overflow-y-auto">
          <div className="space-y-2">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock_ml < 500;

              return (
                <Card
                  key={product.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-300 dark:hover:border-purple-700"
                  onClick={() => addItem(product)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Product Icon */}
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Package className="h-6 w-6 text-white" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs md:text-sm ${isLowStock ? "text-orange-600 dark:text-orange-400 font-medium" : "text-muted-foreground"}`}>
                            Stok: {product.stock_ml} ml
                          </span>
                          {isLowStock && (
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">
                              Rendah
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Rp {new Intl.NumberFormat("id-ID").format(product.selling_price_per_ml)}
                        </div>
                        <span className="text-xs text-muted-foreground">per ml</span>
                      </div>

                      {/* Add Button */}
                      <Button
                        size="sm"
                        className="gradient-primary text-white shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem(product);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Tambah</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">Produk tidak ditemukan</p>
                    <p className="text-sm text-muted-foreground">
                      Coba kata kunci lain untuk mencari produk
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
