"use client";

import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import withAuth from "@/hoc/withAuth";
import * as XLSX from "xlsx";

const API_BASE_URL = "http://localhost:4000/transactions";

const BorrowingHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [elapsedTimes, setElapsedTimes] = useState({});

  useEffect(() => {
    fetchHistory();
    checkAdminRole();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTimes((prev) =>
        history.reduce((acc, t) => {
          if (t.status === "borrowed") {
            acc[t.id] = formatElapsedTime(t.borrowDate);
          }
          return acc;
        }, {})
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [history]);

  const formatElapsedTime = (startDate) => {
    const diffMs = new Date().getTime() - new Date(startDate).getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);
    return `${days > 0 ? `${days} hari ` : ""}${hours} jam ${minutes} menit ${seconds} detik`.trim();
  };

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const checkAdminRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      setIsAdmin(decodedToken?.role === "admin");
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(API_BASE_URL, { method: "GET", credentials: "include" });
      if (!response.ok) throw new Error("Gagal mengambil data histori peminjaman.");
      setHistory(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAction = async (transactionId, action, successMessage) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login sebagai admin.");
      const response = await fetch(`${API_BASE_URL}/${action}/${transactionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error((await response.json()).message || "Gagal melakukan aksi.");
      alert(successMessage);
      fetchHistory();
    } catch (err) {
      alert(err.message);
    }
  };

  const exportToExcel = () => {
    if (!history.length) return alert("Tidak ada data untuk diekspor.");
    const formattedData = history.map((t) => ({
      "Nama Peminjam": t.User?.nama || "-",
      "Judul Buku": t.Book?.title || "-",
      "Tanggal Peminjaman": new Date(t.borrowDate).toLocaleDateString("id-ID"),
      "Batas Pengembalian": new Date(t.dueDate).toLocaleDateString("id-ID"),
      "Tanggal Kembali": t.returnDate ? new Date(t.returnDate).toLocaleDateString("id-ID") : "-",
      "Status": t.status === "pending" ? "Menunggu Konfirmasi"
        : t.status === "borrowed" ? "Sedang Dipinjam" : "Dikembalikan",
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Peminjaman");
    XLSX.writeFile(workbook, `Laporan_Peminjaman.xlsx`);
  };

  const isOverdue = (transaction) => transaction.status === "borrowed" && new Date(transaction.dueDate) < new Date();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Histori Peminjaman Buku</h3>
          <p className="text-slate-500">Overview of the current borrowing activities.</p>
        </div>
        <input
          className="bg-white w-full max-w-sm h-10 px-3 py-2 border rounded shadow-sm"
          placeholder="Search for transactions..."
        />
      </div>

      <div className="relative flex flex-col w-full h-full overflow-scroll bg-white shadow-md rounded-lg">
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              {["Nama", "Judul Buku", "Tgl Pinjam", "Jatuh Tempo", "Pengembalian", "Status", "Durasi Dipinjam", "Status Keterlambatan", "Aksi"].map((header) => (
                <th key={header} className="p-2 border-b bg-slate-50 text-xs font-normal text-slate-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.length ? history.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-slate-50 border-b">
                <td className="p-2 text-xs text-slate-800">{transaction.User?.fullName || "-"}</td>
                <td className="p-2 text-xs text-slate-500">{transaction.Book?.title || "-"}</td>
                <td className="p-2 text-xs text-slate-500">{new Date(transaction.borrowDate).toLocaleDateString("id-ID")}</td>
                <td className="p-2 text-xs text-slate-500">{new Date(transaction.dueDate).toLocaleDateString("id-ID")}</td>
                <td className="p-2 text-xs text-slate-500">{transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString("id-ID") : "-"}</td>
                <td className="p-2">
                  <span className={`inline-block px-2 py-1 rounded text-white text-xs ${
                    transaction.status === "pending-pickup" ? "bg-yellow-500"
                      : transaction.status === "borrowed" ? "bg-blue-600"
                      : transaction.status === "returned" ? "bg-green-600" : "bg-gray-500"
                  }`}>
                    {transaction.status === "pending-pickup" ? "Menunggu Pengambilan"
                      : transaction.status === "borrowed" ? "Sedang Dipinjam"
                      : transaction.status === "returned" ? "Sudah Dikembalikan" : "Tidak Diketahui"}
                  </span>
                </td>
                <td className="p-2 text-xs text-slate-500">{elapsedTimes[transaction.id] || "-"}</td>
                <td className="p-2 text-xs">
                  {isOverdue(transaction) ? <span className="text-red-600 font-semibold">Lewat Batas</span> : "-"}
                </td>
                <td className="p-2 space-y-1">
                  {isAdmin && transaction.status === "pending-pickup" && (
                    <>
                      <Button className="bg-blue-600 text-white px-3 py-1 text-xs rounded-md" onClick={() => handleTransactionAction(transaction.id, "pickup", "📦 Buku berhasil diambil oleh peminjam.")}>
                        Konfirmasi Ambil
                      </Button>
                      <Button className="bg-blue-400 text-white px-3 py-1 text-xs rounded-md" onClick={() => handleTransactionAction(transaction.id, "confirm", "📦 Buku berhasil diambil (QR).")}>
                        Scan QR Ambil
                      </Button>
                    </>
                  )}
                  {isAdmin && transaction.status === "borrowed" && (
                    <>
                      <Button className="bg-green-600 text-white px-3 py-1 text-xs rounded-md" onClick={() => handleTransactionAction(transaction.id, "return-qr", "📘 Buku berhasil dikembalikan (QR).")}>
                        Scan QR Kembali
                      </Button>
                      <Button className="bg-green-500 text-white px-3 py-1 text-xs rounded-md" onClick={() => handleTransactionAction(transaction.id, "return", "📘 Pengembalian buku dikonfirmasi manual.")}>
                        Konfirmasi Kembali
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={9} className="text-center py-2 text-gray-500 border">Tidak ada data peminjaman.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(BorrowingHistoryPage, "admin");
