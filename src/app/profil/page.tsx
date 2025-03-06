"use client";

import Breadcrumb from "../../components/Breadcrumb";
import Image from "next/image";

export default function Profil() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-12 px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Profil", href: "/profil" },
          ]}
        />

        {/* Header Section */}
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-[#1f2023]">
            Profil Perpustakaan UNSRAT
          </h1>
        </header>

        {/* Sejarah Perpustakaan UNSRAT */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#1f2023] mb-4">Sejarah UPT Perpustakaan UNSRAT</h2>
          <div className="flex flex-wrap mb-6">
            <div className="w-full md:w-1/2 pr-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Unit Pelaksana Teknis Perpustakaan Universitas Sam Ratulangi (UPT Perpustakaan UNSRAT) didirikan pada tahun 1961. Sebelumnya, dua perguruan tinggi, yaitu Pinaesaan dan PTPG Tondano, sudah memiliki perpustakaan masing-masing, meskipun koleksi mereka masih sangat minim. Perpustakaan UNSRAT akhirnya didirikan pada tahun 1967 setelah penggabungan beberapa perguruan tinggi. Saat ini, UPT Perpustakaan UNSRAT memiliki lebih dari 100.000 koleksi buku dan jurnal ilmiah.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                Perpustakaan ini terus berkembang, dan pada tahun 1993, berdasarkan Surat Keputusan Mendikbud No. 02126/1993, Perpustakaan UNSRAT resmi menjadi Unit Pelaksana Teknis Perpustakaan.
              </p>
            </div>
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <div className="flex justify-center md:justify-end">
                <Image
                  src="/images/gedung1.png"
                  alt="Gedung Perpustakaan UNSRAT"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Visi dan Misi */}
        <section className="mb-12 bg-white shadow-md p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-[#1f2023] mb-4">Visi</h2>
          <p className="text-gray-700 text-lg">
            Menjadi pusat informasi ilmiah unggul dan berbudaya yang memberikan pelayanan prima berbasis teknologi, informasi, dan komunikasi bagi sivitas akademika serta meningkatkan daya saing.
          </p>

          <h2 className="text-3xl font-bold text-[#1f2023] mt-8 mb-4">Misi</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
            <li>Meningkatkan kualitas sumber daya koleksi perpustakaan untuk mendukung Tri Dharma perguruan tinggi.</li>
            <li>Mengembangkan daya saing perpustakaan dengan menyediakan koleksi relevan yang mendukung posisi geografis kawasan.</li>
            <li>Meningkatkan pelayanan perpustakaan dengan sistem automasi untuk akses informasi yang lebih baik.</li>
            <li>Meningkatkan tata kelola manajemen perpustakaan yang unggul serta kompetensi pustakawan yang bersertifikasi.</li>
          </ul>
        </section>

        {/* Pimpinan Perpustakaan */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#1f2023] mb-6">Pimpinan Perpustakaan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            <figure className="text-center">
              <Image
                src="/images/pimpinan1.jpg"
                alt="Woerjarto, Pimpinan Perpustakaan (1951-1955)"
                width={150}
                height={150}
                className="w-full h-auto rounded-lg shadow-lg mb-3 object-cover"
              />
              <figcaption>
                <p className="text-sm font-semibold text-gray-800">Woerjarto</p>
                <p className="text-sm text-gray-500">(1951-1955)</p>
              </figcaption>
            </figure>
            <figure className="text-center">
              <Image
                src="/images/pimpinan2.jpg"
                alt="Moerjopranoto, Pimpinan Perpustakaan (1955-1967)"
                width={150}
                height={150}
                className="w-full h-auto rounded-lg shadow-lg mb-3 object-cover"
              />
              <figcaption>
                <p className="text-sm font-semibold text-gray-800">Moerjopranoto</p>
                <p className="text-sm text-gray-500">(1955-1967)</p>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Lokasi Perpustakaan */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#1f2023] mb-4">Lokasi UPT Perpustakaan UNSRAT</h2>
          <p className="text-gray-700 text-lg">
            Gedung UPT Perpustakaan UNSRAT beralamat di: Jalan Kampus Unsrat, Kelurahan Bahu, Kecamatan Malalayang, Kota Manado, Provinsi Sulawesi Utara, Indonesia, Kode Pos 95115.
          </p>
          <p className="text-gray-700 text-lg mt-4">
            Email: <a href="mailto:uptperpustakaan@unsrat.ac.id" className="text-blue-500">uptperpustakaan@unsrat.ac.id</a>
          </p>
        </section>
      </div>
    </div>
  );
}
