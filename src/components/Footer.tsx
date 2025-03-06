// components/Footer.tsx

const textColor = "#1f2023";
const borderColor = "#444e57";

export default function Footer() {
  return (
    <footer className="bg-[#784d1e] text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        {/* Logo dan Informasi Kontak */}
        <div>
          <img src="/images/logo_unsrat.png" alt="Logo UNSRAT" className="h-16 mb-4" />
          <p>Jl. Kampus Unsrat, Manado</p>
          <p>Email: uptperpustakaan@unsrat.ac.id</p>
          <p>Telp: 085256512130</p>
        </div>
        {/* Informasi Layanan */}
        <div>
          <h4 className="font-bold mb-4" style={{ color: textColor }}>Layanan</h4>
          <ul className="space-y-2">
            <li>Jam Layanan</li>
            <li>Keanggotaan</li>
            <li>Referensi & Terbitan Berkala</li>
          </ul>
        </div>
        {/* E-Resources */}
        <div>
          <h4 className="font-bold mb-4">E-Resources</h4>
          <ul className="space-y-2">
            <li>Database & Jurnal</li>
            <li>Buku Elektronik</li>
            <li>Trial Akses</li>
          </ul>
        </div>
        {/* Kontak */}
        <div>
          <h4 className="font-bold mb-4">Kontak</h4>
          <ul className="space-y-2">
            <li>Alamat: Jl. Kampus Unsrat, Manado</li>
            <li>Email: uptperpustakaan@unsrat.ac.id</li>
            <li>Telp: 085256512130</li>
          </ul>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center mt-8 border-t pt-4" style={{ borderColor }}>
        &copy; {new Date().getFullYear()} Perpustakaan UNSRAT. All rights reserved.
      </div>
    </footer>
  );
}
