"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, UploadCloud } from "lucide-react";

interface CSVUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

const CSVUploadDialog: React.FC<CSVUploadDialogProps> = ({ open, onClose, onUploaded }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return alert("Pilih file CSV terlebih dahulu!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await fetch("http://localhost:4000/book/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload CSV gagal");
      const result = await response.json();
      alert(`✅ ${result.message} (${result.jumlah} buku)`);

      onUploaded(); // refresh list
      onClose(); // tutup popup
    } catch (err) {
      alert("❌ Gagal upload CSV: " + (err as Error).message);
    } finally {
      setUploading(false);
      setSelectedFileName(null);
    }
  };

  const handleFileChange = () => {
    const file = fileRef.current?.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X size={22} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Upload Buku via CSV</h2>

        <div
          className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer mb-4"
          onClick={() => fileRef.current?.click()}
        >
          <UploadCloud size={36} className="mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Klik untuk pilih file CSV</p>
          <input
            type="file"
            accept=".csv"
            ref={fileRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {selectedFileName && (
          <div className="mb-3 text-sm text-gray-600 text-center">
            📄 File dipilih: <span className="font-medium text-gray-800">{selectedFileName}</span>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="text-gray-700 border-gray-400 hover:bg-gray-100">
            Batal
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || !selectedFileName}
            className="bg-[#784d1e] hover:bg-[#5a3516] text-white"
          >
            {uploading ? "Mengupload..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CSVUploadDialog;
