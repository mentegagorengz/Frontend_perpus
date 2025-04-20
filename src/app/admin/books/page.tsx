"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Trash, Search, Upload, Eye, Plus, Pencil, Download } from "lucide-react";
import withAuth from "@/hoc/withAuth";
import BookFormPopup from "./BookFormPopup";
import CSVUploadDialog from "./CSVUploadDialog";
import BookDetailDialog from "./BookDetailDialog";
import { Button as MTButton, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:4000/book";

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showCSVDialog, setShowCSVDialog] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const limit = 10;

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}?search=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${limit}`);
      const json = await res.json();
      setBooks(json.data);
      setTotalPages(json.totalPages);
    } catch {
      alert("Gagal mengambil data buku");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, currentPage]);

  const deleteBook = async (id: string) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;
    setDeletingBookId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      fetchBooks();
    } catch {
      alert("Gagal menghapus buku");
    } finally {
      setDeletingBookId(null);
    }
  };

  const getItemProps = (index: number) => ({
    variant: currentPage === index ? "filled" : "text",
    color: "gray",
    onClick: () => setCurrentPage(index),
  });

  const next = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-lg">
      <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Daftar Buku</h3>
          <p className="text-slate-500">Tabel ringkas koleksi buku.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={() => setShowPopup(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow flex gap-2">
            <Plus size={18} /> Tambah Buku
          </Button>
          <Button onClick={() => setShowCSVDialog(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow flex gap-2">
            <Upload size={18} /> Upload CSV
          </Button>
          <Button onClick={() => window.open('/template_buku.xlsx', '_blank')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex gap-2">
            <Download size={16} /> Template
          </Button>
          <div className="ml-3 w-full max-w-sm min-w-[200px] relative">
            <input
              className="bg-white w-full pr-10 h-10 pl-3 py-2 placeholder:text-slate-400 text-sm border border-slate-200 rounded focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
              placeholder="Cari buku..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-2 top-2.5 w-5 h-5 text-slate-500" type="button">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-sm text-slate-500">No</th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-sm text-slate-500">Judul</th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-sm text-slate-500">Penulis</th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-sm text-slate-500">Penerbit</th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-sm text-slate-500">Status</th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-sm text-slate-500 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center p-6 text-slate-500">Memuat data buku...</td></tr>
            ) : books.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-6 text-slate-500">Tidak ada data buku.</td></tr>
            ) : (
              books.map((book: any, idx: number) => (
                <tr key={book.id} className="hover:bg-slate-50 border-b border-slate-200">
                  <td className="p-4 py-5 font-medium text-sm">{(currentPage - 1) * limit + idx + 1}</td>
                  <td className="p-4 py-5 text-sm text-slate-700 max-w-xs truncate whitespace-nowrap overflow-hidden" title={book.title}>{book.title}</td>
                  <td className="p-4 py-5 text-sm text-slate-700">{book.mainAuthor || "-"}</td>
                  <td className="p-4 py-5 text-sm text-slate-700">{book.publisher || "-"}</td>
                  <td className="p-4 py-5 text-sm text-slate-700">{book.availability > 0 ? "Tersedia" : "Habis"}</td>
                  <td className="p-4 py-5 text-center">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" className="bg-slate-600 hover:bg-slate-700 text-white p-2 rounded-md" onClick={() => { setSelectedBook(book); setShowDetail(true); }}>
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md" onClick={() => { setSelectedBook(book); setShowPopup(true); }}>
                        <Pencil size={16} />
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md" onClick={() => deleteBook(book.id)} disabled={deletingBookId === book.id}>
                        {deletingBookId === book.id ? "..." : <Trash size={16} />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center px-4 py-3">
          <div className="text-sm text-slate-500">
            Showing <b>{(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, books.length)}</b> of {books.length}
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              className="px-3 py-1 text-sm border rounded"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(currentPage - page) <= 2
                );
              })
              .map((page, idx, arr) => {
                const prev = arr[idx - 1];
                const showDots = prev && page - prev > 1;

                return (
                  <React.Fragment key={page}>
                    {showDots && <span className="px-2">...</span>}
                    <button
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === page
                          ? "bg-slate-800 text-white"
                          : "bg-white text-slate-600"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              className="px-3 py-1 text-sm border rounded"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showPopup && <BookFormPopup onClose={() => { setShowPopup(false); setSelectedBook(null); }} onSubmit={fetchBooks} selectedBook={selectedBook} />}
      {showCSVDialog && <CSVUploadDialog open={showCSVDialog} onClose={() => setShowCSVDialog(false)} onUploaded={fetchBooks} />}
      {showDetail && <BookDetailDialog open={showDetail} book={selectedBook} onClose={() => setShowDetail(false)} />}
    </div>
  );
};

export default dynamic(() => Promise.resolve(withAuth(AdminBooksPage, "admin")), { ssr: false });
