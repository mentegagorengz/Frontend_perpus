"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MajalahFormPopupProps {
  onClose: () => void;
  onSubmit: () => void;
  selectedItem?: any;
}

const MajalahFormPopup: React.FC<MajalahFormPopupProps> = ({ onClose, onSubmit, selectedItem }) => {
  const [form, setForm] = useState({
    title: selectedItem?.title || "",
    issn: selectedItem?.issn || "",
    code: selectedItem?.code || "",
    language: selectedItem?.language || "",
    city: selectedItem?.city || "",
    year: selectedItem?.year || "",
    frequency: selectedItem?.frequency || "",
    type: selectedItem?.type || "",
    subject: selectedItem?.subject || "",
    publisher: selectedItem?.publisher || "",
    edition: selectedItem?.edition || "",
    volume: selectedItem?.volume || "",
    availability: selectedItem?.availability || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!selectedItem?.id;

    try {
      const response = await fetch(`http://localhost:4000/majalah${isEdit ? `/${selectedItem.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Gagal menyimpan data");
      alert(`✅ Majalah berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`);
      onSubmit();
      onClose();
    } catch (err) {
      alert("❌ Gagal menyimpan: " + (err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X size={22} />
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {selectedItem ? "Edit Majalah" : "Tambah Majalah"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-sm">
          {Object.keys(form).map((key) => (
            <Input
              key={key}
              name={key}
              placeholder={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              value={(form as any)[key]}
              onChange={handleChange}
            />
          ))}

          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-200" onClick={onClose}>Batal</Button>
            <Button type="submit" className="bg-[#784d1e] hover:bg-[#5a3516] text-white">
              {selectedItem ? "Update" : "Tambah"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MajalahFormPopup;
