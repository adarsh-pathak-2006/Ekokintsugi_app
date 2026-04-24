import { Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { GlassCard, PageHeader, PageTransition, Pill } from "../components/app-ui";
import { fetchOrders } from "../lib/data";
import type { OrderSummary } from "../types";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);

  useEffect(() => {
    let mounted = true;
    if (!user) return;
    fetchOrders(user.id).then((orderList) => {
      if (mounted) setOrders(orderList);
    });
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <PageTransition>
      <PageHeader
        subtitle="Order Tracker"
        title="Your purchases now have a richer follow-through."
        detail="We’ve rebuilt orders with cleaner progress storytelling so the app feels aligned with the website’s premium tone."
      />

      <div className="space-y-4">
        {orders.map((order) => {
          const product = order.product;

          return (
            <GlassCard key={order.id} className="p-5">
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Pill>{order.status}</Pill>
                    <h3 className="mt-3 font-serif text-[1.5rem] text-olive">{product?.name ?? order.productId}</h3>
                  </div>
                  <Package className="h-5 w-5 text-gold" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[1.3rem] border border-white/50 bg-white/55 p-4">
                    <p className="mini-label">Placed on</p>
                    <p className="mt-2 text-sm font-medium text-olive">{new Date(order.placedOn).toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-[1.3rem] border border-white/50 bg-white/55 p-4">
                    <p className="mini-label">Estimated arrival</p>
                    <p className="mt-2 text-sm font-medium text-olive">{new Date(order.eta).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.3rem] border border-white/50 bg-white/55 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-olive">Circular impact included</p>
                    <Truck className="h-4 w-4 text-gold" />
                  </div>
                  <p className="support-text mt-2">{order.carbonSavedKg} kg of CO2 savings is attached to this order’s ledger.</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
        {orders.length === 0 ? (
          <GlassCard className="p-5">
            <p className="relative z-10 text-sm text-olive">No orders have been created for this shared account yet.</p>
          </GlassCard>
        ) : null}
      </div>
    </PageTransition>
  );
}
