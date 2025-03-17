"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash, Search } from "lucide-react";
import BookFormPopup from "./BookFormPopup";
import withAuth from "@/hoc/withAuth"; // Import HOC proteksi

const API_BASE_URL = "http://localhost:4000/books";

const AdminBooksPage = () => {
    const [books, setBooks] = useState(null); // Set null sebagai status awal
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error("Gagal mengambil data buku");
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const deleteBook = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error("Gagal menghapus buku");
            fetchBooks(); // Refresh the book list after deletion
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Daftar Buku</h1>
            <div className="flex justify-between items-center mb-4">
                <Button 
                    className="bg-[#784d1e] hover:bg-[#5a3516] text-white py-2 px-4 rounded-lg shadow-md"
                    onClick={() => setShowPopup(true)}
                >
                    + Tambah Buku
                </Button>
                <div className="relative">
                    <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 border rounded-lg" />
                    <Search className="absolute left-3 top-2 text-gray-500" size={16} />
                </div>
            </div>
            
            {/* Pastikan tabel tidak ditampilkan sebelum data tersedia */}
            {books ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <Table className="w-full text-left">
                        <TableHeader className="bg-[#928776] text-[#1f2023]">
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Penulis</TableHead>
                                <TableHead>ISBN</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {books.map((book, index) => (
                                <TableRow key={book.id || index} className="hover:bg-gray-50">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.isbn || "-"}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${book.available > 0 ? 'bg-[#784d1e] text-white' : 'bg-gray-500 text-white'}`}>
                                            {book.available > 0 ? 'Tersedia' : 'Habis'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="flex gap-3 justify-center">
                                        {/* <Button className="bg-[#784d1e] hover:bg-[#5a3516] text-white p-2 rounded-lg shadow flex items-center justify-center w-10 h-10">
                                            <Pencil size={18} />
                                        </Button> */}
                                        <Button 
                                            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg shadow flex items-center justify-center w-10 h-10"
                                            onClick={() => deleteBook(book.id)}
                                        >
                                            <Trash size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="text-center text-gray-500">Memuat data buku...</p>
            )}

            {showPopup && <BookFormPopup onClose={() => setShowPopup(false)} onSubmit={fetchBooks} />}
        </div>
    );
};

// Menonaktifkan SSR agar error tidak terjadi
export default dynamic(() => Promise.resolve(withAuth(AdminBooksPage, "admin")), { ssr: false });
