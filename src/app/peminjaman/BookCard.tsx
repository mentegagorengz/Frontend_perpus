function BookCard({ book, onDetailClick }: { 
  book: { id: number; title: string; author: string; available: number; imageUrl?: string; pendingTransaction?: boolean; isBorrowed?: boolean };
  onDetailClick: (book: any) => void;
}) {
  let bookStatus = "Tersedia ✅";
  let statusColor = "text-green-600";

  if (book.available === 1) {
    bookStatus = "Menunggu Konfirmasi ⏳";
    statusColor = "text-yellow-500";
  } else if (book.available === 0) {
    bookStatus = "Sedang Dipinjam ❌";
    statusColor = "text-red-500";
  }

  return (
    <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-full p-4 items-center">
      {book.imageUrl ? (
        <img src={book.imageUrl} alt={book.title} className="w-24 h-32 object-cover rounded-md" />
      ) : (
        <img 
          src={book.imageUrl ? book.imageUrl : '/images/default-image.png'} // Gambar default
          alt={book.title}
          className="w-24 h-32 object-cover rounded-md"
        />
      )}
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
        <p className="text-gray-700">Penulis: {book.author}</p>
        <p className={`mt-1 font-semibold ${statusColor}`}>{bookStatus}</p>

        {book.isBorrowed && <p className="mt-1 text-green-500 font-semibold">✔️ Berhasil Dipinjam</p>}

        {/* Tombol "Detail" untuk membuka pop-up */}
        <button className="mt-4 px-4 py-2 bg-[#784d1e] text-white rounded hover:bg-[#5a3516] w-full sm:w-auto" onClick={() => onDetailClick(book)}>
          Detail
        </button>
      </div>
    </div>
  );
}

export default BookCard;
