"use client";
import { useState, useCallback } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleMenuToggle = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="admin-app-shell flex min-h-screen bg-[#f3f4f6] text-[#111827] antialiased">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuToggle={handleMenuToggle} />
        <main className="admin-main min-h-[calc(100vh-56px)] flex-1 bg-[#f3f4f6] p-4 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
