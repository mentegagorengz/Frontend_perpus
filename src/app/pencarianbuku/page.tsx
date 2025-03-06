"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

const API_BASE_URL = "http://localhost:4000"; // Ganti dengan URL backend-mu

function SearchBooks() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStatusColor = (isBorrowed: boolean) => {
    return isBorrowed ? "text-red-500" : "";
  };

  const getBookStatus = (isBorrowed: boolean) => {
    return isBorrowed ? "Dipinjam" : "";
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchBooks();
    } else {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.category && book.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setBooks(filtered);
    }
  }, [searchTerm]);

  // 🔹 Ambil data buku dari backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) throw new Error("Gagal mengambil data buku");

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Pencarian Buku</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari buku..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#784d1e]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">📚 Memuat data...</p>
      ) : error ? (
        <p className="text-center text-red-500">❌ {error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length > 0 ? (
            books.map((book) => {
              const statusColor = getStatusColor(book.isBorrowed);
              const bookStatus = getBookStatus(book.isBorrowed);
              return (
                <div key={book.id} className="flex bg-white shadow-lg rounded-lg overflow-hidden w-full p-4 items-center">
                  {book.imageUrl ? (
                    <img src={book.imageUrl} alt={book.title} className="w-24 h-32 object-cover rounded-md" />
                  ) : (
                    <div className="w-24 h-32 bg-gray-300 rounded-md flex items-center justify-center text-gray-600">
                      Gambar Tidak Tersedia
                    </div>
                  )}
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
                    <p className="text-gray-700">Penulis: {book.author}</p>
                    <p className={`mt-1 font-semibold ${statusColor}`}>{bookStatus}</p>
                    {book.isBorrowed && <p className="mt-1 text-green-500 font-semibold">✔️ Berhasil Dipinjam</p>}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">📚 Tidak ada buku yang ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBooks;
