import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryCatalogCard } from "../components/catalog-ui";
import { GlassCard, PageHeader, PageTransition, Pill, SectionTitle } from "../components/app-ui";
import { getCataloguableProductTypes, getProductsForType } from "../lib/catalog";
import { fetchCatalog } from "../lib/data";
import { cn } from "../lib/utils";
import type { Product } from "../types";

type Filter = "All" | string;

export default function Catalogues() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const filters: Filter[] = ["All", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean))) as string[]];
  const catalogues = useMemo(() => getCataloguableProductTypes(products), [products]);

  useEffect(() => {
    let mounted = true;

    async function loadCatalog() {
      try {
        const catalog = await fetchCatalog();
        if (mounted) {
          setProducts(catalog);
          setLoadError("");
        }
      } catch {
        if (mounted) {
          setProducts([]);
          setLoadError("We couldn't load the live catalog right now. Please try again shortly.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCatalogues = useMemo(() => {
    return catalogues.filter((catalogue) => {
      const productsInCatalogue = getProductsForType(products, catalogue.label);
      if (productsInCatalogue.length === 0) return false;

      const categoryMatch =
        activeFilter === "All" || productsInCatalogue.some((product) => product.category === activeFilter);
      const queryMatch =
        query.trim().length === 0 ||
        catalogue.label.toLowerCase().includes(query.toLowerCase()) ||
        catalogue.title.toLowerCase().includes(query.toLowerCase()) ||
        catalogue.description.toLowerCase().includes(query.toLowerCase()) ||
        productsInCatalogue.some((product) =>
          [product.name, product.description, product.category].join(" ").toLowerCase().includes(query.toLowerCase())
        );

      return categoryMatch && queryMatch;
    });
  }, [activeFilter, catalogues, products, query]);

  return (
    <PageTransition>
      <PageHeader
        subtitle="Catalogue Index"
        title="Browse by catalogue."
        detail="Explore the collection by product family first, then step into each catalogue for a cleaner discovery flow."
      />

      <GlassCard className="editorial-grid p-4">
        <div className="relative z-10 flex items-center gap-3 rounded-[1.5rem] border border-white/60 bg-white/55 px-4 py-4">
          <Search className="h-4 w-4 text-gold" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search wallets, bags, shoes..."
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
            alt="Catalogue hero"
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
            <Pill className="kinetic-pill border-white/10 bg-white/10 text-cream">Catalogue Studio</Pill>
            <h2 className="mt-4 font-serif text-[1.85rem] leading-none">Choose a family, then explore its catalogue.</h2>
            <p className="mt-3 max-w-xs text-sm text-cream/72">A separate browsing layer built for catalogue-first discovery without changing the main shop flow.</p>
          </div>
        </div>
      </GlassCard>

      <SectionTitle
        title="All catalogues"
        description="Each card opens a dedicated catalogue page for that product family."
      />
      <div className="space-y-4">
        {isLoading ? (
          <GlassCard className="p-6">
            <p className="relative z-10 text-sm text-olive">Preparing category catalogues...</p>
          </GlassCard>
        ) : loadError ? (
          <GlassCard className="p-6">
            <p className="relative z-10 text-sm text-olive">{loadError}</p>
          </GlassCard>
        ) : filteredCatalogues.length === 0 ? (
          <GlassCard className="p-6">
            <p className="relative z-10 text-sm text-olive">No catalogues matched your search right now.</p>
          </GlassCard>
        ) : (
          filteredCatalogues.map((catalogue) => (
            <CategoryCatalogCard
              key={catalogue.slug}
              meta={catalogue}
              productCount={getProductsForType(products, catalogue.label).length}
            />
          ))
        )}
      </div>
    </PageTransition>
  );
}
