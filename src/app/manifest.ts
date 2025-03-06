import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Perpustakaan UNSRAT",
    short_name: "UNSRAT Library",
    description: "Aplikasi perpustakaan UNSRAT berbasis web",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff0000", // Sesuai dengan tema warna baru (merah)
    icons: [
      {
        src: "/icons/perpus.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/perpus.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
