"use client";

import { ReactNode, useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#f2f3f3]">
      <Header />

      <div className="flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() =>
            setCollapsed((value) => !value)
          }
        />

        <main className="min-w-0 flex-1 px-6 py-7 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}