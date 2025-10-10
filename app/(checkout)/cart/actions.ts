// app/(checkout)/cart/actions.ts
"use server";
import { cookies } from "next/headers";
export type Cart = Record<string, number>;

async function readCart(): Promise<Cart> {
  const store = await cookies();
  const raw = store.get("cart")?.value;
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

async function writeCart(cart: Cart) {
  const store = await cookies();
  store.set("cart", JSON.stringify(cart), {
    path: "/", httpOnly: true, sameSite: "lax", maxAge: 60*60*24*7
  });
}

export async function getCartServer(): Promise<Cart> { return readCart(); }
export async function addToCart(productId: string, qty = 1) {
  const cart = await readCart();
  cart[productId] = (cart[productId] ?? 0) + qty;
  await writeCart(cart);
}
export async function removeFromCart(productId: string) {
  const cart = await readCart();
  delete cart[productId];
  await writeCart(cart);
}
export async function clearCart() { await writeCart({}); }
