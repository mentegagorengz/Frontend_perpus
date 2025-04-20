"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PenelitianDetailDialogProps {
  open: boolean;
  item: any;
  onClose: () => void;
}

const PenelitianDetailDialog: React.FC<PenelitianDetailDialogProps> = ({ open, item, onClose }) => {
  if (!open || !item) return null;

  const detailFields = [
    ["Judul", item.title],
    ["Penulis Utama", item.main_author],
    ["Penulis Tambahan", item.additional_author],
    ["Penulis Konferensi", item.additional_author_conference],
    ["Penulis Lain", item.additional_author_person],
    ["Deskripsi Fisik", item.physical_description],
    ["Jenis", item.type],
    ["Kata Kunci", item.keywords],
    ["Bahasa", item.language],
    ["Bibliografi", item.bibliography],
    ["Penerbit", item.publisher],
    ["Isi", item.body],
    ["Isi Tambahan", item.additional_body],
    ["Konten Digital", item.digital_content],
    ["Nomor Inventaris", item.inventory_number],
    ["Penyedia", item.provider],
    ["Lokasi", item.location],
    ["Status", item.availability],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X size={22} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-slate-800">📄 Detail Penelitian</h2>

        <div className="grid grid-cols-2 gap-4 text-sm text-slate-800">
          {detailFields.map(([label, value]) => (
            <div key={label}><strong>{label}:</strong> {value || "-"}</div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-700 mb-1">No DDC:</h3>
          <p className="text-sm text-slate-600 whitespace-pre-line">{item.no_ddc || "-"}</p>
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={onClose} variant="secondary">Tutup</Button>
        </div>
      </div>
    </div>
  );
};

export default PenelitianDetailDialog;
