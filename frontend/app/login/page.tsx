"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function useDemoCredentials() {
    setEmail("demo@route53clone.com");
    setPassword("Route53@123");
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({
        email,
        password,
      });

      router.push("/hosted-zones");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eaeded] px-4">
      <div className="w-full max-w-[420px]">
        {/* AWS Logo */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-12 w-14 mt-2 items-center justify-center rounded-sm bg-[#ff9900] text-lg font-bold text-[#161e2d]">
            AWS
          </div>
        </div>

        {/* Login Card */}
        <div className="border border-[#d5dbdb] bg-white px-8 py-7">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#161e2d]">
              Sign in
            </h1>

            <p className="mt-2 text-sm text-[#5f6b75]">
              Sign in to manage your Route 53
              hosted zones.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 border border-[#d13212] bg-[#fff4f2] px-4 py-3 text-sm text-[#d13212]">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="w-full border border-[#879596] px-3 py-2 text-sm outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="w-full border border-[#879596] px-3 py-2 text-sm outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
                required
              />
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#ff9900] px-4 py-2.5 text-sm font-semibold text-[#161e2d] hover:bg-[#ec8b00] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <LockKeyhole size={16} />

              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 border-t border-[#eaeded] pt-5">
            <p className="text-sm font-semibold text-[#161e2d]">
              Demo account
            </p>

            <p className="mt-2 text-xs text-[#687078]">
              Use the demo account to explore the
              Route 53 console.
            </p>

            <button
              type="button"
              onClick={useDemoCredentials}
              className="mt-3 w-full border border-[#879596] px-4 py-2 text-sm font-semibold text-[#161e2d] hover:bg-[#f2f3f3] cursor-pointer"
            >
              Use demo credentials
            </button>

            <div className="mt-3 text-xs text-[#687078]">
              <p>
                Email:{" "}
                <span className="font-medium text-[#414a52]">
                  demo@route53clone.com
                </span>
              </p>

              <p>
                Password:{" "}
                <span className="font-medium text-[#414a52]">
                  Route53@123
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-[#687078]">
          Route 53 Console Clone
        </p>
      </div>
    </main>
  );
}