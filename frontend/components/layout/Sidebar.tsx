"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      className={`relative flex min-h-[calc(100vh-56px)] flex-col border-r border-[#d5dbdb] bg-white transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="border-b border-[#eaeded] px-4 py-4">
        {!collapsed && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#687078]">
              AWS
            </p>

            <h1 className="mt-1 text-base font-semibold text-[#161e2d]">
              Route 53
            </h1>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`mx-2 mb-1 flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[#e9f3f8] font-semibold text-[#0073bb]"
                  : "text-[#414a52] hover:bg-[#f2f3f3]"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />

              {!collapsed && (
                <span>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-5 flex h-6 w-6 items-center justify-center rounded-full border border-[#d5dbdb] bg-white text-[#5f6b75] shadow-sm hover:bg-[#f2f3f3]"
        aria-label={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
      >
        {collapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>
    </aside>
  );
}