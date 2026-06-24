"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import api from "@/lib/axios";
import type { Product, ProductImage as ProductImageType, Review } from "@/types";
import { useWishlistStore } from "@/stores/wishlist-store";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingCart,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  // Handle Next.js 15+ promise params while remaining backwards compatible
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const slug = resolvedParams.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const { wishlists, addToWishlist, removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get<{ product: Product }>(
          `/products/${slug}`
        );
        setProduct(response.data.product);

        const reviewsRes = await api.get<Review[]>(`/products/${slug}/reviews`);
        setReviews(reviewsRes.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to load product details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (!isAuthenticated || user?.role !== "buyer") {
      toast.error("Please sign in as a buyer to use wishlists.");
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product.id);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || user?.role !== "buyer") {
      toast.error("Please sign in as a buyer to leave a review.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await api.post(`/products/${slug}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews([res.data.review, ...reviews.filter(r => r.id !== res.data.review.id)]);
      setReviewComment("");
      toast.success("Review submitted!");
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
          Oops!
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
          {error || "Something went wrong"}
        </p>
        <Link href="/">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const isBuyer = isAuthenticated && user?.role === "buyer";
  const inStock = product.stock > 0;
  const isInWishlist = wishlists.some((w) => w.product_id === product.id);

  const originalPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const discountedPrice = product.discount ? originalPrice * (1 - product.discount / 100) : originalPrice;

  // Build images array: use product.images if available, fallback to image_url
  const allImages: { id: number; url: string; is_primary: boolean }[] = [];
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      allImages.push({
        id: img.id,
        url: img.image_url,
        is_primary: img.is_primary,
      });
    });
  } else if (product.image_url) {
    allImages.push({ id: 0, url: product.image_url, is_primary: true });
  }

  const currentImage =
    allImages.length > 0
      ? allImages[currentImageIndex]?.url
      : "https://via.placeholder.com/600";

  const goToPrevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6 sm:mb-8 group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="flex flex-col gap-3">
          {/* Main Image */}
          <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-500 ${!inStock ? "grayscale opacity-80" : ""}`}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <span className="text-xl sm:text-2xl font-bold text-white bg-red-500/90 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl uppercase tracking-widest shadow-xl transform -rotate-12">
                  Sold Out
                </span>
              </div>
            )}

            {/* Image Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-white transition-all hover:scale-110 active:scale-95 shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-white transition-all hover:scale-110 active:scale-95 shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-3 right-3 z-10 bg-black/50 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${index === currentImageIndex
                    ? "border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 opacity-70 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col py-2 sm:py-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-500/10 px-3 py-1 text-sm font-medium text-red-700 dark:text-red-500 border border-red-200 dark:border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                Out of Stock
              </span>
            )}

            {product.user && (
              <span className="inline-flex rounded-full bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {product.user.name}
              </span>
            )}

            {product.category && (
              <Link href={`/products?category=${product.category.slug}`}>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors cursor-pointer">
                  {product.category.icon && (
                    <span>{product.category.icon}</span>
                  )}
                  {product.category.name}
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {product.name}
            </h1>
            {(product.reviews_count ?? 0) > 0 && (
              <div className="flex flex-col items-start gap-0.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 shrink-0 mt-1 sm:mt-0">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                  <span className="text-zinc-900 dark:text-zinc-100 text-base sm:text-lg">{Number(product.reviews_avg_rating || 0).toFixed(1)}</span>
                </div>
                <span className="text-xs sm:text-sm text-zinc-500">({product.reviews_count} reviews)</span>
              </div>
            )}
          </div>

          {product.discount > 0 ? (
            <div className="mb-6 sm:mb-8 flex items-center flex-wrap gap-3">
              <span className="text-xl sm:text-2xl text-zinc-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="bg-rose-500 text-white text-sm font-bold px-2 py-1 rounded-md">
                -{product.discount}%
              </span>
            </div>
          ) : (
            <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-6 sm:mb-8">
              ${originalPrice.toFixed(2)}
            </p>
          )}

          <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 mb-8 sm:mb-10">
            <p className="text-base sm:text-lg leading-relaxed">
              {product.description ||
                "No description provided for this product."}
            </p>
          </div>

          {/* Add to Cart Section */}
          <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-6 sm:pt-8">
            {isBuyer ? (
              <div className="flex flex-row gap-3 sm:gap-4 items-end w-full">
                <div className="flex flex-col gap-2 shrink-0">
                  <label
                    htmlFor="quantity"
                    className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    Quantity
                  </label>
                  <div
                    className={`flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-12 sm:h-14 ${!inStock ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <button
                      onClick={() =>
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      disabled={quantity <= 1 || !inStock}
                      className="px-4 h-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(
                              product.stock,
                              parseInt(e.target.value) || 1
                            )
                          )
                        )
                      }
                      disabled={!inStock}
                      className="w-14 sm:w-16 h-full text-center font-medium text-zinc-900 dark:text-white bg-transparent border-none focus:ring-0"
                    />
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(product.stock, quantity + 1)
                        )
                      }
                      disabled={quantity >= product.stock || !inStock}
                      className="px-4 h-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 h-12 sm:h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:opacity-50 shadow-lg px-2 sm:px-4"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  <span className="truncate">Add to Cart</span>
                </Button>

                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                >
                  <Heart className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${isInWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
                </Button>
              </div>
            ) : isAuthenticated ? (
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 text-amber-700 dark:text-amber-400 text-center text-sm font-medium">
                You are logged in as a {user?.role}. Only buyers can purchase
                products.
              </div>
            ) : (
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 text-center">
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">
                  Want to buy this product?
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 sm:mt-24 border-t border-zinc-200 dark:border-zinc-800 pt-10 sm:pt-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-8">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Write a Review */}
          <div className="md:col-span-1">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                Write a Review
              </h3>
              {isBuyer ? (
                <form onSubmit={submitReview} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                      Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-6 w-6 ${star <= reviewRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-zinc-300 dark:text-zinc-700"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                      Comment (Optional)
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                      placeholder="Share your thoughts about this product..."
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
                  >
                    Submit Review
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    You must be logged in as a buyer to write a review.
                  </p>
                  <Link href="/login">
                    <Button variant="outline" className="w-full rounded-xl">
                      Log In to Review
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-zinc-200 dark:border-zinc-800 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-zinc-900 dark:text-white">
                        {review.user?.name || "Anonymous"}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-zinc-200 dark:text-zinc-800"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                    <div className="text-xs text-zinc-400 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-zinc-50 dark:bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <Star className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-3" />
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">
                  No reviews yet
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
                  Be the first to share your thoughts on this product!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
