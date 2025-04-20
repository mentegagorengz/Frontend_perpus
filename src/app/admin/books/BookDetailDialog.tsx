// components/BookDetailDialog.tsx
"use client";

import React from "react";
import { X } from "lucide-react";

interface Book {
  id: string;
  title: string;
  mainAuthor?: string;
  isbn?: string;
  subject?: string;
  category?: string;
  publisher?: string;
  language?: string;
  location?: string;
  availability: number;
  condition?: string;
  year?: number;
  pages?: number;
  source?: string;
  notes?: string;
  callNumber?: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  additionalAuthors?: string;
  totalCopies: number;
  bibliography?: string;
  classificationNumber?: string;
  digitalContent?: string;
  edition?: string;
  generalNotes?: string;
  remarks?: string;
}

interface BookDetailDialogProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
}

const BookDetailDialog: React.FC<BookDetailDialogProps> = ({ book, open, onClose }) => {
  if (!open || !book) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-slate-800">📘 Detail Informasi Buku</h2>

        <div className="grid grid-cols-2 gap-4 text-sm text-slate-800">
          <div><strong>Judul:</strong> {book.title}</div>
          <div><strong>Penulis:</strong> {book.mainAuthor || "-"}</div>
          <div><strong>Penulis Tambahan:</strong> {book.additionalAuthors || "-"}</div>
          <div><strong>ISBN:</strong> {book.isbn || "-"}</div>
          <div><strong>Kategori:</strong> {book.category || "-"}</div>
          <div><strong>Subyek:</strong> {book.subject || "-"}</div>
          <div><strong>Penerbit:</strong> {book.publisher || "-"}</div>
          <div><strong>Bahasa:</strong> {book.language || "-"}</div>
          <div><strong>Lokasi Rak:</strong> {book.location || "-"}</div>
          <div><strong>Stok:</strong> {book.availability} eksemplar</div>
          <div><strong>Total Salinan:</strong> {book.totalCopies}</div>
          <div><strong>Kondisi:</strong> {book.condition || "-"}</div>
          <div><strong>Tahun Terbit:</strong> {book.year || "-"}</div>
          <div><strong>Jumlah Halaman:</strong> {book.pages || "-"}</div>
          <div><strong>Nomor Panggil:</strong> {book.callNumber || "-"}</div>
          <div><strong>Klasifikasi:</strong> {book.classificationNumber || "-"}</div>
          <div><strong>Sumber:</strong> {book.source || "-"}</div>
          <div><strong>Bibliografi:</strong> {book.bibliography || "-"}</div>
          <div><strong>Catatan Umum:</strong> {book.generalNotes || "-"}</div>
          <div><strong>Konten Digital:</strong> {book.digitalContent || "-"}</div>
          <div><strong>Edisi:</strong> {book.edition || "-"}</div>
          <div><strong>Catatan:</strong> {book.notes || "-"}</div>
          <div><strong>Keterangan:</strong> {book.remarks || "-"}</div>
          <div><strong>Ditambahkan:</strong> {formatDate(book.createdAt)}</div>
        </div>

        {book.imageUrl && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-700 mb-1">Gambar Buku:</h3>
            <img
              src={book.imageUrl}
              alt="Book"
              className="w-full max-h-64 object-contain rounded-md border border-gray-200"
            />
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-700 mb-1">Deskripsi:</h3>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {book.description || "-"}
          </p>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailDialog;
