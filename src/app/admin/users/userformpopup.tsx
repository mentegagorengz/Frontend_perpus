"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface User {
  id?: number;
  fullName: string;
  email: string;
  nim: string;
  password?: string;
  address: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
  faculty: string;
}

interface UserFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSubmit: (data: User) => void;
}

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

const UserFormPopup: React.FC<UserFormPopupProps> = ({ isOpen, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState<User>({
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingUsers, setExistingUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:4000/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await res.json();
        setExistingUsers(data);
      } catch (err) {
        console.error("❌ Gagal fetch user:", err);
      }
    };

    if (isOpen) fetchUsers();
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: "",
        birthDate: user.birthDate?.split("T")[0] || "",
      });
    } else {
      setFormData({
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
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.nim || !formData.faculty) {
      setError("Field wajib tidak boleh kosong.");
      return;
    }

    if (!user && !formData.password) {
      setError("Password wajib diisi untuk user baru.");
      return;
    }

    // validasi email dan NIM unik
    const isEmailUsed = existingUsers.some(u => u.email === formData.email && u.id !== user?.id);
    const isNimUsed = existingUsers.some(u => u.nim === formData.nim && u.id !== user?.id);

    if (isEmailUsed) return setError("Email sudah digunakan.");
    if (isNimUsed) return setError("NIM sudah digunakan.");

    const dataToSubmit = { ...formData };
    if (user && !formData.password) {
      delete dataToSubmit.password;
    }

    setLoading(true);
    try {
      await onSubmit(dataToSubmit);
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          {user ? "Edit Pengguna" : "Tambah Pengguna"}
        </h2>

        {error && <div className="mb-3 text-red-600 text-center text-sm">{error}</div>}

        <label className="block text-sm font-medium">Nama Lengkap</label>
        <Input name="fullName" value={formData.fullName} onChange={handleChange} className="mb-2" />

        <label className="block text-sm font-medium">Email</label>
        <Input name="email" value={formData.email} onChange={handleChange} className="mb-2" />

        <label className="block text-sm font-medium">Fakultas</label>
        <select
          name="faculty"
          value={formData.faculty}
          onChange={handleChange}
          className="mb-2 border border-[#444e57] p-2 rounded w-full"
        >
          <option value="">Pilih Fakultas</option>
          {fakultasList.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <label className="block text-sm font-medium">NIM</label>
        <Input name="nim" value={formData.nim} onChange={handleChange} className="mb-2" />

        <label className="block text-sm font-medium">Alamat</label>
        <Input name="address" value={formData.address} onChange={handleChange} className="mb-2" />

        <label className="block text-sm font-medium">Tanggal Lahir</label>
        <Input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className="mb-2" />

        <label className="block text-sm font-medium">Jenis Kelamin</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="mb-2 border border-[#444e57] p-2 rounded w-full"
        >
          <option value="">Pilih Jenis Kelamin</option>
          <option value="Male">Laki-laki</option>
          <option value="Female">Perempuan</option>
        </select>

        <label className="block text-sm font-medium">Nomor Telepon</label>
        <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mb-2" />

        <label className="block text-sm font-medium">Password Baru (opsional)</label>
        <Input
          name="password"
          type="password"
          placeholder="Biarkan kosong jika tidak ingin mengubah password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-[#444e57] text-[#1f2023] hover:bg-[#928776]">
            Batal
          </Button>
          <Button onClick={handleSubmit} className="bg-[#784d1e] hover:bg-[#5a3516] text-white" disabled={loading}>
            {loading ? "Menyimpan..." : user ? "Simpan" : "Tambah"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserFormPopup;
