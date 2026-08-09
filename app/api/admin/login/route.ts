import { NextResponse } from "next/server";
import { checkCredentials, createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/crm-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  if (!checkCredentials(username || "", password || "")) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }
  const token = await createSession(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
