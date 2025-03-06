"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("✅ Decoded Token:", decodedToken);

        if (decodedToken.role?.toLowerCase() === "admin") {
          router.replace("/admin/dashboard");
        } else {
          console.error("❌ Bukan admin, menghapus token.");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
  }, [router]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password harus diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login gagal.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      // login(data.token); // Panggil fungsi login dari konteks jika diperlukan

      const decodedToken = jwtDecode(data.token);
      console.log("✅ Decoded Token after login:", decodedToken);

      const userId = decodedToken.userId || decodedToken.id;
      if (!userId) {
        console.error("❌ userId tidak ditemukan dalam token.");
        throw new Error("Login gagal. Token tidak valid.");
      }

      localStorage.setItem("userId", userId.toString());
      console.log("✅ userId disimpan di localStorage:", localStorage.getItem("userId"));

      const userRole = decodedToken.role?.toLowerCase().trim();
      if (userRole === "admin") {
        router.replace("/admin/dashboard");
      } else if (userRole === "user") {
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/peminjaman";
        localStorage.removeItem("redirectAfterLogin"); // Hapus setelah digunakan
        router.replace(redirectPath);
      } else {
        throw new Error("Role tidak valid. Hubungi admin.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-[#1f2023] mb-6">
          Login Admin
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleInputChange(setEmail)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handleInputChange(setPassword)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-3"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-[#1f2023] text-white py-3 rounded-lg mb-3"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}
