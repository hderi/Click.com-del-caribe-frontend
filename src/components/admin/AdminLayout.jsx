"use client";
import { useState, useCallback } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const handleMenuToggle = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);
  const handleSidebarCollapseToggle = useCallback(() => setSidebarCollapsed((prev) => !prev), []);

  return (
    <div className="admin-app-shell flex h-screen overflow-hidden bg-[#f3f4f6] text-[#111827] antialiased">
      <Sidebar isOpen={sidebarOpen} isCollapsed={sidebarCollapsed} onClose={handleSidebarClose} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          onMenuToggle={handleMenuToggle}
          onSidebarCollapseToggle={handleSidebarCollapseToggle}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="admin-main min-h-0 flex-1 overflow-y-auto bg-[#f3f4f6] p-3 sm:p-4 lg:p-5 xl:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
