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
      // Kirim login request
      const response = await fetch("http://localhost:4000/auth/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // penting untuk cookie!
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login gagal.");
      }

      // Ambil data user dari token cookie
      const resUser = await fetch("http://localhost:4000/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const user = await resUser.json();
      const role = user.role?.toLowerCase();

      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else if (role === "staff") {
        router.replace("/staff/dashboard");
      } else {
        router.replace("/dashboard");
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
          Login
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
