import { isAuthed } from "./session";
import { redirect } from "next/navigation";

export default async function AdminIndex() {
  if (!(await isAuthed())) redirect("/admin/login");
  redirect("/admin/products");
}
