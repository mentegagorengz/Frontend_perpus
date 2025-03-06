"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BookCard from "./BookCard";
import withAuth from "@/hoc/withAuth";

const API_BASE_URL = "http://localhost:4000";

function Peminjaman() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setBooks(books);
    } else {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setBooks(filtered);
    }
  }, [searchTerm]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) throw new Error("Gagal mengambil data buku");

      const data = await response.json();

      // 🔹 Pastikan status "Menunggu Konfirmasi" jika `available === 1`
      const updatedBooks = data.map((book) => ({
        ...book,
        pendingTransaction: book.available === 1,
        isBorrowed: false, // Default status peminjaman
      }));

      setBooks(updatedBooks);
    } catch (error) {
      console.error("❌ Error saat mengambil buku:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!selectedBook) return;

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Anda harus login untuk meminjam buku.");
      router.push("/login");
      return;
    }

    const userIdInt = parseInt(userId, 10);

    if (isNaN(userIdInt)) {
      alert("Terjadi kesalahan: userId tidak valid.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/transactions/borrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: userIdInt, bookId: selectedBook.id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal meminjam buku");

      alert("Buku berhasil dipinjam dan menunggu konfirmasi admin.");
      setBorrowSuccess(true);
      setShowConfirmPopup(false);

      await fetchBooks(); // 🔄 Refresh daftar buku agar status diperbarui
      setSelectedBook(null);
    } catch (error) {
      console.error("❌ Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Peminjaman Buku</h1>
      <button 
        className="mb-4 px-4 py-2 bg-[#784d1e] text-white rounded hover:bg-[#5a3516] w-full sm:w-auto"
        onClick={() => router.push('/bukti-peminjaman')}
      >
        Lihat Bukti Peminjaman
      </button>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari buku "
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#784d1e]"
          value={searchTerm}
          onChange={(e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.trim() === "") {
          fetchBooks();
        }
          }}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">📚 Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard key={book.id} book={book} onDetailClick={setSelectedBook} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">📚 Tidak ada buku yang ditemukan.</p>
          )}
        </div>
      )}

      {/* Pop-up Detail Buku */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <img src={selectedBook.imageUrl ? selectedBook.imageUrl : '/images/default-image.png'} alt={selectedBook.title} className="w-full h-auto mb-4 rounded-lg" />
            <p className="text-gray-700">Penulis: {selectedBook.author}</p>
            <p className="text-gray-700">Status: {selectedBook.available === 2 ? "Tersedia ✅" : selectedBook.available === 1 ? "Menunggu Konfirmasi ⏳" : "Sedang Dipinjam ❌"}</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400" onClick={() => setSelectedBook(null)}>
                Tutup
              </button>
              {selectedBook.available === 2 && (
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={() => setShowConfirmPopup(true)}>
                  Pinjam
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h2 className="text-xl font-bold mb-4 text-[#784d1e]">Konfirmasi Peminjaman</h2>
            <p>Apakah Anda yakin ingin meminjam buku ini?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={() => setShowConfirmPopup(false)}>
                Batal
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleBorrow}>
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(Peminjaman, "user");
