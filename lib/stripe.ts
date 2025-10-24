// lib/stripe.ts
import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

/** True if a Stripe secret key is present in env. */
export const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

/** Lazily create and reuse a single Stripe client. */
export function getStripe(): Stripe {
  if (!isStripeConfigured) {
    throw new Error("Stripe is not configured (missing STRIPE_SECRET_KEY).");
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20" as any,
    });
  }
  return stripeSingleton;
}
