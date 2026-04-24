import { ArrowRight, Leaf, ShoppingBag, Sparkles, Trees, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";
import { FEATURE_CARDS, USER_DATA } from "../constants";
import { DarkCard, Eyebrow, GlassCard, MetricTile, PageHeader, PageTransition, Pill, SectionTitle } from "../components/app-ui";
import { fetchCatalog, fetchImpactStats, fetchOrders } from "../lib/data";
import type { ImpactStats, OrderSummary, Product } from "../types";

export default function Home() {
  const { profile, user } = useAuth();
  const firstName = (profile?.name || user?.user_metadata?.name || USER_DATA.name).split(" ")[0];
  const [products, setProducts] = useState<Product[]>([]);
  const [impact, setImpact] = useState<ImpactStats | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const [catalog, orderList, impactStats] = await Promise.all([
        fetchCatalog(),
        user ? fetchOrders(user.id) : Promise.resolve([]),
        user ? fetchImpactStats(user.id) : Promise.resolve(null),
      ]);

      if (!mounted) return;
      setProducts(catalog);
      setOrders(orderList);
      setImpact(impactStats);
      setIsLoadingCatalog(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  const nextOrder = orders[0] ?? null;
  const treesValue = impact?.treeCount ?? 0;
  const co2Value = impact?.totalCo2 ?? 0;
  const creditsValue = Math.round((impact?.credits ?? 0) * 1000);
  const liveTimeline =
    impact?.records?.slice(0, 3).map((record) => ({
      id: record.id,
      title: `${record.co2_saved_kg.toFixed(1)} kg CO2 saved`,
      detail: `${record.waste_diverted_kg.toFixed(1)} kg waste diverted${record.tree_id ? " with tree assignment." : "."}`,
      timestamp: new Date(record.created_at).toLocaleString(),
      status: "completed",
    })) ?? [];

  return (
    <PageTransition>
      <PageHeader
        subtitle="Member Landing"
        title={`Welcome back, ${firstName}.`}
        detail="Your circular wardrobe, impact ledger, rewards wallet, and forest footprint now live together in one premium mobile experience."
      />

      <DarkCard className="p-6">
        <div className="ambient-ring -right-16 -top-16 h-40 w-40 opacity-40" />
        <div className="ambient-ring -bottom-20 left-8 h-48 w-48 opacity-25" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <Pill className="kinetic-pill border-white/10 bg-white/10 text-cream">Live craft intelligence</Pill>
            <motion.div animate={{ rotate: [0, 8, -4, 0] }} transition={{ duration: 5, repeat: Infinity }}>
              <Sparkles className="h-5 w-5 text-gold" />
            </motion.div>
          </div>

          <div>
            <h2 className="font-serif text-[2.15rem] leading-[0.95] text-cream">
              Website-grade storytelling,
              <span className="block text-gold">rebuilt for the app.</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/72">
              Discover new drops, inspect your reforestation portfolio, return old pieces, and unlock luxury rewards through one cinematic member flow.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <motion.div whileHover={{ y: -3 }} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <p className="mini-label text-cream/50">CO2 saved</p>
              <p className="mt-3 font-serif text-[1.8rem] text-gold">{co2Value.toFixed?.(1) ?? co2Value}kg</p>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <p className="mini-label text-cream/50">Trees</p>
              <p className="mt-3 font-serif text-[1.8rem] text-gold">{treesValue}</p>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <p className="mini-label text-cream/50">Points</p>
              <p className="mt-3 font-serif text-[1.8rem] text-gold">{creditsValue.toLocaleString()}</p>
            </motion.div>
          </div>

          <div className="flex gap-3">
            <Link to="/shop" className="primary-button flex-1">
              <ShoppingBag className="h-4 w-4" />
              Shop Now
            </Link>
            <Link to="/impact" className="secondary-button flex-1 border-white/15 bg-white/10 text-cream hover:text-gold">
              <Leaf className="h-4 w-4" />
              View Impact
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {products.slice(0, 3).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                className="image-shell h-24"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "/images/products/signature-sneaker.jpg";
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </DarkCard>

      <div className="grid grid-cols-2 gap-4">
        <MetricTile label="Material Rescue" value={`${(impact?.totalWaste ?? 0).toFixed(1)} kg`} detail="Recovered through circular returns and design reuse." />
        <MetricTile label="Reward Wallet" value={`${creditsValue.toLocaleString()} pts`} detail="Ready for rewards, repairs, or forest expansion." />
      </div>

      <SectionTitle
        title="What the app now does"
        description="A tighter, richer member journey with more premium motion and better wayfinding."
      />
      <div className="space-y-4">
        {FEATURE_CARDS.map((card) => (
          <GlassCard key={card.title} className="editorial-grid p-5">
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <Eyebrow>{card.eyebrow}</Eyebrow>
                <h3 className="mt-3 font-serif text-[1.45rem] leading-tight text-olive">{card.title}</h3>
                <p className="support-text mt-3">{card.description}</p>
              </div>
              <Pill>{card.metric}</Pill>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-5">
        <div className="relative z-10">
          <SectionTitle
            title="Today on your ledger"
            description="A live-look at craft, impact, and loyalty events tied to your profile."
            action={<Link to="/notifications" className="mini-label text-gold">Open feed</Link>}
          />
          <div className="mt-5 space-y-4">
            {liveTimeline.map((event) => (
              <div key={event.id} className="rounded-[1.4rem] border border-white/50 bg-white/55 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-olive">{event.title}</p>
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-gold">{event.status}</span>
                </div>
                <p className="support-text mt-2">{event.detail}</p>
                <div className="mt-3 h-px w-full bg-gradient-to-r from-gold/70 to-transparent" />
                <p className="mini-label mt-3">{event.timestamp}</p>
              </div>
            ))}
            {liveTimeline.length === 0 ? (
              <div className="rounded-[1.4rem] border border-dashed border-gold/30 bg-white/50 p-4">
                <p className="text-sm text-olive">No live impact activity yet. Once orders are created in the shared system, your timeline will populate here.</p>
              </div>
            ) : null}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/orders" className="surface-card p-5">
          <div className="relative z-10">
            <Wallet className="h-5 w-5 text-gold" />
            <h3 className="mt-4 font-serif text-[1.35rem] text-olive">Order radar</h3>
            <p className="support-text mt-2">
              {nextOrder
                ? `${nextOrder.id} reaches you by ${new Date(nextOrder.eta).toLocaleDateString()}.`
                : "Your shared order history will appear here once you place orders from the website or app."}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-olive">
              View orders <ArrowRight className="h-3.5 w-3.5" />
            </p>
          </div>
        </Link>
        <Link to="/forest" className="surface-card p-5">
          <div className="relative z-10">
            <Trees className="h-5 w-5 text-gold" />
            <h3 className="mt-4 font-serif text-[1.35rem] text-olive">Forest mode</h3>
            <p className="support-text mt-2">Walk through your planted zones, health status, and seasonal stories.</p>
            <p className="mt-4 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-olive">
              Open forest <ArrowRight className="h-3.5 w-3.5" />
            </p>
          </div>
        </Link>
      </div>

      <SectionTitle title="Current collection pulse" description="A more editorial storefront inspired by the website collection language." />
      <div className="space-y-4">
        {products.slice(0, 3).map((product) => (
          <Link key={product.id} to={`/shop/${product.id}`} className="block">
            <GlassCard className="p-4">
              <div className="relative z-10 flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-24 rounded-[1.4rem] object-cover"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.src = "/images/products/signature-sneaker.jpg";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="mini-label">{product.category}</p>
                  <h3 className="mt-2 truncate font-serif text-[1.35rem] text-olive">{product.name}</h3>
                  <p className="support-text mt-2 line-clamp-2">{product.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-gold" />
              </div>
            </GlassCard>
          </Link>
        ))}
        {!isLoadingCatalog && products.length === 0 ? (
          <GlassCard className="p-5">
            <p className="relative z-10 text-sm text-olive">No products were found in the shared catalog yet.</p>
          </GlassCard>
        ) : null}
      </div>
    </PageTransition>
  );
}
