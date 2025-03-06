import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("adminToken")?.value;
  const pathname = req.nextUrl.pathname;

  // Redirect jika tidak ada token
  if (!token && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Decode token untuk cek role admin
  let userRole = null;
  try {
    const payload = JSON.parse(atob(token?.split(".")[1] || ""));
    userRole = payload?.role;
  } catch (error) {
    console.error("Invalid token format");
  }

  // Cegah user non-admin mengakses halaman admin
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// Middleware hanya berlaku untuk halaman admin
export const config = {
  matcher: ["/admin/:path*"],
};
