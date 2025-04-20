"use client";

import React, { useState, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  BookOpen,
  Users,
  BarChart,
  ChevronDown,
  ChevronUp,
  FileText,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const [openKoleksi, setOpenKoleksi] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <>
      {/* Dialog Konfirmasi Logout */}
      <Dialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)}>
        <h2 className="text-lg font-bold mb-2">Konfirmasi Logout</h2>
        <p className="text-sm text-gray-700 mb-4">Apakah Anda yakin ingin logout?</p>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={() => setShowLogoutDialog(false)}>
            Batal
          </Button>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
            Ya, Logout
          </Button>
        </div>
      </Dialog>

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-[#2E2E2E] text-white p-4 z-50 flex flex-col">
        <div className="mb-6">
          <h1 className="text-xl font-bold">📚 Staff Perpus</h1>
        </div>

        <nav className="space-y-4 flex-1">
          <SidebarLink
            href="/admin/dashboard"
            icon={<BarChart size={20} />}
            label="Dashboard"
            isActive={pathname === "/admin/dashboard"}
          />

          {/* Dropdown Koleksi */}
          <div>
            <button
              onClick={() => setOpenKoleksi(!openKoleksi)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition duration-300 ${
                pathname.includes("/admin/books") || pathname.includes("/admin/penelitian") || pathname.includes("/admin/majalah")
                  ? "bg-[#4A90E2]"
                  : "hover:bg-[#3A3A3A]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <BookOpen size={20} />
                <span>Koleksi</span>
              </div>
              {openKoleksi ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {openKoleksi && (
              <div className="ml-6 mt-2 space-y-2">
                <SubLink
                  href="/admin/books"
                  label="Buku"
                  isActive={pathname === "/admin/books"}
                />
                <SubLink
                  href="/admin/penelitian"
                  label="Penelitian"
                  icon={<FileText size={16} />}
                  isActive={pathname === "/admin/penelitian"}
                />
                <SubLink
                  href="/admin/majalah"
                  label="Majalah"
                  icon={<Newspaper size={16} />}
                  isActive={pathname === "/admin/majalah"}
                />
              </div>
            )}
          </div>

          <SidebarLink
            href="/admin/users"
            icon={<Users size={20} />}
            label="Manajemen Pengguna"
            isActive={pathname === "/admin/users"}
          />
          <SidebarLink
            href="/admin/loans"
            icon={<BookOpen size={20} />}
            label="Peminjaman"
            isActive={pathname === "/admin/loans"}
          />
          <SidebarLink
            href="/admin/scan"
            icon={<BookOpen size={20} />}
            label="Scan"
            isActive={pathname === "/admin/scan"}
          />
        </nav>

        {/* Tombol Logout */}
        <Button
          onClick={() => setShowLogoutDialog(true)}
          className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white font-medium mt-6 p-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <LogOut size={18} className="mr-2" /> Logout
        </Button>
      </aside>
    </>
  );
};

// Komponen Sidebar Link
const SidebarLink = ({
  href,
  icon,
  label,
  isActive,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center space-x-3 p-3 rounded-lg transition duration-300 ${
      isActive ? "bg-[#4A90E2]" : "hover:bg-[#3A3A3A]"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

// SubLink untuk dropdown Koleksi
const SubLink = ({
  href,
  label,
  isActive,
  icon,
}: {
  href: string;
  label: string;
  isActive: boolean;
  icon?: React.ReactNode;
}) => (
  <Link
    href={href}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition duration-300 ${
      isActive ? "bg-[#4A90E2]" : "hover:bg-[#3A3A3A]"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default AdminSidebar;
