"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 8; // 8h

function tokenFromEnv() {
  const u = process.env.ADMIN_USER ?? "";
  const p = process.env.ADMIN_PASS ?? "";
  return createHash("sha256").update(`${u}:${p}`).digest("hex");
}

export async function setSession() {
  const store = await cookies();                // Next 16: cookies() is async
  store.set(COOKIE_NAME, tokenFromEnv(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthed() {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === tokenFromEnv();
}

export async function login(_prevState: any, formData: FormData) {
  const user = String(formData.get("username") ?? "");
  const pass = String(formData.get("password") ?? "");
  if (user === (process.env.ADMIN_USER ?? "") && pass === (process.env.ADMIN_PASS ?? "")) {
    await setSession();
    redirect("/admin/products");
  }
  return { error: "Invalid credentials" };
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}
