"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      toast.success(`Welcome, ${user.name}! Your account has been created.`);

      // Role-based redirect logic
      if (user.role === "seller") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];
        toast.error(firstError || "Registration failed.");
      } else {
        toast.error(err.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-2 pb-2">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110">
              M
            </div>
            <span className="text-lg font-bold text-white">Marketplace</span>
          </Link>
          <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
          <CardDescription className="text-zinc-400">
            Join the marketplace as a buyer or seller
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password" className="text-zinc-300">
                Password
              </Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-confirm" className="text-zinc-300">
                Confirm Password
              </Label>
              <Input
                id="password-confirm"
                type="password"
                placeholder="••••••••"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength={8}
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
              />
            </div>

            {/* Role Selector */}
            <div className="space-y-2">
              <Label className="text-zinc-300">I want to</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
                    role === "buyer"
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50"
                      : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <div className="text-lg mb-1">🛒</div>
                  Buy Products
                </button>
                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
                    role === "seller"
                      ? "border-violet-500 bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/50"
                      : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <div className="text-lg mb-1">🏪</div>
                  Sell Products
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
