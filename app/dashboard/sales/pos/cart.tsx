"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Minus, Plus, ShoppingBag, Edit, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CartProps {
  onCheckout: () => void;
  isPending: boolean;
}

export function Cart({ onCheckout, isPending }: CartProps) {
  const { items, removeItem, updateItemVolume, clearCart } = useCartStore();

  // State for manual total editing
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [manualTotal, setManualTotal] = useState<number | null>(null);

  const calculatedTotal = items.reduce((total, item) => total + item.subtotal, 0);
  const totalAmount = manualTotal !== null ? manualTotal : calculatedTotal;

  // Reset manual total when items change and not in edit mode
  const handleToggleEditTotal = () => {
    if (isEditingTotal) {
      // Saving the manual total
      setIsEditingTotal(false);
    } else {
      // Start editing - set current total as initial value
      setManualTotal(calculatedTotal);
      setIsEditingTotal(true);
    }
  };

  const handleManualTotalChange = (value: string) => {
    const numValue = parseInt(value.replace(/\D/g, '')) || 0;
    setManualTotal(numValue);
  };

  const handleResetToCalculated = () => {
    setManualTotal(null);
    setIsEditingTotal(false);
  };

  const incrementVolume = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      updateItemVolume(productId, item.volume_ml + 1);
    }
  };

  const decrementVolume = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    if (item && item.volume_ml > 1) { // minimum 1ml per item
      updateItemVolume(productId, item.volume_ml - 1);
    }
  };

  return (
    <Card className="h-full flex flex-col border-2 shadow-lg">
      {/* Header */}
      <CardHeader className="pb-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Keranjang</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              Bersihkan
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Cart Items */}
      <CardContent className="flex-1 overflow-y-auto max-h-[300px] md:max-h-[500px] p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 md:py-12">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-center text-muted-foreground font-medium">Keranjang kosong</p>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Pilih produk untuk memulai transaksi
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="group p-3 rounded-xl border-2 bg-card hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200"
              >
                {/* Product Info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-semibold text-sm line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rp {new Intl.NumberFormat("id-ID").format(item.product.selling_price_per_ml)} / ml
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex items-center justify-between gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border-2 rounded-lg bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-r-none hover:bg-purple-50 dark:hover:bg-purple-950/30"
                      onClick={() => decrementVolume(item.product.id)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <Input
                      type="number"
                      className="h-8 w-16 text-center border-0 focus-visible:ring-0 text-sm font-medium"
                      value={item.volume_ml}
                      onChange={(e) =>
                        updateItemVolume(item.product.id, parseInt(e.target.value) || 0)
                      }
                      min="1"
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-l-none hover:bg-purple-50 dark:hover:bg-purple-950/30"
                      onClick={() => incrementVolume(item.product.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <span className="text-xs text-muted-foreground">ml</span>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Rp {new Intl.NumberFormat("id-ID").format(item.subtotal)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Footer with Total & Checkout */}
      {items.length > 0 && (
        <CardFooter className="flex flex-col gap-4 py-4 border-t bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          {/* Total */}
          <div className="w-full p-4 rounded-xl bg-white dark:bg-card border-2 border-purple-200 dark:border-purple-800">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                  {manualTotal !== null && !isEditingTotal && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                      Manual
                    </span>
                  )}
                </div>

                {isEditingTotal ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-muted-foreground">Rp</span>
                    <Input
                      type="text"
                      className="text-2xl font-bold h-auto py-1 px-2 border-2 border-purple-300 focus-visible:ring-purple-500"
                      value={new Intl.NumberFormat("id-ID").format(manualTotal || 0)}
                      onChange={(e) => handleManualTotalChange(e.target.value)}
                      autoFocus
                    />
                  </div>
                ) : (
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Rp {new Intl.NumberFormat("id-ID").format(totalAmount)}
                  </p>
                )}

                {/* Show calculated total if manual is active */}
                {manualTotal !== null && !isEditingTotal && manualTotal !== calculatedTotal && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Otomatis: Rp {new Intl.NumberFormat("id-ID").format(calculatedTotal)}
                  </p>
                )}
              </div>

              {/* Edit/Save Button */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                  onClick={handleToggleEditTotal}
                  title={isEditingTotal ? "Simpan" : "Edit Total"}
                >
                  {isEditingTotal ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Edit className="h-4 w-4" />
                  )}
                </Button>

                {/* Reset Button - only show when manual total is set */}
                {manualTotal !== null && !isEditingTotal && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={handleResetToCalculated}
                    title="Reset ke Otomatis"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            className="w-full h-12 text-base font-semibold gradient-primary hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-200"
            onClick={onCheckout}
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </div>
            ) : (
              "Proses Pembayaran"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

