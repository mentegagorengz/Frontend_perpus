// components/BookFormPopup.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface BookFormProps {
  onClose: () => void;
  onSubmit: () => void;
  selectedBook?: any;
}

const BookFormPopup: React.FC<BookFormProps> = ({ onClose, onSubmit, selectedBook }) => {
  const [form, setForm] = useState({
    title: selectedBook?.title || "",
    isbn: selectedBook?.isbn || "",
    imageUrl: selectedBook?.imageUrl || "",
    mainAuthor: selectedBook?.mainAuthor || "",
    additionalAuthors: selectedBook?.additionalAuthors || "",
    publisher: selectedBook?.publisher || "",
    category: selectedBook?.category || "",
    subject: selectedBook?.subject || "",
    classificationNumber: selectedBook?.classificationNumber || "",
    bibliography: selectedBook?.bibliography || "",
    generalNotes: selectedBook?.generalNotes || "",
    edition: selectedBook?.edition || "",
    description: selectedBook?.description || "",
    digitalContent: selectedBook?.digitalContent || "",
    language: selectedBook?.language || "",
    location: selectedBook?.location || "",
    condition: selectedBook?.condition || "Baik",
    availability: selectedBook?.availability?.toString() || "1",
    totalCopies: selectedBook?.totalCopies?.toString() || "1",
    year: selectedBook?.year?.toString() || "",
    remarks: selectedBook?.remarks || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = !!selectedBook?.id;

    const payload = {
      ...form,
      availability: Number(form.availability),
      totalCopies: Number(form.totalCopies),
      year: form.year ? Number(form.year) : null,
    };

    try {
      const response = await fetch(`http://localhost:4000/book${isEdit ? `/${selectedBook.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Gagal ${isEdit ? "mengupdate" : "menyimpan"} data buku`);

      alert(`✅ Buku berhasil ${isEdit ? "diperbarui" : "disimpan"}`);
      onSubmit();
      onClose();
    } catch (error) {
      alert("❌ " + (error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {selectedBook ? "Edit Buku" : "Tambah Buku"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-sm">
          <Input name="title" placeholder="Judul Buku" value={form.title} onChange={handleChange} required />
          <Input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
          <Input name="imageUrl" placeholder="Link Gambar (opsional)" value={form.imageUrl} onChange={handleChange} />
          <Input name="mainAuthor" placeholder="Penulis Utama" value={form.mainAuthor} onChange={handleChange} />
          <Input name="additionalAuthors" placeholder="Penulis Tambahan" value={form.additionalAuthors} onChange={handleChange} />
          <Input name="publisher" placeholder="Penerbit" value={form.publisher} onChange={handleChange} />
          <Input name="category" placeholder="Kategori" value={form.category} onChange={handleChange} />
          <Input name="subject" placeholder="Subyek" value={form.subject} onChange={handleChange} />
          <Input name="classificationNumber" placeholder="Nomor Klasifikasi" value={form.classificationNumber} onChange={handleChange} />
          <Input name="bibliography" placeholder="Bibliografi" value={form.bibliography} onChange={handleChange} />
          <Input name="edition" placeholder="Edisi" value={form.edition} onChange={handleChange} />
          <Input name="digitalContent" placeholder="Konten Digital" value={form.digitalContent} onChange={handleChange} />
          <Input name="language" placeholder="Bahasa" value={form.language} onChange={handleChange} />
          <Input name="location" placeholder="Lokasi" value={form.location} onChange={handleChange} />
          <Input name="availability" type="number" placeholder="Stok Tersedia" value={form.availability} onChange={handleChange} min="1" />
          <Input name="totalCopies" type="number" placeholder="Total Salinan" value={form.totalCopies} onChange={handleChange} min="1" />
          <Input name="year" type="number" placeholder="Tahun Terbit" value={form.year} onChange={handleChange} min="0" />

          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="col-span-2 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#784d1e]"
          >
            <option value="">Pilih Kondisi Buku</option>
            <option value="Baik">Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
            <option value="Hilang">Hilang</option>
          </select>

          <textarea
            name="generalNotes"
            placeholder="Catatan Umum"
            value={form.generalNotes}
            onChange={handleChange}
            className="col-span-2 w-full border border-gray-300 rounded px-3 py-2 resize-none min-h-[80px]"
          />

          <textarea
            name="remarks"
            placeholder="Keterangan / Catatan"
            value={form.remarks}
            onChange={handleChange}
            className="col-span-2 w-full border border-gray-300 rounded px-3 py-2 resize-none min-h-[60px]"
          />

          <textarea
            name="description"
            placeholder="Deskripsi"
            value={form.description}
            onChange={handleChange}
            className="col-span-2 w-full border border-gray-300 rounded px-3 py-2 resize-none min-h-[100px]"
          />

          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-gray-400 text-gray-700 hover:bg-gray-200"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button type="submit" className="bg-[#784d1e] hover:bg-[#5a3516] text-white">
              {selectedBook ? "Update" : "Tambah"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormPopup;
