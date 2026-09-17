import "server-only";
import crypto from "crypto";
import type { Repo } from "./repo";
import { jsonRepo } from "./json-repo";
import { supabaseRepo, supabaseConfigured } from "./supabase-repo";

/**
 * Driver selection:
 *   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY present  -> Supabase (persistent, production)
 *   otherwise                                          -> local JSON (development)
 * Override explicitly with DB_DRIVER=supabase|json
 */
export function driverName(): "supabase" | "json" {
  const forced = (process.env.DB_DRIVER || "").toLowerCase();
  if (forced === "supabase") return "supabase";
  if (forced === "json") return "json";
  return supabaseConfigured() ? "supabase" : "json";
}

export function getRepo(): Repo {
  return driverName() === "supabase" ? supabaseRepo : jsonRepo;
}

export const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString("hex")}`;
export const nowISO = () => new Date().toISOString();

export type { Repo } from "./repo";
export * from "./entities";
