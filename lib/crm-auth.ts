// Session auth using Web Crypto (works in both Edge middleware and Node routes).
const enc = new TextEncoder();
const dec = new TextDecoder();

const SECRET = process.env.SESSION_SECRET || "dev-insecure-secret-change-me";
export const SESSION_COOKIE = "ksds_admin";
const MAX_AGE = 60 * 60 * 12; // 12h

function b64url(bytes: Uint8Array): string {
  let s = btoa(String.fromCharCode(...bytes));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}
const ab = (u: Uint8Array): ArrayBuffer => u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) as ArrayBuffer;

async function key(): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", ab(enc.encode(SECRET)), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createSession(username: string): Promise<string> {
  const payload = { u: username, exp: Math.floor(Date.now() / 1000) + MAX_AGE };
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await key(), ab(enc.encode(body)));
  return `${body}.${b64url(new Uint8Array(sig))}`;
}

export async function verifySession(token?: string | null): Promise<{ u: string } | null> {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  try {
    const ok = await crypto.subtle.verify("HMAC", await key(), ab(fromB64url(sig)), ab(enc.encode(body)));
    if (!ok) return null;
    const payload = JSON.parse(dec.decode(fromB64url(body)));
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { u: payload.u };
  } catch {
    return null;
  }
}

export function checkCredentials(username: string, password: string): boolean {
  const U = process.env.ADMIN_USERNAME || "admin";
  const P = process.env.ADMIN_PASSWORD || "changeme";
  return username === U && password === P;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
