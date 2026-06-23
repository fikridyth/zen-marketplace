"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import api from "@/lib/axios";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  const handleAddToCart = async () => {
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
      await api.post("/cart", { product_id: product.id, quantity: 1 });
      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="group overflow-hidden border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-600">
            <span className="text-4xl">📦</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="destructive" className="bg-red-500/90 text-white">
              Only {product.stock} left
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="secondary" className="bg-zinc-900/90 text-zinc-300 backdrop-blur">
              Out of stock
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold text-lg text-zinc-100 line-clamp-1" title={product.name}>
              {product.name}
            </h3>
            {product.user && (
              <p className="text-sm text-zinc-400 mt-1">
                by <span className="text-indigo-400">{product.user.name}</span>
              </p>
            )}
          </div>
          <div className="font-bold text-lg text-white whitespace-nowrap">
            {formatPrice(product.price)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-zinc-400 text-sm line-clamp-2">
          {product.description || "No description available."}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        {(!user || user.role === "buyer") && (
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-indigo-500 hover:text-white transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
          >
            {isAdding ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
