function BookCard({ book, onDetailClick }: { 
  book: { 
    id: number; 
    title: string; 
    mainAuthor?: string; 
    availability: number; 
    imageUrl?: string; 
    status?: string; 
  };
  onDetailClick: (book: any) => void;
}) {
  let bookStatus = "Tersedia ✅";
  let statusColor = "text-green-600";

  if (book.status === "pending-pickup") {
    bookStatus = "Menunggu Pengambilan ⏳";
    statusColor = "text-yellow-500";
  } else if (book.status === "borrowed") {
    bookStatus = "Sedang Dipinjam ❌";
    statusColor = "text-red-500";
  } else if (book.availability <= 0) {
    bookStatus = "Tidak Tersedia 📕";
    statusColor = "text-gray-500";
  }

  return (
    <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-full p-4 items-center">
      <img 
        src={book.imageUrl || "/images/default-image.png"}
        alt={book.title}
        className="w-24 h-32 object-cover rounded-md"
      />
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
        <p className="text-gray-700">Pengarang Utama: {book.mainAuthor || "-"}</p>
        <p className={`mt-1 font-semibold ${statusColor}`}>{bookStatus}</p>

        {/* Tombol "Detail" */}
        <button
          className="mt-4 px-4 py-2 bg-[#784d1e] text-white rounded hover:bg-[#5a3516] w-full sm:w-auto"
          onClick={() => onDetailClick(book)}
        >
          Detail
        </button>
      </div>
    </div>
  );
}

export default BookCard;
