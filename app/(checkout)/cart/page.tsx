// app/(checkout)/cart/page.tsx
import { getCartServer, clearCart, removeFromCart } from "./actions";
import { getProductsByIds } from "@/lib/products";
import { CheckoutButton } from "@/components/shop/CheckoutButton";

type Item = {
  id: string;
  title: string;
  priceCents: number;
  qty: number;
  total: number;
};
type ProductLite = { id: string; title: string; priceCents: number };

export default async function CartPage() {
  const cart = await getCartServer();
  const ids = Object.keys(cart);
  const products = (await getProductsByIds(ids)) as ProductLite[];

  const items: Item[] = products
    .map((p: ProductLite) => ({
      id: p.id,
      title: p.title,
      priceCents: p.priceCents,
      qty: cart[p.id] ?? 0,
      total: (cart[p.id] ?? 0) * p.priceCents,
    }))
    .filter((i: Item) => i.qty > 0);

  const subtotal: number = items.reduce((sum: number, i: Item) => sum + i.total, 0);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-3 mb-6">
            {items.map((i: Item) => (
              <li key={i.id} className="flex items-center justify-between rounded border p-3">
                <div>
                  <p className="font-medium">{i.title}</p>
                  <p className="text-sm opacity-70">
                    {(i.priceCents / 100).toFixed(2)} × {i.qty}
                  </p>
                </div>
                <form action={removeFromCart.bind(null, i.id)}>
                  <button className="text-sm underline opacity-70">Remove</button>
                </form>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-lg font-semibold">Subtotal</p>
            <p className="text-lg font-semibold">{(subtotal / 100).toFixed(2)}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <CheckoutButton />
            <form action={clearCart}>
              <button className="rounded border px-4 py-2">Clear cart</button>
            </form>
          </div>
        </>
      )}
    </main>
  );
}
