// app/api/stripe-webhook/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isStripeConfigured) {
    // Don’t fail the build or the endpoint — just no-op.
    return NextResponse.json({ received: true });
  }

  const stripe = getStripe();
  const sig = (await headers()).get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !whSecret) return NextResponse.json({ received: true });

  const buf = Buffer.from(await req.arrayBuffer());

  try {
    const event = stripe.webhooks.constructEvent(buf, sig, whSecret);
    // TODO: handle event types if you need to
    return NextResponse.json({ received: true });
  } catch (e: any) {
    return new NextResponse(`Webhook Error: ${e.message}`, { status: 400 });
  }
}