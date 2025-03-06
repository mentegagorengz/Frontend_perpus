"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserFormPopup from "./userformpopup"; // Import popup untuk tambah/edit user
import withAuth from "@/hoc/withAuth"; // Import HOC proteksi

const API_BASE_URL = "http://localhost:4000/users";

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null); // Untuk menyimpan user yang akan dihapus
    const [isMounted, setIsMounted] = useState(false); // Untuk mencegah hydration error

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            fetchUsers();
        }
    }, [isMounted]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error("Gagal mengambil data pengguna");

            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("Data pengguna tidak valid");

            setUsers(data.filter(user => user.role === "user"));
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
            const response = await fetch(`${API_BASE_URL}/${deleteUserId}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("Gagal menghapus pengguna");
            }

            // Hapus user dari state tanpa refresh
            setUsers(prevUsers => prevUsers.filter(user => user.id !== deleteUserId));
            setDeleteUserId(null); // Tutup modal setelah berhasil hapus
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveUser = async (userData) => {
        setLoading(true);
        try {
            const method = userData.id ? "PUT" : "POST";
            const endpoint = userData.id ? `${API_BASE_URL}/${userData.id}` : API_BASE_URL;

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
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

    if (!isMounted) return <div className="min-h-screen bg-gray-100 flex justify-center items-center">Loading...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-700 text-center">Daftar Mahasiswa</h1>

            {/* Search & Add Button */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center bg-gray-100 p-2 rounded-md">
                    <Search className="text-gray-500" size={18} />
                    <Input 
                        className="ml-2 border-none bg-transparent focus:ring-0"
                        placeholder="Cari Nama, Fakultas, atau NIM..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsPopupOpen(true)} className="bg-[#784d1e] hover:bg-[#5a3516] text-white py-2 px-4 rounded-lg shadow-md flex items-center gap-2">
                    <Plus size={16} /> Tambah Mahasiswa
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <Table className="w-full text-gray-700">
                    <TableHeader className="bg-gray-100 text-gray-800">
                        <TableRow>
                            <TableHead className="p-3 text-center">No.</TableHead>
                            <TableHead className="p-3 text-center">Nama</TableHead>
                            <TableHead className="p-3 text-center">Fakultas</TableHead>
                            <TableHead className="p-3 text-center">NIM</TableHead>
                            <TableHead className="p-3 text-center">Aksi</TableHead> 
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id} className="hover:bg-gray-50 text-center">
                                <TableCell className="p-3">{index + 1}</TableCell>
                                <TableCell className="p-3">{user.nama || "-"}</TableCell>
                                <TableCell className="p-3">{user.fakultas || "-"}</TableCell>
                                <TableCell className="p-3">{user.nim || "-"}</TableCell>
                                <TableCell className="p-3">
                                    <div className="flex justify-center space-x-2">
                                        {/* <Button onClick={() => setEditUser(user)} className="bg-[#784d1e] hover:bg-[#5a3516] text-white p-2 rounded-md">
                                            <Pencil size={16} />
                                        </Button> */}
                                        <Button 
                                            onClick={() => setDeleteUserId(user.id)} 
                                            className="bg-[#784d1e] hover:bg-[#5a3516] text-white p-2 rounded-md"
                                        >
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Popup Tambah/Edit */}
            <UserFormPopup 
                isOpen={isPopupOpen || !!editUser} 
                onClose={() => { setIsPopupOpen(false); setEditUser(null); }} 
                user={editUser} 
                onSubmit={handleSaveUser} 
            />

            {/* Modal Konfirmasi Hapus */}
            {deleteUserId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4 text-center">Konfirmasi Hapus</h2>
                        <p className="text-center text-gray-700 mb-4">Apakah Anda yakin ingin menghapus pengguna ini?</p>
                        <div className="flex justify-center space-x-4">
                            <Button 
                                onClick={() => setDeleteUserId(null)} 
                                className="bg-[#928776] hover:bg-[#444e57] text-[#1f2023] px-4 py-2 rounded"
                            >
                                Batal
                            </Button>
                            <Button 
                                onClick={handleDelete} 
                                className="bg-[#784d1e] hover:bg-[#5a3516] text-white px-4 py-2 rounded"
                            >
                                Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withAuth(UserManagementPage, "admin"); // Hanya admin yang bisa akses
