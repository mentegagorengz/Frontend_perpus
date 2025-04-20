"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Trash, Search, Upload, Eye, Download } from "lucide-react";
import withAuth from "@/hoc/withAuth";
import PenelitianFormPopup from "./PenelitianFormPopup";
import CSVUploadDialog from "./CSVUploadDialog";
import PenelitianDetailDialog from "./PenelitianDetailDialog";

const API_BASE_URL = "http://localhost:4000/penelitian";

const AdminPenelitianPage = () => {
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
      <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Daftar Penelitian</h3>
          <p className="text-slate-500">Overview of the current research works.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={() => setShowPopup(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow">Tambah</Button>
          <Button onClick={() => setShowCSVDialog(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow">Upload CSV</Button>
          <Button onClick={() => window.open("/template_penelitian.xlsx", "_blank")} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow">
            <Download size={16} className="mr-2" /> Template excel
          </Button>
          <div className="ml-3">
            <div className="w-full max-w-sm min-w-[200px] relative">
              <input
                className="bg-white w-full pr-11 h-10 pl-3 py-2 placeholder:text-slate-400 text-sm border border-slate-200 rounded"
                placeholder="Cari Judul Penelitian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded">
                <Search className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Judul</th>
              <th className="p-4">Penulis</th>
              <th className="p-4">Penerbit</th>
              <th className="p-4">Jenis</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-500">📄 Tidak ada data.</td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50 border-b">
                  <td className="p-4">{(currentPage - 1) * limit + index + 1}</td>
                  <td className="p-4">{item.title || "-"}</td>
                  <td className="p-4">{item.main_author || "-"}</td>
                  <td className="p-4">{item.publisher || "-"}</td>
                  <td className="p-4">{item.type || "-"}</td>
                  <td className="p-4">{item.availability || "-"}</td>
                  <td className="p-4 flex gap-2 justify-center">
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

        <div className="flex justify-between items-center px-4 py-3">
          <div className="text-sm text-slate-500">Halaman {currentPage} dari {totalPages}</div>
          <div className="flex space-x-1">
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>
            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
          </div>
        </div>
      </div>

      {showPopup && <PenelitianFormPopup onClose={() => setShowPopup(false)} onSubmit={fetchData} />}
      {showCSVDialog && <CSVUploadDialog open={showCSVDialog} onClose={() => setShowCSVDialog(false)} onUploaded={fetchData} />}
      {showDetail && <PenelitianDetailDialog open={showDetail} item={selectedItem} onClose={() => setShowDetail(false)} />}
    </div>
  );
};

export default dynamic(() => Promise.resolve(withAuth(AdminPenelitianPage, "admin")), { ssr: false });
