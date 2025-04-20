"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScanPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      async (decodedText) => {
        if (isProcessing) return;
        setIsProcessing(true);

        const transactionId = decodedText.trim();
        console.log("✅ QR Code terdeteksi:", transactionId);

        try {
          // Ambil data transaksi dulu untuk cek status
          const resDetail = await fetch(`http://localhost:4000/transactions/${transactionId}`, {
            credentials: "include",
          });

          if (!resDetail.ok) {
            alert("❌ Transaksi tidak ditemukan.");
            throw new Error("Transaksi tidak ditemukan");
          }

          const transaction = await resDetail.json();

          if (transaction.status === "pending-pickup") {
            // Konfirmasi peminjaman
            const confirmRes = await fetch(`http://localhost:4000/transactions/${transactionId}/pickup`, {
              method: "PATCH",
              credentials: "include",
            });
            if (confirmRes.ok) {
              alert("📚 Buku berhasil diambil!");
            } else {
              alert("❌ Gagal mengkonfirmasi pengambilan.");
            }
          } else if (transaction.status === "borrowed") {
            // Konfirmasi pengembalian
            const returnRes = await fetch(`http://localhost:4000/transactions/${transactionId}/return-qr`, {
              method: "PATCH",
              credentials: "include",
            });
            if (returnRes.ok) {
              alert("✅ Buku berhasil dikembalikan!");
            } else {
              alert("❌ Gagal mengkonfirmasi pengembalian.");
            }
          } else if (transaction.status === "returned") {
            alert("⚠️ Buku ini sudah dikembalikan sebelumnya.");
          } else {
            alert(`⚠️ Status transaksi tidak valid: ${transaction.status}`);
          }
        } catch (error) {
          console.error("❌ Error saat proses QR:", error);
        }

        setTimeout(() => setIsProcessing(false), 3000); // Debounce
      },
      (error) => {
        console.warn("QR scan error:", error);
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error("Gagal membersihkan scanner:", error);
      });
    };
  }, [isProcessing]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">📷 Scan QR Pengambilan & Pengembalian</h1>
      <div id="qr-reader" className="w-full max-w-md mx-auto" />
    </div>
  );
}
