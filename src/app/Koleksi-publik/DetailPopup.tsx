import React from "react";
import Image from "next/image";

interface DetailPopupProps {
  item: any;
  type: "buku" | "penelitian" | "majalah";
  onClose: () => void;
}

const DetailPopup: React.FC<DetailPopupProps> = ({ item, type, onClose }) => {
  const renderField = (label: string, value?: string | number) => {
    if (!value) return null;
    return (
      <div className="flex text-sm sm:text-base">
        <span className="font-medium w-36 text-gray-700">{label}</span>
        <span className="text-gray-600">: {value}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4 py-8">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative overflow-y-auto max-h-[90vh] border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
        >
          ×
        </button>

        {/* Gambar & Judul */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src={item.imageUrl || "/images/default-image.png"}
            alt={item.title || "Gambar"}
            width={160}
            height={220}
            className="rounded-lg object-contain border"
          />
          <h2 className="text-xl sm:text-2xl font-bold text-center mt-4 text-gray-800">
            {item.title || "Tanpa Judul"}
          </h2>
          <span className="mt-2 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide font-medium">
            {type}
          </span>
        </div>

        {/* Informasi Metadata */}
        <div className="grid sm:grid-cols-2 gap-4 px-2 sm:px-4">
          {renderField("Penulis", item.mainAuthor || item.main_author)}
          {renderField("Penulis Tambahan", item.additionalAuthors || item.additional_author)}
          {renderField("Penerbit", item.publisher)}
          {renderField("Tahun", item.year || item.createdAt?.substring?.(0, 4))}
          {renderField("ISBN", item.isbn)}
          {renderField("ISSN", item.issn)}
          {renderField("Kategori", item.category || item.subject || item.type)}
          {renderField("No. Klasifikasi", item.classificationNumber || item.no_ddc)}
          {renderField("Lokasi", item.location)}
          {renderField("Bahasa", item.language)}
          {renderField("Deskripsi", item.description || item.body)}
          {renderField("Keterangan", item.generalNotes || item.notes || item.remarks)}
        </div>
      </div>
    </div>
  );
};

export default DetailPopup;
