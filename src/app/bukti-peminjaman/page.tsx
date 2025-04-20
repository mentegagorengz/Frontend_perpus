"use client";

import { useState, useEffect } from "react";
import withAuth from "@/hoc/withAuth";
import React from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:4000";

function BuktiPeminjaman() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Gagal mengambil data peminjaman.");

      const data = await response.json();
      console.log("📦 Data transaksi:", data);
      setTransactions(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusLabel = (status: string) => {
    switch (status) {
      case "pending-pickup":
        return <span className="text-yellow-500">🕓 Belum Diambil</span>;
      case "borrowed":
        return <span className="text-blue-600">📖 Sedang Dipinjam</span>;
      case "returned":
        return <span className="text-green-600">✔️ Sudah Dikembalikan</span>;
      default:
        return <span className="text-gray-400">❔ Tidak diketahui</span>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-[#1f2023] mb-6">📜 Bukti Peminjaman</h1>
      <button
        onClick={() => router.push("/peminjaman")}
        className="mb-4 px-4 py-2 bg-[#784d1e] text-white rounded hover:bg-[#5a3516]"
      >
        Kembali ke Peminjaman
      </button>

      {loading && <p className="text-blue-500 text-center">Memuat data...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && transactions.length === 0 ? (
        <p className="text-center text-gray-600">📌 Belum ada peminjaman yang tercatat.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white shadow-md rounded-lg p-4 border">
              <h2 className="text-xl font-bold text-gray-900">{transaction.Book?.title || "-"}</h2>
              <p className="text-gray-700">
                <strong>Pengarang Utama:</strong> {transaction.Book?.mainAuthor || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Tanggal Peminjaman:</strong>{" "}
                {new Date(transaction.borrowDate).toLocaleDateString("id-ID")}
              </p>
              <p className="text-gray-700">
                <strong>Batas Pengembalian:</strong>{" "}
                {new Date(transaction.dueDate).toLocaleDateString("id-ID")}
              </p>

              <div className="mt-2">{renderStatusLabel(transaction.status)}</div>

              {(transaction.status === "pending-pickup" || transaction.status === "borrowed") &&
                transaction.qrCode && (
                  <div className="mt-4">
                    <img
                      src={transaction.qrCode}
                      alt="QR Code"
                      className="w-32 h-32 mx-auto border border-gray-300"
                    />
                    <p className="text-sm text-center text-gray-600 mt-1">
                      Tunjukkan QR ini ke petugas 📱
                    </p>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(BuktiPeminjaman, "user");
