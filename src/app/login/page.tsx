"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    nim: "",
    password: "",
    address: "",
    birthDate: "",
    gender: "",
    phoneNumber: "",
    faculty: "",
  });

  const [isClient, setIsClient] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetData, setResetData] = useState({ email: "", newPassword: "" });

  useEffect(() => {
    setIsClient(true);
    const checkLogin = async () => {
      const res = await fetch("http://localhost:4000/profile", { credentials: "include" });
      if (res.ok) {
        const user = await res.json();
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/peminjaman";
        localStorage.removeItem("redirectAfterLogin");
        router.replace(redirectPath);
      }
    };
    checkLogin();
  }, [router]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => setter(e.target.value);

  const handleRegisterDataChange = (field: keyof typeof registerData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setRegisterData({ ...registerData, [field]: e.target.value });

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login gagal.");
      }

      const check = await fetch("http://localhost:4000/users/profile", { credentials: "include" });
      if (!check.ok) throw new Error("Gagal memverifikasi user.");
      const user = await check.json();

      login(user);
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/peminjaman";
      localStorage.removeItem("redirectAfterLogin");
      router.replace(redirectPath);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const { fullName, email, nim, password, address, birthDate, gender, phoneNumber, faculty } = registerData;
    if (!fullName || !email || !nim || !password || !address || !birthDate || !gender || !phoneNumber || !faculty) {
      setError("Semua bidang harus diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const check = await fetch("http://localhost:4000/users");
      const users = await check.json();

      const emailTaken = users.some((u: any) => u.email === email);
      const nimTaken = users.some((u: any) => u.nim === nim);

      if (emailTaken) {
        setError("Email sudah digunakan.");
        return;
      }
      if (nimTaken) {
        setError("NIM sudah digunakan.");
        return;
      }

      const response = await fetch("http://localhost:4000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registrasi gagal.");
      }

      setShowSuccessPopup(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat registrasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetData.email || !resetData.newPassword) {
      setError("Email dan password baru harus diisi.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Reset gagal.");
      }

      alert("Password berhasil direset. Silakan login.");
      setIsResetting(false);
      setResetData({ email: "", newPassword: "" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setIsRegistering(false);
    setRegisterData({
      fullName: "",
      email: "",
      nim: "",
      password: "",
      address: "",
      birthDate: "",
      gender: "",
      phoneNumber: "",
      faculty: "",
    });
  };

  const fakultasList = [
    "Fakultas Kedokteran",
    "Fakultas Teknik",
    "Fakultas Pertanian",
    "Fakultas Peternakan",
    "Fakultas Perikanan dan Ilmu Kelautan",
    "Fakultas Ekonomi",
    "Fakultas Hukum",
    "Fakultas Ilmu Sosial dan Ilmu Politik",
    "Fakultas Ilmu Budaya",
    "Fakultas Matematika dan Ilmu Pengetahuan Alam",
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-[#1f2023] mb-6">
          {isRegistering ? "Daftar Akun" : isResetting ? "Reset Password" : "Login"}
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {isClient ? (
          <>
            {isResetting && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={resetData.email}
                  onChange={handleResetChange}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Password Baru"
                  value={resetData.newPassword}
                  onChange={handleResetChange}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                />
                <button
                  onClick={handleResetPassword}
                  className="w-full bg-[#1f2023] text-white py-3 rounded-lg mb-3"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => setIsResetting(false)}
                  className="w-full text-blue-500"
                >
                  Batal
                </button>
              </>
            )}
            {!isResetting && (
              <>
                {isRegistering ? (
                  <>
                    <input type="text" placeholder="Nama Lengkap" value={registerData.fullName} onChange={handleRegisterDataChange("fullName")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
                    <input type="email" placeholder="Email" value={registerData.email} onChange={handleRegisterDataChange("email")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
                    <select value={registerData.faculty} onChange={handleRegisterDataChange("faculty")} className="w-full p-3 border border-gray-300 rounded-lg mb-3">
                      <option value="">Pilih Fakultas</option>
                      {fakultasList.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <input type="text" placeholder="NIM" value={registerData.nim} onChange={handleRegisterDataChange("nim")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
                    <input type="text" placeholder="Alamat" value={registerData.address} onChange={handleRegisterDataChange("address")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
                    <input type="date" placeholder="Tanggal Lahir" value={registerData.birthDate} onChange={handleRegisterDataChange("birthDate")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
                    <select value={registerData.gender} onChange={handleRegisterDataChange("gender")} className="w-full p-3 border border-gray-300 rounded-lg mb-3">
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Male">Laki-laki</option>
                      <option value="Female">Perempuan</option>
                    </select>
                    <input type="text" placeholder="Nomor Telepon" value={registerData.phoneNumber} onChange={handleRegisterDataChange("phoneNumber")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
                    <input type="password" placeholder="Password" value={registerData.password} onChange={handleRegisterDataChange("password")} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
                    <button onClick={handleRegister} className="w-full bg-[#1f2023] text-white py-3 rounded-lg mb-3">
                      Daftar
                    </button>
                    <button onClick={() => setIsRegistering(false)} className="w-full text-blue-500">
                      Sudah punya akun? Login
                    </button>
                  </>
                ) : (
                  <>
                    <input type="email" placeholder="Email" value={email} onChange={handleInputChange(setEmail)} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
                    <input type="password" placeholder="Password" value={password} onChange={handleInputChange(setPassword)} className="w-full p-3 border border-gray-300 rounded-lg mb-3" />
                    <button onClick={handleLogin} className="w-full bg-[#1f2023] text-white py-3 rounded-lg mb-3" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </button>
                    <button onClick={() => setIsRegistering(true)} className="w-full text-blue-500 hover:text-blue-700">
                      Belum punya akun? Daftar
                    </button>
                    <button onClick={() => setIsResetting(true)} className="w-full text-blue-500 hover:text-blue-700 mt-3">
                      Lupa password? Reset
                    </button>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Berhasil!</h2>
            <p className="mb-4">Anda berhasil mendaftar akun, silakan login.</p>
            <button onClick={handleClosePopup} className="bg-[#1f2023] text-white py-2 px-4 rounded-lg">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
