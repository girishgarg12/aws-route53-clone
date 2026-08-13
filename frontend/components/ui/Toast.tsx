"use client";

import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({
  message,
  onClose,
}: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex min-w-[300px] items-center gap-3 border border-[#aab7b8] bg-white px-4 py-3 shadow-lg">
      <CheckCircle2
        size={19}
        className="text-[#1d8102]"
      />

      <span className="flex-1 text-sm text-[#161e2d]">
        {message}
      </span>

      <button
        onClick={onClose}
        aria-label="Close notification"
        className="text-[#687078] hover:text-[#161e2d]"
      >
        <X size={16} />
      </button>
    </div>
  );
}