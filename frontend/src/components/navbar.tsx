"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110">
            M
          </div>
          <span className="text-lg font-bold text-white hidden sm:inline-block">
            Marketplace
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {user.role === "buyer" && (
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
                    <span className="text-lg mr-2">🛒</span> Cart
                  </Button>
                </Link>
              )}

              {user.role === "seller" && (
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
                    Dashboard
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <Avatar className="h-8 w-8 border border-zinc-700">
                    <AvatarFallback className="bg-zinc-800 text-zinc-300">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                      <p className="text-xs leading-none text-zinc-400">{user.email}</p>
                      <p className="text-xs leading-none text-indigo-400 capitalize mt-1 border border-indigo-500/30 bg-indigo-500/10 inline-block px-2 py-0.5 rounded-full w-fit">
                        {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-white" onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-zinc-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
