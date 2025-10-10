import { cookies } from "next/headers";
import crypto from "crypto";

const USER = process.env.ADMIN_USER ?? "admin12";
const PASS = process.env.ADMIN_PASS ?? "admin1122";

export function tokenFromEnv() {
  return crypto.createHash("sha256").update(`${USER}:${PASS}`).digest("hex");
}

// Next 16: cookies() is async in RSC/Server Actions
export async function isAuthed() {
  const jar = await cookies();
  return jar.get("admin_session")?.value === tokenFromEnv();
}
