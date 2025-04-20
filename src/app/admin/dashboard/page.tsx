"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, CheckCircle, ListChecks, Bell } from "lucide-react";
import { Bar } from "react-chartjs-2";
import withAuth from "@/hoc/withAuth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        setError("Gagal memuat data dashboard.");
      });
  }, []);

  if (!data) {
    return <div className="p-6">Memuat data dashboard...</div>;
  }

  const {
    stats,
    recentTransactions,
    popularBooks,
    overdueList
  } = data;

  const chartData = {
    labels: popularBooks.map((b) => b.title),
    datasets: [
      {
        label: "Jumlah Peminjaman",
        data: popularBooks.map((b) => b.borrowCount),
        backgroundColor: "rgba(59,130,246,0.6)",
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h2 className="text-3xl font-bold">Dashboard Admin</h2>
      {error && <div className="text-red-500">{error}</div>}

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Buku" count={stats.totalBooks} icon={<BookOpen size={28} />} />
        <DashboardCard title="Buku Dipinjam" count={stats.borrowedBooks} icon={<CheckCircle size={28} />} />
        <DashboardCard title="Buku Tersedia" count={stats.availableBooks} icon={<ListChecks size={28} />} />
        <DashboardCard title="Transaksi Hari Ini" count={stats.transactionsToday} icon={<Bell size={28} />} />
        <DashboardCard title="Total Transaksi" count={stats.totalTransactions} icon={<CheckCircle size={28} />} />
        <DashboardCard title="Jumlah Pengguna" count={stats.users} icon={<Users size={28} />} />
        <DashboardCard title="Jumlah Admin" count={stats.admins} icon={<Users size={28} />} />
      </div>

      {/* Grafik Populer */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Buku Paling Populer</h3>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>

      {/* 📂 Tombol Ekspor */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
          📤 Ekspor Data Laporan
        </h3>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <Button
            onClick={() =>
              window.open("http://localhost:4000/transactions/export/overdue", "_blank")
            }
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            📬 Ekspor Keterlambatan (Excel)
          </Button>
          <Button
            onClick={() =>
              window.open("http://localhost:4000/transactions/export/borrowed", "_blank")
            }
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            📚 Ekspor Buku Dipinjam (Excel)
          </Button>
          <Button
            onClick={() =>
              window.open("http://localhost:4000/transactions/export/all", "_blank")
            }
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            📑 Ekspor Semua Transaksi (Excel)
          </Button>
        </div>
      </div>

      {/* 📬 Daftar Keterlambatan */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-red-600 flex items-center">
          <Bell className="mr-2" /> Buku Belum Dikembalikan (Terlambat)
        </h3>

        {overdueList && overdueList.length > 0 ? (
          <ul className="space-y-3">
            {overdueList.map((item: any) => (
              <li
                key={item.id}
                className="border rounded p-3 bg-red-50 shadow-sm text-sm"
              >
                <div className="font-semibold text-red-800">
                  🔴 {item.userName} belum mengembalikan <em>“{item.bookTitle}”</em>
                </div>
                <div className="text-gray-600">
                  Jatuh tempo: {moment(item.dueDate).format("LL")} (
                  {moment(item.dueDate).fromNow()})
                </div>
                {item.emailSentAt && (
                  <div className="text-green-700 text-xs mt-1">
                    📧 Email dikirim: {moment(item.emailSentAt).fromNow()}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">✅ Semua buku telah dikembalikan tepat waktu.</p>
        )}
      </div>

      {/* Transaksi Terbaru */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Transaksi Terbaru</h3>
        <div className="space-y-2">
          {recentTransactions.length > 0 ? recentTransactions.map((tx: any) => (
            <div key={tx.id} className="border-b pb-2">
              📌 <strong>{tx.userName}</strong> meminjam <em>"{tx.bookTitle}"</em> — {moment(tx.date).fromNow()}
            </div>
          )) : <p className="text-gray-500">Tidak ada transaksi terbaru.</p>}
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({
  title,
  count,
  icon,
}: {
  title: string;
  count: number | string;
  icon: React.ReactNode;
}) => (
  <Card className="p-6 bg-white shadow rounded-lg flex items-center space-x-4">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{count}</p>
    </div>
  </Card>
);

export default withAuth(AdminDashboard, "admin");