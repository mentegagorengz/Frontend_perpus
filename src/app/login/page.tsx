"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

export default function LoginPage() {
  const { login } = useAuth(); // Ambil fungsi login dari konteks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    nama: "", email: "", nim: "", fakultas: "", password: ""
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("✅ Decoded Token on useEffect:", decodedToken);

        const userId = decodedToken.userId || decodedToken.id;
        if (userId) {
          localStorage.setItem("userId", userId.toString());
          console.log("✅ userId disimpan di localStorage:", localStorage.getItem("userId"));
        } else {
          console.error("❌ userId tidak ditemukan dalam token.");
          localStorage.removeItem("userId");
        }

        const userRole = decodedToken.role?.toLowerCase().trim();
        if (userRole === "admin") {
          router.replace("/admin/dashboard");
        } else if (userRole === "user") {
          const redirectPath = localStorage.getItem("redirectAfterLogin") || "/peminjaman";
          localStorage.removeItem("redirectAfterLogin"); // Hapus setelah digunakan
          router.replace(redirectPath);
        }
      } catch (error) {
        console.error("❌ Invalid token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    }
  }, [router]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const handleRegisterDataChange = (field: keyof typeof registerData) => (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [field]: e.target.value });
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
      login(data.token); // Panggil fungsi login dari konteks

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

  const handleRegister = async () => {
    if (!registerData.nama || !registerData.email || !registerData.nim || !registerData.fakultas || !registerData.password) {
      setError("Semua bidang harus diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...registerData, role: "user" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registrasi gagal.");
      }

      setShowSuccessPopup(true);
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
          {isRegistering ? "Daftar Akun" : "Login"}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {isClient ? (
          isRegistering ? (
            <>
              <input type="text" placeholder="Nama" value={registerData.nama} onChange={handleRegisterDataChange("nama")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
              <input type="email" placeholder="Email" value={registerData.email} onChange={handleRegisterDataChange("email")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
              <input type="text" placeholder="NIM" value={registerData.nim} onChange={handleRegisterDataChange("nim")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
              <input type="text" placeholder="Fakultas" value={registerData.fakultas} onChange={handleRegisterDataChange("fakultas")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
              <input type="password" placeholder="Password" value={registerData.password} onChange={handleRegisterDataChange("password")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
              <button onClick={handleRegister} className="w-full bg-[#1f2023] text-white py-3 rounded-lg mb-3">Daftar</button>
              <button onClick={() => setIsRegistering(false)} className="w-full text-blue-500">Sudah punya akun? Login</button>
            </>
          ) : (
            <>
              <input type="email" placeholder="Email" value={email} onChange={handleInputChange(setEmail)} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
              <input type="password" placeholder="Password" value={password} onChange={handleInputChange(setPassword)} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
              <button onClick={handleLogin} className="w-full bg-[#1f2023] text-white py-3 rounded-lg mb-3">Login</button>
              <button onClick={() => setIsRegistering(true)} className="w-full text-blue-500">Belum punya akun? Daftar</button>
            </>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
