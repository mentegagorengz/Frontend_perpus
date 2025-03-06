import { useState } from "react";
import { useRouter } from "next/router";

const handleLogin = async () => {
  // Tambahkan state untuk email & password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter(); // Gunakan useRouter untuk navigasi

  console.log("Mengirim request login:", { email, password });

  try {
    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Login gagal. Email atau password salah.");
      } else {
        throw new Error("Login gagal. Terjadi kesalahan pada server.");
      }
    }

    const data = await response.json();
    console.log("Data dari backend:", data);

    localStorage.setItem("token", data.token);
    router.push("/peminjaman"); // Navigasi ke halaman peminjaman setelah login
  } catch (err: any) {
    console.error("Error saat login:", err);
    if (err.name === "TypeError") {
      setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    } else {
      setError(err.message || "Terjadi kesalahan saat login.");
    }
  }
};
