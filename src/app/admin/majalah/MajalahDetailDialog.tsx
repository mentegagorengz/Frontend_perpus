"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MajalahDetailDialogProps {
  open: boolean;
  item: any;
  onClose: () => void;
}

const MajalahDetailDialog: React.FC<MajalahDetailDialogProps> = ({ open, item, onClose }) => {
  if (!open || !item) return null;

  const detailFields = [
    ["Judul", item.title],
    ["ISSN", item.issn],
    ["Kode", item.code],
    ["Bahasa", item.language],
    ["Kota Terbit", item.city],
    ["Tahun", item.year],
    ["Frekuensi", item.frequency],
    ["Jenis", item.type],
    ["Subjek", item.subject],
    ["Penerbit", item.publisher],
    ["Edisi", item.edition],
    ["Volume", item.volume],
    ["Status", item.availability],
  ];

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
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X size={22} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-slate-800">📰 Detail Informasi Majalah</h2>

        <div className="grid grid-cols-2 gap-4 text-sm text-slate-800">
          {detailFields.map(([label, value]) => (
            <div key={label}><strong>{label}:</strong> {value || "-"}</div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-700 mb-1">Tanggal Ditambahkan:</h3>
          <p className="text-sm text-slate-600">{formatDate(item.createdAt)}</p>
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={onClose} variant="secondary">Tutup</Button>
        </div>
      </div>
    </div>
  );
};

export default MajalahDetailDialog;
