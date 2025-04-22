"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function withAdminAuth<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>
) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState<boolean>(false);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("❌ Tidak ada token, redirect ke login.");
        router.replace("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode<{ role: string }>(token);
        console.log("✅ Token Decoded:", decodedToken);

        if (!decodedToken || decodedToken.role !== "admin") {
          console.warn("❌ Role bukan admin, redirect ke halaman peminjaman.");
          router.replace("/peminjaman");
          return;
        }

        setIsVerified(true);
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        localStorage.removeItem("token");
        router.replace("/login");
      }
    }, [router]);

    if (!isVerified) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg font-semibold">Memverifikasi akses...</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
