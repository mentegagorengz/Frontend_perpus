"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

interface NavLink {
  href: string;
  label: string;
}

export default function Header() {
  const { isLoggedIn, logout } = useAuth(); // Ambil status login dan fungsi logout dari konteks
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const router = useRouter();

  const secondaryColor = "#784d1e";
  const loginButtonColor = "#4CAF50"; // Warna hijau untuk login
  const logoutButtonColor = "#F44336"; // Warna merah untuk logout

  const navLinks: NavLink[] = useMemo(
    () => [
      { href: "/", label: "Beranda" },
      { href: "/profil", label: "Profil" },
      { href: isLoggedIn ? "/peminjaman" : "/login", label: "Peminjaman Buku" },
      { href: "/koleksi", label: "Koleksi daring" },
      { href: "/pencarianbuku", label: "Koleksi" },
    ],
    [isLoggedIn]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Fungsi Logout dengan Redirect
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
    <header className="bg-[#784d1e] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 md:px-8 py-3">
        {/* Logo dan Judul */}
        <div className="flex items-center space-x-4">
          <Image
            src="/images/logo_unsrat.png"
            alt="Logo UNSRAT"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <h1 className="text-lg font-bold">Perpustakaan UNSRAT</h1>
        </div>

        {/* Tombol Hamburger untuk Mobile */}
        <button
          className="lg:hidden text-white text-3xl focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        >
          ☰
        </button>

        {/* Navigasi */}
        <div
          className={`absolute lg:relative top-full left-0 w-full lg:w-auto bg-[#928776] lg:bg-transparent shadow-lg lg:shadow-none transition-all duration-300 ease-in-out ${
            isMenuOpen ? "block" : "hidden"
          } lg:flex lg:items-center lg:space-x-6 p-4 lg:p-0 rounded-lg lg:rounded-none`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block lg:inline text-[#1f2023] lg:text-white hover:text-[#B22222] lg:hover:text-gray-300 transition px-4 py-2"
            >
              {link.label}
            </Link>
          ))}

          {/* Tombol Logout */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="block lg:inline px-4 py-2 rounded-lg transition w-full lg:w-auto text-center"
              style={{ backgroundColor: logoutButtonColor, color: "#FFFFFF" }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
          Logout berhasil!
        </div>
      )}
    </header>
  );
}
