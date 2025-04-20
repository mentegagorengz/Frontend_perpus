"use client";

import React, { useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog"; // Fixed import
import { Button } from "@/components/ui/button";

const CSVUploadDialog = ({ isOpen, onClose, onSuccess, uploadUrl }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!fileRef.current?.files?.length) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", fileRef.current.files[0]);

    await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Upload CSV Penelitian</h2>
      <input type="file" accept=".csv" ref={fileRef} className="mb-4" />
      <div className="text-right space-x-2">
        <Button variant="secondary" onClick={onClose}>Batal</Button>
        <Button disabled={loading} onClick={handleUpload}>
          {loading ? "Mengupload..." : "Upload"}
        </Button>
      </div>
    </Dialog>
  );
};

export default CSVUploadDialog;
