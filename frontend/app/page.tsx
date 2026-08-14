"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        await getCurrentUser();

        // Valid session
        router.replace("/hosted-zones");
      } catch {
        // No valid session
        router.replace("/login");
      }
    }

    checkSession();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eaeded]">
      <p className="text-sm text-[#5f6b75]">
        Loading...
      </p>
    </main>
  );
}