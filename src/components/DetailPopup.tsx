import React from "react";
import Image from "next/image";

interface DetailPopupProps {
  item: any;
  type: string;
  onClose: () => void;
}

const DetailPopup: React.FC<DetailPopupProps> = ({ item, type, onClose }) => {
  const renderField = (label: string, value?: string | number) => {
    if (!value) return null;
    return (
      <p className="text-sm text-gray-600">
        <strong>{label}:</strong> {value}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-lg font-bold"
        >
          ✕
        </button>

        <div className="text-center">
          <Image
            src={item.imageUrl || "/images/default-image.png"}
            alt={item.title || "Gambar"}
            width={160}
            height={200}
            className="mx-auto mb-4 object-contain"
          />
          <h2 className="text-xl font-bold mb-2">{item.title || "Tanpa Judul"}</h2>
          <div className="text-left space-y-1">
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
          <div className="mt-4">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
              {type.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPopup;
