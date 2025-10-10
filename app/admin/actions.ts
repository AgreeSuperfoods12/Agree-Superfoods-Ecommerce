"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { tokenFromEnv } from "./session";

const USER = process.env.ADMIN_USER ?? "admin12";
const PASS = process.env.ADMIN_PASS ?? "admin1122";

export async function login(fd: FormData) {
  const u = String(fd.get("user") ?? "");
  const p = String(fd.get("pass") ?? "");
  if (u !== USER || p !== PASS) {
    redirect("/admin/login?error=1"); // avoid returning objects (TS error)
  }
  const jar = await cookies();
  jar.set("admin_session", tokenFromEnv(), {
    httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  redirect("/admin/products");
}

export async function logout() {
  const jar = await cookies();
  jar.delete("admin_session");
  redirect("/admin/login");
}
