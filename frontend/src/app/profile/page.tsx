"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { ProductCard } from "@/components/product-card";
import { useRouter } from "next/navigation";
import { Heart, Package, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { wishlists, fetchWishlists, isLoading } = useWishlistStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"wishlist" | "orders">("wishlist");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchWishlists();
  }, [isAuthenticated, router, fetchWishlists]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="container mx-auto px-4 py-12 sm:py-20 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-center text-zinc-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-6">
              {user.email}
            </p>

            <div className="flex flex-col gap-2">
              <Button
                variant={activeTab === "wishlist" ? "default" : "ghost"}
                onClick={() => setActiveTab("wishlist")}
                className={`justify-start w-full rounded-xl ${
                  activeTab === "wishlist"
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Heart className="mr-3 h-5 w-5" />
                My Wishlist
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                onClick={() => setActiveTab("orders")}
                className={`justify-start w-full rounded-xl ${
                  activeTab === "orders"
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Package className="mr-3 h-5 w-5" />
                My Orders
              </Button>
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="justify-start w-full rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === "wishlist" && (
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-8 tracking-tight">
                My Wishlist
              </h1>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : wishlists.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {wishlists.map((item) => (
                    item.product && <ProductCard key={item.id} product={item.product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  <Heart className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Save items you love to view them later.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-8 tracking-tight">
                My Orders
              </h1>
              <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <Package className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  No orders yet
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  You haven't placed any orders.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
