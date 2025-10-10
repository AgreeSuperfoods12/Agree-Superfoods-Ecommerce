import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const store = await cookies();
  const raw = store.get("cart")?.value;
  const cart = raw ? (JSON.parse(raw) as Record<string, number>) : {};
  const ids = Object.keys(cart);
  if (ids.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured (set STRIPE_SECRET_KEY)" }, { status: 400 });
  }

  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const line_items = products.map(p => ({
    quantity: cart[p.id],
    price_data: {
      currency: p.currency ?? "usd",
      unit_amount: p.priceCents,
      product_data: {
        name: p.title,
        description: p.description.slice(0, 200),
        images: ["/logo.svg"]
      }
    }
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
  });

  return NextResponse.json({ url: session.url });
}