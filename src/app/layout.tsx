"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        <AuthProvider>
          {/* Jika halaman berada di dalam /admin, gunakan layout admin */}
          {pathname.startsWith("/admin") ? (
            children
          ) : (
            <>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
