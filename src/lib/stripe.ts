import Stripe from "stripe";
import { requireServerEnv } from "@/lib/env";

let stripe: Stripe | null = null;

export function getStripeClient() {
  if (!stripe) {
    stripe = new Stripe(requireServerEnv("STRIPE_SECRET_KEY"));
  }

  return stripe;
}
