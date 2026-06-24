"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import type { PaginatedResponse, Product, Category } from "@/types";
import { Package, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchQuery = searchParams.get("search") || "";
  const activeCategory = searchParams.get("category") || "";

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (activeCategory) params.set("category", activeCategory);

      const res = await fetch(
        `${apiUrl}/products${params.toString() ? `?${params.toString()}` : ""}`,
        { cache: "no-store" }
      );

      if (res.ok) {
        const data: PaginatedResponse<Product> = await res.json();
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, searchQuery, activeCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/categories`, { cache: "no-store" });
      if (res.ok) {
        const data: Category[] = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="w-[90%] mx-auto py-8 sm:py-12 flex flex-col flex-grow">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4">
          <Package className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 dark:text-indigo-500" />
          All Products
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl font-medium">
          Browse our complete collection of premium items from independent
          sellers.
        </p>
      </div>

      {/* Search Results Label */}
      {searchQuery && (
        <div className="mb-4 sm:mb-6 flex items-center gap-3 p-3 sm:p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl">
          <Search className="h-4 w-4 text-indigo-500 shrink-0" />
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            Showing results for &quot;{searchQuery}&quot;
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="ml-auto h-7 w-7 rounded-full text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Category Tabs */}
      {categories.length > 0 && (
        <div className="mb-6 sm:mb-8 -mx-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
            <button
              onClick={() => setCategory("")}
              className={`shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                !activeCategory
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center gap-1.5 ${
                  activeCategory === cat.slug
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                <span className="text-sm">{cat.icon || "📦"}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 sm:py-32 bg-zinc-100 dark:bg-zinc-900/30 rounded-3xl border border-zinc-300 dark:border-zinc-800 border-dashed backdrop-blur-sm">
          <span className="text-5xl sm:text-6xl mb-6 block">🏜️</span>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search term.`
              : "Our sellers are preparing some amazing items for you."}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 flex-grow">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent"></div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
