import { NextResponse } from "next/server";

export async function POST() {
  // TODO: verify Stripe webhook signature & handle events
  return new NextResponse("ok", { status: 200 });
}