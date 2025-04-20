"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Plus, Search } from "lucide-react";
import withAuth from "@/hoc/withAuth";
import UserFormPopup from "./userformpopup";

const API_BASE_URL = "http://localhost:4000/users";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchUsers();
    }
  }, [isMounted]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers(users);
    } else {
      const searchLower = search.toLowerCase();
      const filtered = users.filter(({ fullName, faculty, nim }) =>
        [fullName, faculty, nim].join(" ").toLowerCase().includes(searchLower)
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Data pengguna tidak valid");

      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUserId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${deleteUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Gagal menghapus pengguna");

      setUsers(prev => prev.filter(user => user.id !== deleteUserId));
      setDeleteUserId(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (userData) => {
    if (!userData) return;

    setLoading(true);
    try {
      const method = userData.id ? "PUT" : "POST";
      const endpoint = userData.id ? `${API_BASE_URL}/${userData.id}` : `${API_BASE_URL}/register`;

      const payload = { ...userData };
      if (method === "PUT" && !userData.password) {
        delete payload.password;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal menyimpan data pengguna");

      fetchUsers();
      setIsPopupOpen(false);
      setEditUser(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg">
      <div className="w-full flex justify-between items-center mb-4 mt-1 pl-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Daftar Mahasiswa</h3>
          <p className="text-slate-500">Overview of the current users.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full max-w-sm min-w-[200px]">
            <Input
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-3 pr-10"
            />
            <Search className="absolute right-2 top-2.5 w-5 h-5 text-slate-500" />
          </div>
          <Button onClick={() => setIsPopupOpen(true)} className="flex gap-2">
            <Plus size={18} /> Tambah
          </Button>
        </div>
      </div>

      <div className="overflow-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left table-auto min-w-max">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">No.</th>
              <th className="p-4">Nama</th>
              <th className="p-4">Fakultas</th>
              <th className="p-4">NIM</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className="hover:bg-slate-50 border-b">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{user.fullName || "-"}</td>
                <td className="p-4">{user.faculty || "-"}</td>
                <td className="p-4">{user.nim || "-"}</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={() => setEditUser(user)}
                      className="bg-slate-600 hover:bg-slate-700 text-white p-2 rounded-md"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      onClick={() => setDeleteUserId(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-slate-500">
                  Tidak ada data pengguna
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserFormPopup
        isOpen={isPopupOpen || !!editUser}
        onClose={() => {
          setIsPopupOpen(false);
          setEditUser(null);
        }}
        user={editUser}
        onSubmit={handleSaveUser}
      />

      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold text-center mb-4">Konfirmasi Hapus</h2>
            <p className="text-center text-gray-700 mb-4">Yakin ingin menghapus pengguna ini?</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setDeleteUserId(null)} variant="outline">Batal</Button>
              <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(UserManagementPage, "admin");
