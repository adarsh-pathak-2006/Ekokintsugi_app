import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import { GlassCard, PageHeader, PageTransition } from "../components/app-ui";
import { submitCheckout } from "../lib/checkout";
import { formatInr } from "../lib/utils";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, updateQuantity, removeItem, clearCart, isReady, refreshCart } = useCart();
  const { profile, session, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: profile?.name || user?.user_metadata?.name || "",
    email: user?.email || profile?.email || "",
    phone: "",
    shippingAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    notes: ""
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      fullName: current.fullName || profile?.name || user?.user_metadata?.name || "",
      email: current.email || user?.email || profile?.email || "",
    }));
  }, [profile?.email, profile?.name, user?.email, user?.user_metadata?.name]);

  const totals = useMemo(() => {
    const co2 = items.reduce((sum, item) => sum + item.product.co2Saved * item.quantity, 0);
    const waste = items.reduce((sum, item) => sum + item.product.wasteSavedKg * item.quantity, 0);
    return { co2, waste };
  }, [items]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }
    if (!isReady) {
      setMessage("Cart sync is still in progress. Please wait a moment and try again.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await submitCheckout(session, items, form);
      clearCart();
      const checkoutReference = typeof result.checkoutReference === "string" ? result.checkoutReference : "created";
      setMessage(`Checkout ${checkoutReference} completed. Order email sent${result.email?.delivered ? "." : ` failed: ${result.email?.reason || "unknown reason"}`}`);
      navigate("/orders");
    } catch (error: any) {
      setMessage(error?.message || "Unable to complete checkout.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageTransition>
      <PageHeader
        subtitle="Cart & Checkout"
        title="Review your order before it is dispatched."
        detail="This flow creates the order inside this app and emails the order summary to your configured Gmail destination."
      />

      <div className="space-y-4">
        {!isReady ? (
          <GlassCard className="p-6">
            <p className="relative z-10 text-sm text-olive">Syncing your cart with the live catalog...</p>
          </GlassCard>
        ) : items.length === 0 ? (
          <GlassCard className="p-6">
            <div className="relative z-10 flex items-start gap-4">
              <div className="rounded-[1.4rem] bg-olive/8 p-4 text-gold">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-[1.4rem] text-olive">Your cart is empty</h3>
                <p className="support-text mt-2">Add products from the shared catalog to start a checkout.</p>
              </div>
            </div>
          </GlassCard>
        ) : (
          items.map((item) => (
            <GlassCard key={item.product.id} className="p-4">
              <div className="relative z-10 flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-[1.4rem] object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "/images/products/signature-sneaker.jpg";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="mini-label">{item.product.category}</p>
                  <h3 className="mt-2 font-serif text-[1.35rem] text-olive">{item.product.name}</h3>
                  <p className="support-text mt-2">{formatInr(item.product.price * item.quantity)}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="secondary-button h-10 w-10 rounded-xl px-0 py-0">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-olive">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="secondary-button h-10 w-10 rounded-xl px-0 py-0">
                      <Plus className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => removeItem(item.product.id)} className="ml-auto secondary-button h-10 w-10 rounded-xl px-0 py-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      <GlassCard className="editorial-grid p-5">
        <div className="relative z-10 grid grid-cols-3 gap-3">
          <div className="rounded-[1.3rem] border border-white/50 bg-white/55 p-4">
            <p className="mini-label">Subtotal</p>
            <p className="mt-2 font-serif text-[1.4rem] text-olive">{formatInr(subtotal)}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/50 bg-white/55 p-4">
            <p className="mini-label">CO2 Saved</p>
            <p className="mt-2 font-serif text-[1.4rem] text-olive">{totals.co2.toFixed(2)} kg</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/50 bg-white/55 p-4">
            <p className="mini-label">Waste Diverted</p>
            <p className="mt-2 font-serif text-[1.4rem] text-olive">{totals.waste.toFixed(2)} kg</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mini-label mb-2 block">Full name</span>
              <input value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} className="w-full rounded-2xl border border-white/50 bg-white/55 px-4 py-4 text-sm text-ink outline-none" required />
            </label>
            <label className="block">
              <span className="mini-label mb-2 block">Email</span>
              <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-2xl border border-white/50 bg-white/55 px-4 py-4 text-sm text-ink outline-none" required />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mini-label mb-2 block">Phone</span>
              <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-2xl border border-white/50 bg-white/55 px-4 py-4 text-sm text-ink outline-none" />
            </label>
            <label className="block">
              <span className="mini-label mb-2 block">Postal code</span>
              <input value={form.postalCode} onChange={(event) => setForm((current) => ({ ...current, postalCode: event.target.value }))} className="w-full rounded-2xl border border-white/50 bg-white/55 px-4 py-4 text-sm text-ink outline-none" />
            </label>
          </div>
          <label className="block">
            <span className="mini-label mb-2 block">Shipping address</span>
            <textarea value={form.shippingAddress} onChange={(event) => setForm((current) => ({ ...current, shippingAddress: event.target.value }))} className="w-full rounded-2xl border border-white/50 bg-white/55 px-4 py-4 text-sm text-ink outline-none min-h-28" required />
          </label>
          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="mini-label mb-2 block">City</span>
              <input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} className="w-full rounded-2xl border border-white/50 bg-white/55 px-4 py-4 text-sm text-ink outline-none" />
            </label>
            <label className="block">
              <span className="mini-label mb-2 block">State</span>
              <input value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} className="w-full rounded-2xl border border-white/50 bg-white/55 px-4 py-4 text-sm text-ink outline-none" />
            </label>
            <label className="block">
              <span className="mini-label mb-2 block">Country</span>
              <input value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} className="w-full rounded-2xl border border-white/50 bg-white/55 px-4 py-4 text-sm text-ink outline-none" />
            </label>
          </div>
          <label className="block">
            <span className="mini-label mb-2 block">Order notes</span>
            <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} className="w-full rounded-2xl border border-white/50 bg-white/55 px-4 py-4 text-sm text-ink outline-none min-h-24" />
          </label>

          {message ? (
            <div className="rounded-2xl border border-white/50 bg-white/55 px-4 py-4 text-sm text-olive">{message}</div>
          ) : null}

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={() => void refreshCart()}
            className="secondary-button w-full py-4"
          >
            Refresh cart from database
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting || items.length === 0 || !isReady}
            className="primary-button w-full py-5 disabled:opacity-60"
          >
            {isSubmitting ? "Processing order..." : "Place order and email notification"}
          </motion.button>
        </form>
      </GlassCard>
    </PageTransition>
  );
}
