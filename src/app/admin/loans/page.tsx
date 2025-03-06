"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import withAuth from "@/hoc/withAuth";
import * as XLSX from "xlsx"; // 📌 Untuk Export Excel

const API_BASE_URL = "http://localhost:4000/transactions"; // Sesuaikan dengan backend

const BorrowingHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
    checkAdminRole();
  }, []);

  // ✅ Utility function to decode token
  const decodeToken = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Gagal membaca token:", error);
      return null;
    }
  };

  // ✅ Cek apakah user adalah admin dari token
  const checkAdminRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decodedToken = decodeToken(token);
    if (decodedToken) {
      setIsAdmin(decodedToken.role === "admin");
    }
  };

  // ✅ Fetch data histori peminjaman dari backend
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login untuk melihat histori peminjaman.");

      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil data histori peminjaman");

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fungsi API Helper untuk PATCH request
  const handleTransactionAction = async (transactionId: number, action: string, successMessage: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login sebagai admin untuk melakukan tindakan ini.");
  
      console.log(`🔍 Mengirim request: ${API_BASE_URL}/${action}/${transactionId}`);
  
      const response = await fetch(`${API_BASE_URL}/${action}/${transactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error dari server:", errorData);
        throw new Error(errorData.message || `Gagal melakukan aksi: ${action}`);
      }
  
      alert(successMessage);
      fetchHistory(); // 🔄 Refresh data histori peminjaman
      fetchBooks(); // 🔄 Refresh daftar buku agar stok diperbarui
    } catch (error) {
      console.error("❌ Gagal melakukan aksi:", error);
      alert(error.message);
    }
  };  

  // ✅ Fungsi Export Laporan ke Excel
  const exportToExcel = () => {
    if (history.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const formattedData = history.map((transaction) => ({
      "Nama Peminjam": transaction.User?.nama || "Tidak tersedia",
      "Judul Buku": transaction.Book?.title || "Tidak tersedia",
      "Tanggal Peminjaman": new Date(transaction.borrowDate).toLocaleDateString("id-ID"),
      "Status": transaction.status === "pending"
        ? "Menunggu Konfirmasi"
        : transaction.status === "borrowed"
        ? "Sedang Dipinjam"
        : "Dikembalikan",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Peminjaman");
    XLSX.writeFile(workbook, `Laporan_Peminjaman.xlsx`);
  };

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login untuk melihat daftar buku.");
  
      const response = await fetch("http://localhost:4000/books", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Gagal mengambil data buku");
  
      const data = await response.json();
      // Assuming you have a state to set the books data
      // setBooks(data);
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-6xl shadow-lg rounded-lg bg-white p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">📜 Histori Peminjaman Buku</h1>

        {loading && <p className="text-blue-500 text-center">Memuat data...</p>}
        {error && <p className="text-center">{error}</p>}

        {/* 🔹 Tombol Export Excel */}
        <div className="flex justify-end mb-4">
          <Button className="bg-[#784d1e] text-white px-3 py-2 rounded-md" onClick={exportToExcel}>
            📥 Download Laporan Excel
          </Button>
        </div>

        {/* 🔹 Tabel Histori Peminjaman */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead>Nama Peminjam</TableHead>
              <TableHead>Judul Buku</TableHead>
              <TableHead>Tanggal Peminjaman</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length > 0 ? (
              history.map((transaction: any) => (
                <TableRow key={transaction.id} className="hover:bg-gray-100 transition">
                  <TableCell>{transaction.User?.nama || "Tidak tersedia"}</TableCell>
                  <TableCell>{transaction.Book?.title || "Tidak tersedia"}</TableCell>
                  <TableCell>{new Date(transaction.borrowDate).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-white ${transaction.status === "pending"
                      ? "bg-gray-500"
                      : transaction.status === "borrowed"
                      ? "bg-yellow-500"
                      : "bg-green-500"}`}>
                      {transaction.status === "pending"
                        ? "Menunggu Konfirmasi"
                        : transaction.status === "borrowed"
                        ? "Sedang Dipinjam"
                        : "Dikembalikan"}
                    </span>
                  </TableCell>
                  <TableCell>
                  {isAdmin && transaction.status === "pending" && (
                    <Button
                      className="bg-[#784d1e] text-white px-3 py-1 rounded-md hover:bg-[#5a3516]"
                      onClick={() => handleTransactionAction(transaction.id, "confirm", "Peminjaman telah dikonfirmasi!")}
                    >
                      Konfirmasi Peminjaman
                    </Button>
                  )}

                  {isAdmin && transaction.status === "borrowed" && (
                    <Button
                      className="bg-[#784d1e] text-white px-3 py-1 rounded-md hover:bg-[#5a3516] ml-2"
                      onClick={() => handleTransactionAction(transaction.id, "complete", "Peminjaman telah diselesaikan!")}
                    >
                      Selesaikan Peminjaman
                    </Button>
                  )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Tidak ada data peminjaman
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default withAuth(BorrowingHistoryPage, "admin");
