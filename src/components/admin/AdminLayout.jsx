"use client";
import { useState, useCallback } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleMenuToggle = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="admin-app-shell flex min-h-screen bg-[#E4EDF4] text-[#172234] antialiased font-['Manrope','Aptos','Segoe_UI',system-ui,sans-serif]">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuToggle={handleMenuToggle} />
        <main className="admin-main min-h-[calc(100vh-72px)] flex-1 bg-[radial-gradient(circle_at_15%_8%,rgba(0,168,232,0.10),transparent_32%),linear-gradient(135deg,#EAF2F7_0%,#DDE8F0_48%,#E9EEF2_100%)] p-4 sm:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
