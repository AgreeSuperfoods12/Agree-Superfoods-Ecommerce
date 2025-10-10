// lib/cart.ts
import 'server-only';
import { cookies } from 'next/headers';

export type Cart = Record<string, number>;

export async function readCart(): Promise<Cart> {
  const store = await cookies();
  const raw = store.get('cart')?.value;
  try { return raw ? (JSON.parse(raw) as Cart) : {}; } catch { return {}; }
}

export function cartCount(cart: Cart): number {
  return Object.values(cart).reduce((s, n) => s + (n ?? 0), 0);
}
