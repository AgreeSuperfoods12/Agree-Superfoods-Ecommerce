// lib/stripe.ts
import Stripe from "stripe";

export const isStripeConfigured =
  !!(
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_API_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY
  );

/** Create a Stripe client only when needed (prevents build-time crash). */
export function getStripe() {
  const key =
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_API_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      "Stripe is not configured — set STRIPE_SECRET_KEY in your environment."
    );
  }

  return new Stripe(key, {
    // You can omit apiVersion to use Stripe’s default, or pin to a recent version:
    // apiVersion: "2024-06-20",
    appInfo: { name: "Agree Superfoods", version: "0.1.0" },
  });
}