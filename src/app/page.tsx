"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import Image from "next/image";
import { useRouter } from "next/navigation";

const berita = [
  {
    id: 1,
    judul: "e-Journal Universitas Sam Ratulangi",
    kategori: "E-Journal Nasional",
    gambar: "/images/e-journal.png",
    link: "https://ejournal.unsrat.ac.id/",
  },
  {
    id: 2,
    judul: "Garuda : Garba Rujukan Digital",
    kategori: "E-Journal Nasional",
    gambar: "/images/garuda.png",
    link: "https://garuda.kemdikbud.go.id/",
  },
  {
    id: 3,
    judul: "Neliti : Repositori Ilmiah Indonesia",
    kategori: "E-Journal Nasional",
    gambar: "/images/neliti.png",
    link: "https://www.neliti.com/",
  },
];

const images = [
  "/images/gedung1.png",
];

const secondaryColor = "#784d1e"; // Secondary color
const secondaryHoverColor = "#5a3516"; // Secondary hover color
const textColor = "#333333"; // Main text color
const backgroundColor = "#928776"; // Neutral background color
const borderColor = "#CCCCCC"; // Border/Divider color

export default function Home() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor }}>
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }]} />
        </div>

        {/* Hero Section with Slideshow */}
        <section className="relative w-full h-[500px] overflow-hidden">
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${src})`,
              }}
            >
              <div className="absolute inset-0 bg-black opacity-60"></div>
              <div className="relative text-center text-white z-10 flex flex-col items-center justify-center h-full">
                <h2 className="text-5xl font-extrabold mb-4">
                  Selamat Datang di <br /> Perpustakaan UNSRAT
                </h2>
                <p className="text-lg mb-6 font-light">
                  Pusat informasi dan literasi terbaik untuk mendukung kegiatan akademik Anda.
                </p>
                <button
                  className="px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
                  style={{ backgroundColor: secondaryColor, color: "#FFFFFF" }}
                  aria-label="Jelajahi Perpustakaan"
                  onClick={() => router.push("/peminjaman")}
                >
                  Jelajahi Sekarang
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* E-Journal Nasional */}
        <section id="berita" className="py-16" style={{ backgroundColor }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-[#FFFFFF]" >E-Journal Nasional</h3>
              <p className="mt-2 text-[#FFFFFF]" >
                Akses berbagai sumber jurnal nasional untuk mendukung penelitian dan studi Anda.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {berita.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer"
                  onClick={() => window.open(item.link, "_blank")}
                  style={{ borderColor }}
                >
                  <div className="relative w-full h-48 bg-gray-200 flex justify-center items-center">
                    <Image
                      src={item.gambar}
                      alt={item.judul}
                      width={250}
                      height={150}
                      objectFit="contain"
                      className="p-4"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h4 className="text-lg font-bold mb-2" style={{ color: textColor }}>{item.judul}</h4>
                    <p className="text-sm" style={{ color: textColor }}>{item.kategori}</p>
                    <button
                      className="mt-4 px-4 py-2 rounded-md transition w-full"
                      style={{ backgroundColor: secondaryColor, color: "#FFFFFF" }}
                      aria-label={`Baca lebih lanjut tentang ${item.judul}`}
                    >
                      Selengkapnya
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-white" style={{ background: `linear-gradient(to right, ${secondaryColor}, ${secondaryHoverColor})` }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold">Butuh Buku atau Referensi?</h3>
            <p className="text-lg mt-2" style={{ color: "#E0E0E0" }}>
              Dapatkan akses ke koleksi buku digital dan jurnal ilmiah terbaik.
            </p>
            <button
              className="mt-6 px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
              style={{ backgroundColor: secondaryColor, color: "#FFFFFF" }}
              onClick={() => router.push("/peminjaman")}
            >
              Pinjam Buku Sekarang
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
