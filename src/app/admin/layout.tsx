"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/app/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State untuk toggle sidebar

  // Jika halaman adalah login, tampilkan tanpa sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 p-6 flex-1 ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}
      >
        <div className="max-w-screen-xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
