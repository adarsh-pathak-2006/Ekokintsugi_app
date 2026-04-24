import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { GlassCard, PageHeader, PageTransition, Pill } from "../components/app-ui";
import { cn, formatInr } from "../lib/utils";
import { fetchCatalog } from "../lib/data";
import type { Product } from "../types";

type Filter = "All" | string;

export default function Shop() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const filters: Filter[] = ["All", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean))) as string[]];

  useEffect(() => {
    let mounted = true;
    fetchCatalog().then((catalog) => {
      if (mounted) {
        setProducts(catalog);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = activeFilter === "All" || product.category === activeFilter;
      const queryMatch = product.name.toLowerCase().includes(query.toLowerCase()) || product.description.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [activeFilter, products, query]);

  return (
    <PageTransition>
      <PageHeader
        subtitle="Collection Studio"
        title="Shop the circular collection."
        detail="The catalog now feels more like the website: richer imagery, clearer product storytelling, and faster browsing."
      />

      <GlassCard className="editorial-grid p-4">
        <div className="relative z-10 flex items-center gap-3 rounded-[1.5rem] border border-white/60 bg-white/55 px-4 py-4">
          <Search className="h-4 w-4 text-gold" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search footwear, bags, wallets..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-olive/35"
          />
          <SlidersHorizontal className="h-4 w-4 text-olive/45" />
        </div>

        <div className="relative z-10 mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.28em] transition-all",
                activeFilter === filter ? "bg-olive text-cream" : "border border-white/60 bg-white/60 text-olive"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="ambient-ring -right-12 -top-12 h-36 w-36 opacity-35" />
        <div className="relative h-52">
          <img
            src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80"
            alt="Collection hero"
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
            <Pill className="kinetic-pill border-white/10 bg-white/10 text-cream">Capsule Drop 04</Pill>
            <h2 className="mt-4 font-serif text-[1.85rem] leading-none">Designed like a luxury edit, not a product list.</h2>
            <p className="mt-3 max-w-xs text-sm text-cream/72">New motion, better hierarchy, and richer impact cues across every card.</p>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4">
        {isLoading ? (
          <GlassCard className="p-6">
            <p className="relative z-10 text-sm text-olive">Loading live catalog from Supabase...</p>
          </GlassCard>
        ) : filteredProducts.length === 0 ? (
          <GlassCard className="p-6">
            <p className="relative z-10 text-sm text-olive">No products are available in the shared catalog yet.</p>
          </GlassCard>
        ) : filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
          <Link to={`/shop/${product.id}`} className="block">
            <GlassCard className="editorial-grid p-4">
              <div className="relative z-10 flex gap-4">
                <div className="image-shell relative h-28 w-28 shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.src = "/images/products/signature-sneaker.jpg";
                    }}
                  />
                  <div className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-1 text-[8px] font-mono uppercase tracking-[0.22em] text-white">
                    0{index + 1}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <Pill>{product.category}</Pill>
                    <div className="flex items-center gap-1 text-gold">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.22em]">eco luxe</span>
                    </div>
                  </div>

                  <h3 className="mt-3 font-serif text-[1.5rem] leading-tight text-olive">{product.name}</h3>
                  <p className="support-text mt-2 line-clamp-2">{product.description}</p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-olive">{formatInr(product.price)}</p>
                      <p className="mini-label mt-1">{product.co2Saved} kg CO2 saved</p>
                    </div>
                    <span className="primary-button px-4 py-3">View</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
}
