"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookCard from "./BookCard";
import withAuth from "@/hoc/withAuth";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

function Peminjaman() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        // Fetch books with pagination
        const res = await fetch(
          `http://localhost:4000/book?search=${encodeURIComponent(searchTerm)}&page=${currentPage}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil data buku");

        const response = await res.json();
        setBooks(response.data || []);
        setTotalPages(response.totalPages || 1); // Update total pages
        router.replace(`?search=${encodeURIComponent(searchTerm)}&page=${currentPage}`); // Update URL with pagination
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchTerm, currentPage, router]); // Re-run effect on page change

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1); // Go to the next page
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1); // Go to the previous page
  };

  const handleBorrow = async () => {
    if (!selectedBook) return;

    try {
      const res = await fetch("http://localhost:4000/transactions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: selectedBook.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Gagal meminjam buku: ${errorData.message || "Terjadi kesalahan."}`);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      alert("📚 Buku berhasil dipinjam!");
      setShowConfirmPopup(false);
      setSelectedBook(null);
    } catch (error: any) {
      console.error("Terjadi kesalahan saat meminjam:", error);
      alert("Terjadi kesalahan saat meminjam: " + error.message);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Peminjaman Buku</h1>

      <button
        className="mb-4 px-4 py-2 bg-[#784d1e] text-white rounded hover:bg-[#5a3516] w-full sm:w-auto"
        onClick={() => router.push("/bukti-peminjaman")}
      >
        Lihat Bukti Peminjaman
      </button>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari buku"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#784d1e]"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onDetailClick={setSelectedBook} />
            ))}
          </div>
          <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
  >
    ← Sebelumnya
  </button>

  {currentPage > 3 && (
    <>
      <button
        onClick={() => setCurrentPage(1)}
        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
      >
        1
      </button>
      {currentPage > 4 && <span className="px-2">...</span>}
    </>
  )}

  {Array.from({ length: 5 })
    .map((_, i) => currentPage - 2 + i)
    .filter((p) => p > 0 && p <= totalPages)
    .map((p) => (
      <button
        key={p}
        onClick={() => setCurrentPage(p)}
        className={`px-3 py-1 text-sm rounded ${
          currentPage === p
            ? "bg-blue-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        {p}
      </button>
    ))}

  {currentPage < totalPages - 2 && (
    <>
      {currentPage < totalPages - 3 && <span className="px-2">...</span>}
      <button
        onClick={() => setCurrentPage(totalPages)}
        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
      >
        {totalPages}
      </button>
    </>
  )}

  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
  >
    Selanjutnya →
  </button>
</div>

        </>
      ) : (
        <p className="text-center text-gray-500">📚 Tidak ada buku ditemukan.</p>
      )}

      {/* Modal Detail Buku */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-[#784d1e] text-center">Detail Buku</h2>

            <img
              src={selectedBook.imageUrl || "/images/default-image.png"}
              alt={selectedBook.title || "Judul Buku"}
              className="w-1/2 h-auto mb-4 rounded-lg object-cover mx-auto"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
              <div><p className="font-semibold">Judul:</p><p>{selectedBook.title}</p></div>
              <div><p className="font-semibold">ISBN:</p><p>{selectedBook.isbn || "-"}</p></div>
              <div><p className="font-semibold">Edisi:</p><p>{selectedBook.edition || "-"}</p></div>
              <div><p className="font-semibold">Bahasa:</p><p>{selectedBook.language || "-"}</p></div>
              <div><p className="font-semibold">Penerbit:</p><p>{selectedBook.publisher || "-"}</p></div>
              <div><p className="font-semibold">Klasifikasi:</p><p>{selectedBook.classificationNumber || "-"}</p></div>
              <div><p className="font-semibold">Deskripsi:</p><p>{selectedBook.description || "-"}</p></div>
              <div><p className="font-semibold">Kategori:</p><p>{selectedBook.category || "-"}</p></div>
              <div><p className="font-semibold">Kondisi:</p><p>{selectedBook.condition || "-"}</p></div>
              <div><p className="font-semibold">Pengarang Utama:</p><p>{selectedBook.mainAuthor || "-"}</p></div>
              <div><p className="font-semibold">Tambahan:</p><p>{selectedBook.additionalAuthors || "-"}</p></div>
              <div><p className="font-semibold">Catatan:</p><p>{selectedBook.generalNotes || "-"}</p></div>
              <div><p className="font-semibold">Subyek:</p><p>{selectedBook.subject || "-"}</p></div>
              <div><p className="font-semibold">Digital:</p><p>{selectedBook.digitalContent || "-"}</p></div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => setSelectedBook(null)}
              >
                Tutup
              </button>

              {selectedBook.availability > 0 && !selectedBook.isBorrowed ? (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  onClick={() => setShowConfirmPopup(true)}
                >
                  Pinjam Buku
                </button>
              ) : (
                <span className="text-red-500 font-semibold">Buku sedang dipinjam</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Konfirmasi Peminjaman */}
      {showConfirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h2 className="text-xl font-bold mb-4 text-[#784d1e]">Konfirmasi Peminjaman</h2>
            <p>Yakin ingin meminjam buku ini?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => setShowConfirmPopup(false)}
              >
                Batal
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={handleBorrow}
              >
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
