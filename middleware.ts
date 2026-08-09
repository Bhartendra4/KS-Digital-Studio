import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/crm-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Protect the CRM. Allow the login page and the login API through.
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";
  if (!isAdmin || isLogin) return NextResponse.next();

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
