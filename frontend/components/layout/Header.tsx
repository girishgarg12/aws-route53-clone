"use client";

import {
  Bell,
  CircleHelp,
  LogOut,
  Search,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { logout } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const [accountOpen, setAccountOpen] =
    useState(false);
  const [loggingOut, setLoggingOut] =
    useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await logout();

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="flex h-16 items-center border-b border-[#30363d] bg-[#161e2d] px-5 text-white">
      {/* AWS branding */}
      <div className="flex w-64 shrink-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#ff9900] px-1 text-[15px] font-bold tracking-tight text-[#161e2d]">
          AWS
        </div>

        <span className="text-base font-semibold">
          Management Console
        </span>
      </div>

      {/* Search */}
      <div className="flex flex-1 justify-center px-8">
        <div className="flex w-full max-w-3xl items-center rounded-md border border-[#4b5563] bg-[#253143] px-3 transition-colors focus-within:border-[#879596]">
          <Search
            size={18}
            className="shrink-0 text-[#aab7c4]"
          />

          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#aab7c4]"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-5">
        <button
          className="rounded-sm p-1.5 text-[#d5dbdb] transition-colors hover:bg-[#253143] hover:text-white cursor-pointer"
          aria-label="Help"
        >
          <CircleHelp size={19} />
        </button>

        <button
          className="rounded-sm p-1.5 text-[#d5dbdb] transition-colors hover:bg-[#253143] hover:text-white cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>

        {/* Account */}
        <div className="relative">
          <button
            onClick={() =>
              setAccountOpen(
                (value) => !value
              )
            }
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-[#253143] cursor-pointer"
            aria-expanded={accountOpen}
            aria-haspopup="menu"
          >
            <UserCircle size={22} />

            <span>Girish</span>

            <span
              className={`text-xs transition-transform ${
                accountOpen
                  ? "rotate-180"
                  : ""
              }`}
            >
              ▾
            </span>
          </button>

          {accountOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-56 border border-[#d5dbdb] bg-white py-2 text-[#161e2d] shadow-lg cursor-pointer"
              role="menu"
            >
              <div className="border-b border-[#eaeded] px-4 py-3">
                <p className="text-sm font-semibold">
                  Girish
                </p>

                <p className="mt-1 text-xs text-[#687078]">
                  Route 53 user
                </p>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-[#f2f3f3] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                role="menuitem"
              >
                <LogOut size={16} />

                {loggingOut
                  ? "Signing out..."
                  : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}