import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CategoryCatalogCard, ProductCatalogueImageCard } from "../components/catalog-ui";
import { GlassCard, PageHeader, PageTransition, Pill, SectionTitle } from "../components/app-ui";
import { PRODUCT_TYPE_META, getCataloguableProductTypes, getProductTypeFromSlug, getProductTypeMeta, getProductsForType } from "../lib/catalog";
import { fetchCatalog } from "../lib/data";
import type { Product } from "../types";

export default function CategoryCatalog() {
  const { catalogueSlug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCatalog() {
      try {
        const catalog = await fetchCatalog();
        if (!mounted) return;
        setProducts(catalog);
        setLoadError("");
      } catch {
        if (!mounted) return;
        setProducts([]);
        setLoadError("We couldn't load this catalogue right now. Please try again in a moment.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void loadCatalog();

    return () => {
      mounted = false;
    };
  }, []);

  const productType = getProductTypeFromSlug(catalogueSlug);
  const meta = productType ? getProductTypeMeta(productType) : null;
  const categoryProducts = productType ? getProductsForType(products, productType) : [];
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return categoryProducts;

    return categoryProducts.filter((product) => {
      const haystack = [product.name, product.description, product.category, product.productType].join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [categoryProducts, query]);

  const relatedCatalogues = getCataloguableProductTypes(products).filter((entry) => entry.label !== productType);
  const totalCo2 = filteredProducts.reduce((sum, product) => sum + product.co2Saved, 0);

  if (!meta || !productType) {
    return (
      <PageTransition>
        <Link to="/catalogues" className="secondary-button w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to catalogues
        </Link>
        <GlassCard className="p-6">
          <p className="relative z-10 text-sm text-olive">
            This catalogue does not exist. Choose one of the live catalogues from the collection page.
          </p>
        </GlassCard>
        <div className="space-y-4">
          {PRODUCT_TYPE_META.map((entry) => (
            <CategoryCatalogCard
              key={entry.slug}
              meta={entry}
              productCount={getProductsForType(products, entry.label).length}
            />
          ))}
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Link to="/catalogues" className="secondary-button w-fit">
        <ArrowLeft className="h-4 w-4" />
        Back to catalogues
      </Link>

      <PageHeader
        subtitle="Category Catalogue"
        title={meta.title}
        detail="A focused catalogue view for one product family, built with the same premium motion, spacing, and responsive behavior as the main storefront."
      />

      <GlassCard className="overflow-hidden">
        <div className="relative h-56">
          <img
            src={meta.heroImage}
            alt={meta.title}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = "/images/products/signature-sneaker.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
            <div className="flex items-center justify-between gap-3">
              <Pill className="kinetic-pill border-white/10 bg-white/10 text-cream">{meta.label}</Pill>
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-cream/72">
                {categoryProducts.length} piece{categoryProducts.length === 1 ? "" : "s"}
              </span>
            </div>
            <h2 className="mt-4 font-serif text-[1.9rem] leading-none">{meta.description}</h2>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="editorial-grid p-4">
        <div className="relative z-10 flex items-center gap-3 rounded-[1.5rem] border border-white/60 bg-white/55 px-4 py-4">
          <Search className="h-4 w-4 text-gold" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search inside ${meta.label.toLowerCase()}...`}
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-olive/35"
          />
        </div>

        <div className="relative z-10 mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-[1.3rem] border border-white/75 bg-white/82 p-4 shadow-[0_16px_30px_-24px_rgba(21,34,29,0.35)]">
            <p className="mini-label">Items</p>
            <p className="mt-2 font-serif text-[1.5rem] text-olive">{filteredProducts.length}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/75 bg-white/82 p-4 shadow-[0_16px_30px_-24px_rgba(21,34,29,0.35)]">
            <p className="mini-label">CO2 Profile</p>
            <p className="mt-2 font-serif text-[1.5rem] text-olive">{totalCo2.toFixed(1)} kg</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/75 bg-white/82 p-4 shadow-[0_16px_30px_-24px_rgba(21,34,29,0.35)]">
            <p className="mini-label">Collection Tags</p>
            <p className="mt-2 font-serif text-[1.5rem] text-olive">
              {new Set(categoryProducts.map((product) => product.category)).size}
            </p>
          </div>
        </div>
      </GlassCard>

      <SectionTitle
        title={`${meta.label} products`}
        description="Every product stays clickable, responsive, and visually aligned with the existing shop experience."
      />
      <div className="space-y-4">
        {isLoading ? (
          <GlassCard className="p-6">
            <p className="relative z-10 text-sm text-olive">Loading live catalogue from Supabase...</p>
          </GlassCard>
        ) : loadError ? (
          <GlassCard className="p-6">
            <p className="relative z-10 text-sm text-olive">{loadError}</p>
          </GlassCard>
        ) : filteredProducts.length === 0 ? (
          <GlassCard className="p-6">
            <p className="relative z-10 text-sm text-olive">
              No products match this catalogue right now. Try another category or clear your search.
            </p>
          </GlassCard>
        ) : (
          filteredProducts.map((product, index) => (
            <ProductCatalogueImageCard key={product.id} product={product} index={index} />
          ))
        )}
      </div>

      {relatedCatalogues.length > 0 ? (
        <>
          <SectionTitle
            title="Explore other catalogues"
            description="Quick jumps into adjacent product families without losing the current collection language."
          />
          <div className="space-y-4">
            {relatedCatalogues.map((entry) => (
              <CategoryCatalogCard
                key={entry.slug}
                meta={entry}
                productCount={getProductsForType(products, entry.label).length}
              />
            ))}
          </div>
        </>
      ) : null}
    </PageTransition>
  );
}
