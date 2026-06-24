"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  ShoppingBag,
  Package2,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Grid3X3,
  Heart,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Category } from "@/types";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount, fetchCart, clearCartStore } = useCartStore();
  const { count: wishlistCount, fetchWishlists, clearWishlist } = useWishlistStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === "buyer") {
      fetchCart();
      fetchWishlists();
    } else if (!isAuthenticated) {
      clearCartStore();
      clearWishlist();
    }
  }, [isAuthenticated, user, fetchCart, clearCartStore, fetchWishlists, clearWishlist]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        const res = await fetch(`${apiUrl}/categories`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch {
        // silently fail
      }
    };
    fetchCategories();
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleLogout = async () => {
    await logout();
    clearCartStore();
    clearWishlist();
    setMobileMenuOpen(false);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setShowSearch(false);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-zinc-950/50 transition-colors">
      <div className="w-[90%] mx-auto h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg group-hover:shadow-indigo-500/25 transition-all group-hover:scale-105">
            <Package2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors hidden sm:block">
            Marketplace
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        </form>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button
                variant="ghost"
                className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-full px-4 h-9 transition-all text-sm"
              >
                <Grid3X3 className="h-4 w-4 mr-1.5" />
                Categories
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            } />
            <DropdownMenuContent
              className="w-56 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 p-2 rounded-2xl shadow-2xl"
              align="center"
            >
              <DropdownMenuItem render={
                <Link
                  href="/products"
                  className="flex items-center gap-3 cursor-pointer rounded-xl p-3 text-sm font-medium transition-colors"
                >
                  <span className="text-base">🛍️</span>
                  All Products
                </Link>
              } />
              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.id} render={
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="flex items-center gap-3 cursor-pointer rounded-xl p-3 text-sm font-medium transition-colors"
                  >
                    <span className="text-base">{cat.icon || "📦"}</span>
                    {cat.name}
                    {cat.products_count !== undefined && (
                      <span className="ml-auto text-xs text-zinc-400">
                        {cat.products_count}
                      </span>
                    )}
                  </Link>
                } />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          {isAuthenticated && user ? (
            <>
              {user.role === "buyer" && (
                <>
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      className={`relative text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-full px-4 h-9 transition-all text-sm ${
                        isActive("/profile")
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                          : ""
                      }`}
                    >
                      <Heart className="h-4 w-4 mr-1.5" />
                      <span className="font-medium">Wishlist</span>
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold text-white shadow-lg shadow-indigo-500/30 animate-in zoom-in">
                          {wishlistCount > 99 ? "99+" : wishlistCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Link href="/cart">
                  <Button
                    variant="ghost"
                    className={`relative text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-full px-4 h-9 transition-all text-sm ${
                      isActive("/cart")
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                        : ""
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4 mr-1.5" />
                    <span className="font-medium">Cart</span>
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold text-white shadow-lg shadow-indigo-500/30 animate-in zoom-in">
                        {itemCount > 99 ? "99+" : itemCount}
                      </span>
                    )}
                  </Button>
                </Link>
                </>
              )}

              {user.role === "seller" && (
                <Link href="/admin/dashboard">
                  <Button
                    variant="ghost"
                    className={`text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-full px-4 h-9 transition-all text-sm ${
                      isActive("/admin")
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                        : ""
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-1.5" />
                    <span className="font-medium">Dashboard</span>
                  </Button>
                </Link>
              )}

              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

              <DropdownMenu>
                <DropdownMenuTrigger className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950 transition-all hover:scale-105 active:scale-95">
                  <Avatar className="h-9 w-9 border-2 border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors">
                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 p-2 rounded-2xl shadow-2xl"
                  align="end"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal p-3">
                      <div className="flex flex-col space-y-2">
                        <p className="text-base font-semibold leading-none text-zinc-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm leading-none text-zinc-500 dark:text-zinc-400">
                          {user.email}
                        </p>
                        <p className="text-xs font-bold leading-none text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-2 border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 inline-block px-3 py-1 rounded-full w-fit">
                          {user.role}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 dark:focus:text-red-400 rounded-xl p-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-full px-5 font-medium h-9 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-sm"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-5 font-medium h-9 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 text-sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white h-9 w-9 rounded-full"
          >
            <Search className="h-5 w-5" />
          </Button>

          {isAuthenticated && user?.role === "buyer" && (
            <>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white h-9 w-9 rounded-full"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white shadow-sm">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white h-9 w-9 rounded-full"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white shadow-sm">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </>
          )}

          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white h-9 w-9 rounded-full"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-4 py-3 animate-in slide-in-from-top-1 duration-200">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </form>
        </div>
      )}

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl absolute w-full shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-5 space-y-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-4 mb-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <Avatar className="h-11 w-11 border border-zinc-200 dark:border-zinc-700">
                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                {user.role === "seller" && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className={`w-full justify-start border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 h-11 rounded-xl text-sm ${
                        isActive("/admin")
                          ? "text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10"
                          : "text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-3 text-indigo-600 dark:text-indigo-400" />
                      Dashboard
                    </Button>
                  </Link>
                )}

                {/* Mobile Categories */}
                <div className="pt-2 pb-1">
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/products"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                          isActive("/products") && !pathname.includes("?")
                            ? "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-indigo-500/20"
                        }`}
                      >
                        <span>🛍️</span>
                        All
                      </div>
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-indigo-500/20 text-sm font-medium transition-colors">
                          <span>{cat.icon || "📦"}</span>
                          <span className="truncate">{cat.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 h-11 rounded-xl mt-2 text-sm"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Log out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Mobile Categories for guests */}
                <div className="pb-2">
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/products"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors hover:border-indigo-300">
                        <span>🛍️</span>
                        All
                      </div>
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors hover:border-indigo-300">
                          <span>{cat.icon || "📦"}</span>
                          <span className="truncate">{cat.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 h-11 rounded-xl text-sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-11 rounded-xl shadow-lg shadow-indigo-500/20 text-sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
