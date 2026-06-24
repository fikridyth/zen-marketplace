"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ProductCard } from "@/components/product-card";
import type { PaginatedResponse, Product, HeroBanner, Category } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, ChevronLeft, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const flashSaleRef = useRef<HTMLDivElement | null>(null);
  const arrivalsRef = useRef<HTMLDivElement | null>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right", isLatestArrival: boolean = false) => {
    if (ref.current) {
      if (isLatestArrival) {
        const child = ref.current.firstElementChild as HTMLElement;
        if (child) {
          const gap = parseInt(window.getComputedStyle(ref.current).gap) || 24;
          const scrollAmount = (child.offsetWidth + gap) * 4;
          ref.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
        }
      } else {
        const scrollAmount = ref.current.clientWidth;
        ref.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Flash Sale auto-scroll
  useEffect(() => {
    const el = flashSaleRef.current;
    if (!el || flashSaleProducts.length === 0) return;

    let scrollInterval = setInterval(() => {
      if (!el.firstElementChild) return;
      const child = el.firstElementChild as HTMLElement;
      const gap = parseInt(window.getComputedStyle(el).gap) || 24;
      const scrollStep = child.offsetWidth + gap;

      el.scrollBy({ left: scrollStep, behavior: "smooth" });

      if (el.scrollLeft >= (scrollStep * flashSaleProducts.length)) {
        setTimeout(() => {
          el.scrollTo({ left: el.scrollLeft - (scrollStep * flashSaleProducts.length), behavior: "auto" });
        }, 500);
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, [flashSaleProducts]);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, flashSaleRes, bannersRes, categoriesRes] = await Promise.all([
          fetch(`${apiUrl}/products`, { cache: "no-store" }),
          fetch(`${apiUrl}/products?flash_sale=true`, { cache: "no-store" }),
          fetch(`${apiUrl}/hero-banners`, { cache: "no-store" }),
          fetch(`${apiUrl}/categories`, { cache: "no-store" }),
        ]);

        if (productsRes.ok) {
          const data: PaginatedResponse<Product> = await productsRes.json();
          setProducts(data.data);
        }
        if (flashSaleRes.ok) {
          const data = await flashSaleRes.json();
          setFlashSaleProducts(data.data);
        }
        if (bannersRes.ok) {
          const data: HeroBanner[] = await bannersRes.json();
          setBanners(data);
        }
        if (categoriesRes.ok) {
          const data: Category[] = await categoriesRes.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  // Auto-slide hero banner every 5 seconds
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
  }, [banners.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startTimer(); // reset timer on manual nav
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % banners.length);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  const latestArrivals = products.slice(0, 12);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow">
      {/* Hero Banner Slider */}
      {banners.length > 0 ? (
        <section className="relative w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <div className="relative aspect-[16/9] sm:aspect-[16/7] md:aspect-[21/9] w-full">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
                  }`}
              >
                {banner.link ? (
                  <Link href={banner.link} className="relative block w-full h-full">
                    <Image
                      src={banner.image_url}
                      alt={banner.title || `Banner ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="100vw"
                    />
                  </Link>
                ) : (
                  <Image
                    src={banner.image_url}
                    alt={banner.title || `Banner ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                  />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Banner title */}
                {banner.title && (
                  <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-0 right-0 text-center pointer-events-none">
                    <h2 className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-2xl px-4">
                      {banner.title}
                    </h2>
                  </div>
                )}
              </div>
            ))}

            {/* Navigation Arrows */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {banners.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`rounded-full transition-all duration-300 ${index === currentSlide
                      ? "w-7 h-2.5 bg-white"
                      : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Fallback static hero if no banners */
        <section className="relative overflow-hidden py-16 md:py-20 bg-zinc-100 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800/80 shadow-md">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
            <div
              className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[100px] animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-[90%]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                New arrivals every week
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white mb-6 leading-tight">
              Curated Goods for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                Modern Life
              </span>
            </h1>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              A premium e-commerce experience. Browse exclusive, high-quality
              items from independent sellers around the globe.
            </p>
          </div>
        </section>
      )}

      {/* Main Content Wrapper */}
      <div className="w-[90%] mx-auto py-12 sm:py-16 flex flex-col gap-16 sm:gap-20">
        {/* Categories Quick Links */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Shop by Category
              </h2>
              <Link href="/products">
                <Button
                  variant="outline"
                  className="rounded-full px-5 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm"
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group"
                >
                  <div className="flex flex-col items-center gap-3 p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
                    <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">
                      {cat.icon || "📦"}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate w-full">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Flash Sale Section */}
        {flashSaleProducts.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-rose-500/10 p-2.5 sm:p-3 rounded-2xl border border-rose-500/20">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500 fill-rose-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Flash Sale
                </h2>
              </div>
              <Link href="/products">
                <Button
                  variant="outline"
                  className="rounded-full px-5 sm:px-6 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm"
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative group/carousel">
              <div 
                ref={flashSaleRef}
                className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
              >
                {[...flashSaleProducts, ...flashSaleProducts].map((product, index) => (
                  <div key={`${product.id}-${index}`} className="min-w-[75vw] sm:min-w-[45vw] md:min-w-[30vw] lg:min-w-[22vw] snap-start shrink-0 h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <button
                onClick={() => scrollCarousel(flashSaleRef, "left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-all hover:scale-110 opacity-0 group-hover/carousel:opacity-100 hidden sm:flex disabled:opacity-0"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                onClick={() => scrollCarousel(flashSaleRef, "right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-all hover:scale-110 opacity-0 group-hover/carousel:opacity-100 hidden sm:flex disabled:opacity-0"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </section>
        )}

        {/* Latest Arrivals Section */}
        {latestArrivals.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Latest Arrivals
                </h2>
                <div className="h-px bg-zinc-300 dark:bg-zinc-800 flex-grow w-16 hidden md:block"></div>
              </div>
              <Link href="/products">
                <Button
                  variant="outline"
                  className="rounded-full px-5 sm:px-6 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm"
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative group/carousel">
              <div 
                ref={arrivalsRef}
                className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
              >
                {latestArrivals.map((product) => (
                  <div key={product.id} className="min-w-[75vw] sm:min-w-[45vw] md:min-w-[30vw] lg:min-w-[22vw] snap-start shrink-0 h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <button
                onClick={() => scrollCarousel(arrivalsRef, "left", true)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-all hover:scale-110 opacity-0 group-hover/carousel:opacity-100 hidden sm:flex disabled:opacity-0"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                onClick={() => scrollCarousel(arrivalsRef, "right", true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-all hover:scale-110 opacity-0 group-hover/carousel:opacity-100 hidden sm:flex disabled:opacity-0"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </section>
        )}

        {products.length === 0 && (
          <div className="text-center py-24 sm:py-32 bg-zinc-100 dark:bg-zinc-900/30 rounded-3xl border border-zinc-300 dark:border-zinc-800 border-dashed backdrop-blur-sm">
            <span className="text-5xl sm:text-6xl mb-6 block">🏜️</span>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
              Our sellers are preparing some amazing items for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
