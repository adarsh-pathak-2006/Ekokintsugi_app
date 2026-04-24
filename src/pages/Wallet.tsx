import { ArrowUpRight, Gift, QrCode, Sparkles, Wallet as WalletIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { REWARD_OPTIONS } from "../constants";
import { DarkCard, GlassCard, PageHeader, PageTransition, SectionTitle } from "../components/app-ui";
import { fetchImpactStats, fetchOrders } from "../lib/data";
import type { ImpactStats, OrderSummary } from "../types";

export default function WalletPage() {
  const { user } = useAuth();
  const [impact, setImpact] = useState<ImpactStats | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);

  useEffect(() => {
    let mounted = true;
    if (!user) return;
    Promise.all([fetchImpactStats(user.id), fetchOrders(user.id)]).then(([impactStats, orderList]) => {
      if (!mounted) return;
      setImpact(impactStats);
      setOrders(orderList);
    });
    return () => {
      mounted = false;
    };
  }, [user]);

  const points = Math.round((impact?.credits ?? 0) * 1000);

  return (
    <PageTransition>
      <PageHeader
        subtitle="Circular Wallet"
        title="Rewards, credits, and returns in one place."
        detail="The wallet has been redesigned into a more premium financial surface with clearer actions and a stronger sense of momentum."
      />

      <DarkCard className="p-6">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mini-label text-cream/55">Available balance</p>
              <p className="mt-3 font-serif text-[2.7rem] leading-none text-gold">{points.toLocaleString()}</p>
              <p className="mt-2 text-sm text-cream/70">Eco points ready to redeem or reinvest.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <WalletIcon className="h-8 w-8 text-gold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/redeem" className="primary-button py-4">
              <Gift className="h-4 w-4" />
              Redeem
            </Link>
            <Link to="/return" className="secondary-button border-white/15 bg-white/10 py-4 text-cream hover:text-gold">
              <QrCode className="h-4 w-4" />
              Return item
            </Link>
          </div>
        </div>
      </DarkCard>

      <SectionTitle title="Reward lanes" description="Expanded redemption storytelling with clearer value on each option." />
      <div className="space-y-4">
        {REWARD_OPTIONS.map((reward) => (
          <GlassCard key={reward.id} className="p-5">
            <div className="relative z-10">
              <div className={`h-2 w-full rounded-full bg-gradient-to-r ${reward.accent}`} />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-[1.45rem] text-olive">{reward.title}</h3>
                  <p className="support-text mt-2">{reward.description}</p>
                </div>
                <span className="rounded-full bg-olive px-3 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-cream">
                  {reward.points} pts
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-5">
        <SectionTitle title="Recent wallet activity" description="A more elegant transaction history with stronger visual anchors." />
        <div className="relative z-10 mt-5 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-[1.4rem] border border-white/50 bg-white/55 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-olive/8 p-3 text-gold">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-olive">{order.id}</p>
                  <p className="mini-label mt-1">{order.status} • {new Date(order.placedOn).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-olive">+{Math.round(order.carbonSavedKg * 120)} pts</p>
                <p className="mini-label mt-1">Auto minted</p>
              </div>
            </div>
          ))}
          {orders.length === 0 ? (
            <div className="rounded-[1.4rem] border border-dashed border-gold/30 bg-white/50 p-4">
              <p className="text-sm text-olive">Wallet activity will appear here after shared orders and impact credits are created.</p>
            </div>
          ) : null}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="relative z-10 flex items-start gap-4">
          <div className="rounded-[1.4rem] bg-olive/8 p-4 text-gold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-[1.4rem] text-olive">New premium behavior</h3>
            <p className="support-text mt-2">The wallet now reads like a premium member card instead of a generic utility page, while still preserving redemption and returns flows.</p>
          </div>
        </div>
      </GlassCard>
    </PageTransition>
  );
}
