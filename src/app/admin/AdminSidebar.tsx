"use client";

import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Users, BarChart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Impor yang diperbarui

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean; setIsSidebarOpen: (open: boolean) => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth(); // Penggunaan yang diperbarui
  const [showToast, setShowToast] = useState(false);

  // 🔥 Fungsi Logout
  const handleLogout = () => {
    logout(); // Panggil fungsi logout dari AuthContext
    localStorage.removeItem("token"); // Bersihkan token di localStorage
    localStorage.removeItem("userId"); // Bersihkan userId juga
    setShowToast(true); // Tampilkan notifikasi logout

    setTimeout(() => {
      setShowToast(false);
      router.replace("/"); // Redirect ke beranda setelah logout
    }, 2000);
  };

  return (
    <>
      {/* Kode Sidebar di sini... */}
      {/* Tombol Toggle Sidebar */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg lg:hidden"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay saat sidebar terbuka di mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#2E2E2E] text-white p-4 transition-all duration-300 z-50 flex flex-col ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header Sidebar */}
        <div className="flex justify-between items-center mb-6">
          {isSidebarOpen && <h1 className="text-xl font-bold">📚 Admin UNSRAT</h1>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigasi Sidebar */}
        <nav className="space-y-4 flex-1">
          <SidebarLink
            href="/admin/dashboard"
            icon={<BarChart size={20} />}
            label="Dashboard"
            isActive={pathname === "/admin/dashboard"}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarLink
            href="/admin/books"
            icon={<BookOpen size={20} />}
            label="Manajemen Buku"
            isActive={pathname === "/admin/books"}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarLink
            href="/admin/users"
            icon={<Users size={20} />}
            label="Manajemen Pengguna"
            isActive={pathname === "/admin/users"}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarLink
            href="/admin/loans"
            icon={<BookOpen size={20} />}
            label="Peminjaman"
            isActive={pathname === "/admin/loans"}
            isSidebarOpen={isSidebarOpen}
          />
        </nav>

        {/* Tombol Logout */}
        <Button
          onClick={handleLogout}
          className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 mt-6 p-3 rounded"
        >
          <LogOut size={18} className="mr-2" /> {isSidebarOpen && "Logout"}
        </Button>
      </aside>
    </>
  );
};

// 🔹 Komponen Sidebar Link
const SidebarLink = ({
  href,
  icon,
  label,
  isActive,
  isSidebarOpen,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isSidebarOpen: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center space-x-3 p-3 rounded-lg transition duration-300 ${
      isActive ? "bg-[#4A90E2]" : "hover:bg-[#3A3A3A]"
    }`}
  >
    {icon}
    {isSidebarOpen && <span>{label}</span>}
  </Link>
);

export default AdminSidebar;
