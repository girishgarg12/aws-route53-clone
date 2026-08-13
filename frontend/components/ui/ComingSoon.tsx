"use client";

import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({
  title,
  description = "This feature is not available yet.",
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
      <div className="w-full max-w-xl border border-[#d5dbdb] bg-white px-8 py-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e9f3f8] text-[#0073bb]">
          <Clock3 size={26} strokeWidth={1.8} />
        </div>

        <h2 className="mt-6 text-2xl font-semibold text-[#161e2d]">
          {title}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5f6b75]">
          {description}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 border border-[#d5dbdb] bg-[#f7f8f8] px-4 py-2 text-xs font-medium text-[#5f6b75]">
          Coming soon
        </div>

        <div className="mt-8">
          <Link
            href="/hosted-zones"
            className="inline-flex items-center gap-2 border border-[#879596] px-4 py-2 text-sm font-semibold text-[#161e2d] transition-colors hover:bg-[#f2f3f3]"
          >
            <ArrowLeft size={15} />
            Back to Hosted zones
          </Link>
        </div>
      </div>
    </div>
  );
}