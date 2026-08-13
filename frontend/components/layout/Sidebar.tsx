"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { navigation } from "@/lib/navigation";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex min-h-[calc(100vh-56px)] flex-col border-r border-[#d5dbdb] bg-white transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar heading */}
      <div className="border-b border-[#eaeded] px-5 py-6">
        {!collapsed && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#687078]">
              AWS
            </p>

            <h1 className="mt-1 text-lg font-semibold text-[#161e2d]">
              Route 53
            </h1>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-5">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(
              `${item.href}/`
            );

          return (
            <Link
              key={item.href}
              href={item.href}
              title={
                collapsed
                  ? item.label
                  : undefined
              }
              className={`mb-1.5 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors duration-150 ${
                isActive
                  ? "bg-[#e9f3f8] font-semibold text-[#0073bb]"
                  : "text-[#414a52] hover:bg-[#f2f3f3] hover:text-[#161e2d]"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={1.8}
                className="shrink-0"
              />

              {!collapsed && (
                <span>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 flex h-7 w-7 items-center justify-center rounded-full border border-[#d5dbdb] bg-white text-[#5f6b75] shadow-sm transition-colors duration-150 hover:bg-[#f2f3f3] hover:text-[#161e2d]"
        aria-label={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
      >
        {collapsed ? (
          <ChevronRight size={15} />
        ) : (
          <ChevronLeft size={15} />
        )}
      </button>
    </aside>
  );
}