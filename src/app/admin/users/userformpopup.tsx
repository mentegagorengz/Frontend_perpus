"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any; // Data user yang akan diedit (opsional)
  onSubmit: () => void; // Fungsi untuk refresh data setelah submit
}

const UserFormPopup: React.FC<UserFormPopupProps> = ({ isOpen, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    fakultas: "",
    nim: "",
    password: "", // Ditambahkan agar sesuai dengan proses registrasi
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ ...user, password: "" }); // Jangan tampilkan password user saat edit
    } else {
      setFormData({ nama: "", email: "", fakultas: "", nim: "", password: "" });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.nama || !formData.email || !formData.fakultas || !formData.nim || (!user && !formData.password)) {
      setError("Semua bidang harus diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const method = user ? "PUT" : "POST";
      const endpoint = user ? `/users/${user.id}` : "/users/register";

      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "user" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan data pengguna.");
      }

      onSubmit(); // Refresh data di halaman utama
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">{user ? "Edit Pengguna" : "Tambah Pengguna"}</h2>

        {error && <p className="mb-3 text-center">{error}</p>}

        {/* Form Input */}
        <label className="block text-sm font-medium text-gray-700">Nama</label>
        <Input name="nama" value={formData.nama} onChange={handleChange} className="mb-2" />

        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input name="email" type="email" value={formData.email} onChange={handleChange} className="mb-2" />

        <label className="block text-sm font-medium text-gray-700">Fakultas</label>
        <Input name="fakultas" value={formData.fakultas} onChange={handleChange} className="mb-2" />

        <label className="block text-sm font-medium text-gray-700">NIM</label>
        <Input name="nim" value={formData.nim} onChange={handleChange} className="mb-2" />

        {!user && (
          <>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} className="mb-4" />
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} className="border-[#444e57] text-[#1f2023] hover:bg-[#928776]">Batal</Button>
          <Button onClick={handleSubmit} className="bg-[#784d1e] hover:bg-[#5a3516] text-white" disabled={loading}>
            {loading ? "Menyimpan..." : user ? "Simpan" : "Tambah"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserFormPopup;
