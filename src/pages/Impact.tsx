import { ArrowRight, Leaf, Recycle, Sparkles, TreePine } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { DarkCard, GlassCard, PageHeader, PageTransition, Pill, SectionTitle } from "../components/app-ui";
import { fetchImpactStats, fetchTrees } from "../lib/data";
import type { ImpactStats, Tree } from "../types";

export default function Impact() {
  const { user } = useAuth();
  const [impact, setImpact] = useState<ImpactStats | null>(null);
  const [trees, setTrees] = useState<Tree[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return;
      const [impactStats, treeList] = await Promise.all([fetchImpactStats(user.id), fetchTrees(user.id)]);
      if (!mounted) return;
      setImpact(impactStats);
      setTrees(treeList);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  const co2Saved = impact?.totalCo2 ?? 0;
  const treesPlanted = impact?.treeCount ?? 0;
  const recycledPairs = impact?.records.length ?? 0;

  return (
    <PageTransition>
      <PageHeader
        subtitle="Impact Command Center"
        title="See your footprint become visible."
        detail="The dashboard has been rebuilt to feel more alive, cinematic, and data-rich while keeping your core impact metrics front and center."
      />

      <DarkCard className="p-6">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <Pill className="border-white/10 bg-white/10 text-cream">Verified live</Pill>
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          <h2 className="mt-5 font-serif text-[2rem] leading-none text-cream">Your regenerative score is climbing.</h2>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <Leaf className="h-5 w-5 text-gold" />
              <p className="mt-4 font-serif text-[1.8rem] text-gold">{co2Saved}kg</p>
              <p className="mini-label text-cream/55">CO2 saved</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <TreePine className="h-5 w-5 text-gold" />
              <p className="mt-4 font-serif text-[1.8rem] text-gold">{treesPlanted}</p>
              <p className="mini-label text-cream/55">Trees linked</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <Recycle className="h-5 w-5 text-gold" />
              <p className="mt-4 font-serif text-[1.8rem] text-gold">{recycledPairs}</p>
              <p className="mini-label text-cream/55">Returns closed</p>
            </div>
          </div>
        </div>
      </DarkCard>

      <GlassCard className="p-5">
        <SectionTitle title="Live impact stream" description="A cleaner mobile timeline for orders, returns, trees, and wallet milestones." />
        <div className="relative z-10 mt-5 space-y-4">
          {(impact?.records.length
            ? impact.records.slice(0, 4).map((record) => ({
                id: record.id,
                title: `${record.co2_saved_kg.toFixed(1)} kg CO2 saved`,
                detail: `${record.waste_diverted_kg.toFixed(1)} kg waste diverted${record.tree_id ? " and tree support assigned." : "."}`,
                timestamp: new Date(record.created_at).toLocaleString(),
                status: "completed" as const,
              }))
            : []).map((event) => (
            <div key={event.id} className="rounded-[1.4rem] border border-white/50 bg-white/55 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-olive">{event.title}</p>
                <span className="text-[9px] font-mono uppercase tracking-[0.28em] text-gold">{event.status}</span>
              </div>
              <p className="support-text mt-2">{event.detail}</p>
              <p className="mini-label mt-4">{event.timestamp}</p>
            </div>
          ))}
          {!impact?.records.length ? (
            <div className="rounded-[1.4rem] border border-dashed border-gold/30 bg-white/50 p-4">
              <p className="text-sm text-olive">No impact records exist yet for this account.</p>
            </div>
          ) : null}
        </div>
      </GlassCard>

      <SectionTitle
        title="Your forest preview"
        description="Stronger visual storytelling with direct paths into the dedicated forest experience."
        action={<Link to="/forest" className="mini-label text-gold">See all</Link>}
      />
      <div className="space-y-4">
        {trees.slice(0, 2).map((tree) => (
          <GlassCard key={tree.id} className="overflow-hidden">
            <div className="relative h-48">
              <img src={tree.photoUrl} alt={tree.species} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                <Pill className="border-white/10 bg-white/10 text-cream">{tree.status}</Pill>
                <h3 className="mt-3 font-serif text-[1.5rem]">{tree.species}</h3>
                <p className="mt-2 text-sm text-cream/75">{tree.location.name}</p>
              </div>
            </div>
          </GlassCard>
        ))}
        {trees.length === 0 ? (
          <GlassCard className="p-5">
            <p className="relative z-10 text-sm text-olive">No trees are linked to this account yet.</p>
          </GlassCard>
        ) : null}
      </div>

      <Link to="/forest" className="primary-button w-full">
        Open full forest dashboard
        <ArrowRight className="h-4 w-4" />
      </Link>
    </PageTransition>
  );
}
