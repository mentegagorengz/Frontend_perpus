"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, UploadCloud } from "lucide-react";

interface BookFormProps {
  onClose: () => void;
  onSubmit: (formData: any) => void;
  selectedBook?: any;
}

const categories = ["Fiksi", "Non-Fiksi", "Sains", "Teknologi", "Sejarah", "Biografi", "Lainnya"];

const BookFormPopup: React.FC<BookFormProps> = ({ onClose, onSubmit, selectedBook }) => {
  const [form, setForm] = useState({
    title: selectedBook?.title || "",
    author: selectedBook?.author || "",
    category: selectedBook?.category || "",
    isbn: selectedBook?.isbn || "",
    available: selectedBook?.available?.toString() || "0",
    qrCode: selectedBook?.qrCode || "",
    imageUrl: selectedBook?.imageUrl || "",
  });
  const [imagePreview, setImagePreview] = useState(selectedBook?.imageUrl || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Tampilkan preview gambar
      setForm({ ...form, imageUrl: file }); // Simpan file untuk dikirim ke backend
    }
  };

  const handleClickUpload = () => {
    document.getElementById("image-upload")?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("isbn", form.isbn);

    // 🔹 Jangan mengirim category, karena tidak ada di backend
    // formData.append("category", form.category);

    if (form.imageUrl instanceof File) {
      formData.append("image", form.imageUrl);
    }

    try {
      const response = await fetch("http://localhost:4000/books/add", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("✅ Buku berhasil ditambahkan:", data);
      onClose(); // Tutup popup setelah sukses
    } catch (error) {
      console.error("❌ Gagal menambahkan buku:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-900">
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{selectedBook ? "Edit Buku" : "Tambah Buku"}</h2>
        <div 
          className="mb-4 border-dashed border-2 border-[#444e57] rounded-lg p-4 text-center cursor-pointer" 
          onClick={handleClickUpload}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2" />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <UploadCloud size={40} />
              <p className="mt-2 text-sm">Klik atau seret untuk upload gambar</p>
            </div>
          )}
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input type="text" name="title" placeholder="Judul Buku" value={form.title} onChange={handleChange} required />
          <Input type="text" name="author" placeholder="Penulis" value={form.author} onChange={handleChange} required />
          <Input type="text" name="isbn" placeholder="ISBN (Opsional)" value={form.isbn} onChange={handleChange} />
          <div className="flex justify-end space-x-4 mt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-[#444e57] text-[#1f2023] hover:bg-[#928776]">
              Batal
            </Button>
            <Button type="submit" className="bg-[#784d1e] text-white hover:bg-[#5a3516]">
              {selectedBook ? "Update" : "Tambah"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormPopup;
