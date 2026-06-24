"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, AlertTriangle } from "lucide-react";

export default function CartPage() {
  const { items, totalPrice, isLoading, fetchCart, updateQuantity, removeItem } = useCartStore();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "buyer")) {
      router.push("/");
    } else if (isAuthenticated && user?.role === "buyer") {
      fetchCart();
    }
  }, [isAuthenticated, user, authLoading, router, fetchCart]);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const hasOutOfStockItems = items.some(item => item.product.stock === 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8 flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-indigo-600 dark:text-indigo-500" />
        Your Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="h-24 w-24 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Your cart is empty</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md text-center">
            Looks like you haven't added anything to your cart yet. Browse our products and find something you love.
          </p>
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {hasOutOfStockItems && (
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Some items in your cart are currently out of stock. Please remove them to proceed with checkout.
                </p>
              </div>
            )}
            
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 sm:gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl group transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md dark:hover:shadow-none">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  <Image
                    src={item.product.image_url || "https://via.placeholder.com/300"}
                    alt={item.product.name}
                    fill
                    className={`object-cover ${item.product.stock === 0 ? "grayscale opacity-60" : ""}`}
                    sizes="(max-width: 640px) 96px, 112px"
                  />
                  {item.product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <span className="text-[10px] sm:text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-md uppercase tracking-wider">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div className="flex justify-between items-start">
                    <div className="pr-2">
                      <Link href={`/products/${item.product.slug}`} className={`text-base sm:text-lg font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 ${item.product.stock === 0 ? "text-zinc-500 dark:text-zinc-500" : "text-zinc-900 dark:text-white"}`}>
                        {item.product.name}
                      </Link>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">${Number(item.product.price).toFixed(2)}</p>
                    </div>
                    <p className={`font-semibold text-lg ${item.product.stock === 0 ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-900 dark:text-white"}`}>
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className={`flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden ${item.product.stock === 0 ? "opacity-50 pointer-events-none" : ""}`}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 sm:p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <span className="w-8 sm:w-10 text-center text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-2 sm:p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-500 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 text-sm font-medium transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sticky top-24 shadow-sm dark:shadow-none">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                  <span>Subtotal</span>
                  <span>${Number(totalPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">Total</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                      ${Number(totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                disabled={hasOutOfStockItems || items.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 group transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                {hasOutOfStockItems ? "Remove Out of Stock Items" : "Proceed to Checkout"}
                {!hasOutOfStockItems && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
              
              <p className="text-xs text-center text-zinc-500 mt-4">
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
