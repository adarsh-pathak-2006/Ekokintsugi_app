import type { Session } from "@supabase/supabase-js";
import type { CartLine } from "../CartContext";

export type CheckoutPayload = {
  fullName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
};

export async function submitCheckout(session: Session | null, items: CartLine[], customer: CheckoutPayload) {
  if (!session?.access_token) {
    throw new Error("Please sign in before checking out.");
  }

  const response = await fetch("/api/orders/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      customer,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    }),
  }).catch(() => null);

  if (!response) {
    throw new Error("Unable to reach the local checkout server. Restart the app and try again.");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || "Checkout failed.");
  }

  return payload;
}
