"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withAuth<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>
) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const verify = async () => {
        try {
          const res = await fetch("http://localhost:4000/users/profile", {
            credentials: "include",
          });

          if (!res.ok) {
            console.warn("❌ Belum login, redirect ke /login");
            router.replace("/login");
            return;
          }

          const user = await res.json();
          console.log("✅ Logged in user:", user);
          setIsVerified(true);
        } catch (err) {
          console.error("❌ Error saat verifikasi login:", err);
          router.replace("/login");
        } finally {
          setLoading(false);
        }
      };

      verify();
    }, [router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg font-semibold">Memverifikasi akses...</p>
        </div>
      );
    }

    return isVerified ? <Component {...props} /> : null;
  };
}
