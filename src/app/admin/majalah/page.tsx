"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Trash, Search, Upload, Eye, Download } from "lucide-react";
import withAuth from "@/hoc/withAuth";
import MajalahFormPopup from "./MajalahFormPopup";
import CSVUploadDialog from "./CSVUploadDialog";
import MajalahDetailDialog from "./MajalahDetailDialog";

const API_BASE_URL = "http://localhost:4000/majalah";

const AdminMajalahPage = () => {
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showCSVDialog, setShowCSVDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const limit = 50;

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}?search=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${limit}`);
      const json = await res.json();
      setData(json.data);
      setTotalPages(json.totalPages);
    } catch (err) {
      alert("Gagal mengambil data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm("Apakah yakin ingin menghapus?");
    if (!confirmDelete) return;
    setDeletingId(id);
    try {
      await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      alert("Gagal menghapus");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Daftar Majalah</h3>
            <p className="text-sm text-gray-500">Overview of all magazines in the library.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => setShowPopup(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow">Tambah</Button>
            <Button onClick={() => setShowCSVDialog(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow">Upload CSV</Button>
            <Button onClick={() => window.open("/template_majalah.xlsx", "_blank")} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow">
              <Download size={16} className="mr-2" /> Template Excel
            </Button>
          </div>
        </div>

        <div className="relative">
          <input
            className="w-full max-w-md h-10 px-4 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cari Judul Majalah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">ISSN</th>
                <th className="px-4 py-3">Tahun</th>
                <th className="px-4 py-3">Kota</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-center text-gray-500">📰 Tidak ada majalah.</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{(currentPage - 1) * limit + index + 1}</td>
                    <td className="px-4 py-3">{item.title || "-"}</td>
                    <td className="px-4 py-3">{item.issn || "-"}</td>
                    <td className="px-4 py-3">{item.year || "-"}</td>
                    <td className="px-4 py-3">{item.city || "-"}</td>
                    <td className="px-4 py-3">{item.availability || "-"}</td>
                    <td className="px-4 py-3 flex justify-center space-x-2">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow w-9 h-9 flex items-center justify-center" onClick={() => { setSelectedItem(item); setShowDetail(true); }}>
                        <Eye size={16} />
                      </Button>
                      <Button className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg shadow w-9 h-9 flex items-center justify-center" onClick={() => deleteItem(item.id)} disabled={deletingId === item.id}>
                        {deletingId === item.id ? "..." : <Trash size={16} />}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">Halaman {currentPage} dari {totalPages}</div>
          <div className="flex space-x-2">
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg">Prev</Button>
            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg">Next</Button>
          </div>
        </div>
      </div>

      {showPopup && <MajalahFormPopup onClose={() => setShowPopup(false)} onSubmit={fetchData} />}
      {showCSVDialog && <CSVUploadDialog open={showCSVDialog} onClose={() => setShowCSVDialog(false)} onUploaded={fetchData} />}
      {showDetail && <MajalahDetailDialog open={showDetail} item={selectedItem} onClose={() => setShowDetail(false)} />}
    </div>
  );
};

export default dynamic(() => Promise.resolve(withAuth(AdminMajalahPage, "admin")), { ssr: false });
