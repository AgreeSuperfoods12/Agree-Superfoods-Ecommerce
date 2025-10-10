import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER ?? "admin12";
const ADMIN_PASS = process.env.ADMIN_PASS ?? "admin1122";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const needsAuth = path.startsWith("/admin") || path.startsWith("/api/admin");
  if (!needsAuth) return NextResponse.next();

  const auth = req.headers.get("authorization") || "";
  if (auth.startsWith("Basic ")) {
    try {
      const [user, pass] = atob(auth.slice(6)).split(":");
      if (user === ADMIN_USER && pass === ADMIN_PASS) return NextResponse.next();
    } catch {}
  }
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };