"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-zinc-950 text-white px-4">
      <div className="relative">
        <h1 className="text-9xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-violet-700 select-none">
          404
        </h1>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 px-2 text-sm text-indigo-400 font-medium tracking-wider rounded border border-zinc-800 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          Page Not Found
        </div>
      </div>
      
      <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-100">
        Lost in the marketplace?
      </h2>
      <p className="mt-4 text-zinc-400 text-center max-w-md">
        We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps never existed at all.
      </p>

      <div className="mt-10">
        <Link href="/">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 rounded-full font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            <span>Take Me Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
