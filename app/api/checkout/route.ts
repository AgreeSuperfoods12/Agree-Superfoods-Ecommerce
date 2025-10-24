// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Block gracefully if Stripe isn’t configured (prevents build-time crashes)
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Stripe is not configured on this deployment." },
      { status: 501 }
    );
  }

  const stripe = getStripe();

  // Expecting a body like: { lineItems: [{ price: "...", quantity: 1 }], successUrl?, cancelUrl? }
  const body = await req.json().catch(() => ({}));
  const lineItems = Array.isArray(body?.lineItems) ? body.lineItems : [];
  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "No line items provided." },
      { status: 400 }
    );
  }

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: body?.successUrl || `${base}/(checkout)/success`,
      cancel_url: body?.cancelUrl || `${base}/(checkout)/cancel`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Stripe session error" },
      { status: 500 }
    );
  }
}