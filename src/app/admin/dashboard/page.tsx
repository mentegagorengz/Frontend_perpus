"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, ListChecks, Bell } from "lucide-react";
import { Bar } from "react-chartjs-2";
import withAuth from "@/hoc/withAuth";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const USERS_API_URL = "http://localhost:4000/users";
const BOOKS_API_URL = "http://localhost:4000/books";
const TRANSACTIONS_API_URL = "http://localhost:4000/transactions";

const AdminDashboard = () => {
  const [userRoles, setUserRoles] = useState({ admins: 0, users: 0 });
  const [books, setBooks] = useState({ totalBooks: 0, availableBooks: 0, borrowedBooks: 0 });
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState(null);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [dailyData, setDailyData] = useState({ labels: [], data: [] });
  const [monthlyData, setMonthlyData] = useState({ labels: [], data: [] });
  const [yearlyData, setYearlyData] = useState({ labels: [], data: [] });
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  useEffect(() => {
    fetchUserRoles();
    fetchBooks();
    fetchTransactions();
    fetchDailyReport();
    fetchMonthlyReport();
    fetchYearlyReport();

    const interval = setInterval(() => {
      fetchTransactions(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchUserRoles = async () => {
    try {
      const response = await fetch(USERS_API_URL);
      if (!response.ok) throw new Error("Gagal mengambil data pengguna");
      const data = await response.json();

      const admins = data.filter(user => user.role === "admin").length;
      const users = data.filter(user => user.role === "user").length;

      setUserRoles({ admins, users });
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(BOOKS_API_URL);
      if (!response.ok) throw new Error("Gagal mengambil data buku");
      const data = await response.json();

      const totalBooks = data.length;
      const availableBooks = data.filter(book => book.available > 0).length;
      const borrowedBooks = totalBooks - availableBooks;

      setBooks({ totalBooks, availableBooks, borrowedBooks });
    } catch (error) {
      console.error("Error fetching books data:", error);
      setError("Gagal mengambil data buku");
    }
  };

  const fetchTransactions = async (isPolling = false) => {
    try {
      const response = await fetch(TRANSACTIONS_API_URL);
      if (!response.ok) throw new Error("Gagal mengambil data transaksi");
      const data = await response.json();
      
      const totalBorrowed = data.length;
      setTotalBorrowed(totalBorrowed);

      if (isPolling && data.length > 0 && transactions.length > 0) {
        const latestTransaction = data[0];
        if (latestTransaction.id !== transactions[0].id) {
          setNewTransaction(latestTransaction);
        }
      }

      setTransactions(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchDailyReport = async () => {
    try {
      const response = await fetch(`${TRANSACTIONS_API_URL}/report/daily`);
      if (!response.ok) throw new Error("Gagal mengambil laporan harian");
      const data = await response.json();

      const labels = data.map(item => item.date);
      const borrowCounts = data.map(item => item.borrow_count);

      setDailyData({ labels, data: borrowCounts });
    } catch (error) {
      console.error("Error fetching daily report:", error);
    }
  };

  const fetchMonthlyReport = async () => {
    try {
      const response = await fetch(`${TRANSACTIONS_API_URL}/report/monthly`);
      if (!response.ok) throw new Error("Gagal mengambil laporan bulanan");
      const data = await response.json();

      const labels = data.map(item => item.month);
      const borrowCounts = data.map(item => item.borrow_count);

      setMonthlyData({ labels, data: borrowCounts });
    } catch (error) {
      console.error("Error fetching monthly report:", error);
    }
  };

  const fetchYearlyReport = async () => {
    try {
      const response = await fetch(`${TRANSACTIONS_API_URL}/report/yearly`);
      if (!response.ok) throw new Error("Gagal mengambil laporan tahunan");
      const data = await response.json();

      const labels = data.map(item => item.year);
      const borrowCounts = data.map(item => item.borrow_count);

      setYearlyData({ labels, data: borrowCounts });
    } catch (error) {
      console.error("Error fetching yearly report:", error);
    }
  };

  const getChartData = () => {
    switch (selectedPeriod) {
      case "daily":
        return dailyData;
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
      default:
        return dailyData;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <DashboardCard 
          title="Anggota Terdaftar" 
          count={`${userRoles.users} User | ${userRoles.admins} Admin`} 
          icon={<Users size={28} />} 
          color="bg-blue-500 text-white" 
        />
        <DashboardCard 
          title="Buku Tersedia" 
          count={books.availableBooks} 
          icon={<BookOpen size={28} />} 
          color="bg-blue-500 text-white" 
        />
        <DashboardCard 
          title="Buku Dipinjam" 
          count={books.borrowedBooks} 
          icon={<CheckCircle size={28} />} 
          color="bg-blue-500 text-white" 
        />
        <DashboardCard 
          title="Total Buku" 
          count={books.totalBooks} 
          icon={<ListChecks size={28} />} 
          color="bg-blue-500 text-white" 
        />
        <DashboardCard 
          title="Total Peminjaman" 
          count={totalBorrowed} 
          icon={<CheckCircle size={28} />} 
          color="bg-blue-500 text-white" 
        />
      </div>

      {/* Diagram Statistik */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Statistik Peminjaman</h3>
        <div className="mb-4">
          <button 
            className={`mr-2 px-4 py-2 rounded ${selectedPeriod === "daily" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
            onClick={() => setSelectedPeriod("daily")}
          >
            Harian
          </button>
          <button 
            className={`mr-2 px-4 py-2 rounded ${selectedPeriod === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
            onClick={() => setSelectedPeriod("monthly")}
          >
            Bulanan
          </button>
          <button 
            className={`px-4 py-2 rounded ${selectedPeriod === "yearly" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
            onClick={() => setSelectedPeriod("yearly")}
          >
            Tahunan
          </button>
        </div>
        <Bar
          data={{
            labels: getChartData().labels,
            datasets: [
              {
                label: 'Jumlah Peminjaman',
                data: getChartData().data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: `Statistik Peminjaman ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}`,
              },
            },
          }}
        />
      </div>

      {/* Row Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kotak Selamat Datang */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Halo Admin</h3>
          <p className="text-gray-600">Selamat Datang di admin Perpustakaan UNSRAT</p>
        </div>

        {/* Notifikasi Peminjaman */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-gray-800 text-white p-2 rounded-md text-center font-bold flex items-center justify-center">
            <Bell size={20} className="mr-2" /> NOTIFIKASI
          </div>
          <div className="p-4">
            {newTransaction && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded-md mb-3 animate-pulse">
                <p className="text-yellow-800 font-bold">Peminjaman Baru!</p>
                <p className="text-yellow-700">{newTransaction.user} meminjam "{newTransaction.book}"</p>
                <p className="text-yellow-600 text-sm">{newTransaction.date} - {newTransaction.time}</p>
              </div>
            )}

            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <NotificationItem 
                    key={index} 
                    user={transaction.user} 
                    book={transaction.book} 
                    date={transaction.date} 
                    time={transaction.time}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">📢 Belum ada peminjaman terbaru.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Kartu Statistik
const DashboardCard = ({ title, count, icon, color }) => (
  <Card className={`p-6 ${color} text-center rounded-lg shadow-md flex flex-col items-center transform transition-transform duration-200 hover:scale-105`}>
    <div className="mb-3">{icon}</div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-lg">{count}</p>
  </Card>
);

// Komponen Notifikasi Peminjaman
const NotificationItem = ({ user, book, date, time }) => (
  <div className="border-b pb-2 flex justify-between items-center">
    <div>
      <p className="text-gray-700 font-semibold">{user} meminjam "{book}"</p>
      <span className="text-gray-500 text-sm">{date} - {time}</span>
    </div>
  </div>
);

export default withAuth(AdminDashboard, 'admin');
