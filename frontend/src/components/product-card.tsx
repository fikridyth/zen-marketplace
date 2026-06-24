"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  const originalPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const discountedPrice = product.discount ? originalPrice * (1 - product.discount / 100) : originalPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Guest flow: Redirect to login
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to your cart");
      router.push(`/login?callbackUrl=${encodeURIComponent("/")}`);
      return;
    }

    // Role check: Only buyers can add to cart
    if (user?.role !== "buyer") {
      toast.error("Only buyers can purchase products");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
    } catch (error: any) {
      // Error is handled in the store
    } finally {
      setIsAdding(false);
    }
  };

  // Use primary image from images array, fallback to image_url
  const displayImage = (() => {
    if (product.images && product.images.length > 0) {
      const primary = product.images.find((img) => img.is_primary);
      return primary ? primary.image_url : product.images[0].image_url;
    }
    return product.image_url;
  })();

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="relative flex flex-col h-full overflow-hidden rounded-xl sm:rounded-2xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
          {displayImage ? (
            <>
              <Image
                src={displayImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 dark:from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-700">
              <span className="text-4xl sm:text-5xl">📦</span>
            </div>
          )}

          {/* Stock Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2 z-10 items-start">
            {product.discount > 0 && (
              <Badge className="bg-rose-500 text-white hover:bg-rose-600 shadow-lg border-none px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold tracking-wide rounded-full backdrop-blur-md">
                -{product.discount}% OFF
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge className="bg-amber-500/90 text-white hover:bg-amber-500 shadow-lg border-none px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold tracking-wide rounded-full backdrop-blur-md w-fit">
                Only {product.stock} left
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge
                variant="secondary"
                className="bg-zinc-200/90 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold tracking-wide rounded-full backdrop-blur-md w-fit"
              >
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Category badge */}
          {product.category && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 max-w-[45%]">
              <Badge className="bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 text-[10px] font-medium rounded-full backdrop-blur-md flex items-center">
                {product.category.icon && (
                  <span className="mr-1 shrink-0">{product.category.icon}</span>
                )}
                <span className="truncate">{product.category.name}</span>
              </Badge>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow p-3 sm:p-5">
          <div className="mb-1 sm:mb-2">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              {product.user && (
                <p className="text-[10px] sm:text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider truncate mr-2">
                  {product.user.name}
                </p>
              )}
              {(product.reviews_count ?? 0) > 0 && (
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
                  <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" />
                  <span>{Number(product.reviews_avg_rating || 0).toFixed(1)}</span>
                  <span>({product.reviews_count})</span>
                </div>
              )}
            </div>
            <h3 className="font-bold text-sm sm:text-xl text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-zinc-200 dark:border-zinc-800/50">
            <div className="flex flex-col">
              {product.discount > 0 && (
                <span className="text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              <div className="font-extrabold text-base sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 leading-none">
                {formatPrice(discountedPrice)}
              </div>
            </div>

            {(!user || user.role === "buyer") && (
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                size="icon"
                className="rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-300 disabled:opacity-50 hover:scale-110 active:scale-95 shadow-lg"
              >
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="sr-only">Add to Cart</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
