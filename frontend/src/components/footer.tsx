import Link from "next/link";
import { Package2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl mt-auto transition-colors">
      <div className="w-[90%] mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg group-hover:shadow-indigo-500/25 transition-all">
                <Package2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                Marketplace
              </span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-sm">
              The premier destination for finding exceptional products from independent sellers around the globe.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-200 dark:border-zinc-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Marketplace. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="h-2 w-2 rounded-full bg-fuchsia-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
