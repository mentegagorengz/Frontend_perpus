"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function withAuth<T extends {}>(
  Component: React.ComponentType<T>,
  requiredRole?: string
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
        const decodedToken: any = jwtDecode(token);
        console.log("✅ Token Decoded:", decodedToken);

        if (requiredRole && decodedToken.role !== requiredRole) {
          console.warn(`❌ Role tidak sesuai (${decodedToken.role}), redirect ke /unauthorized.`);
          router.replace("/unauthorized");
          return;
        }

        // Jika token valid, izinkan render halaman
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
