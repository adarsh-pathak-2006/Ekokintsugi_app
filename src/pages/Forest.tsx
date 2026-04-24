import { MapPin, Sprout, Trees, Waves } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { DarkCard, GlassCard, PageHeader, PageTransition, Pill, SectionTitle } from "../components/app-ui";
import { fetchTrees } from "../lib/data";
import type { Tree } from "../types";

export default function Forest() {
  const { user } = useAuth();
  const [trees, setTrees] = useState<Tree[]>([]);

  useEffect(() => {
    let mounted = true;
    if (!user) return;
    fetchTrees(user.id).then((treeList) => {
      if (mounted) setTrees(treeList);
    });
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <PageTransition>
      <PageHeader
        subtitle="Forest Dashboard"
        title="Walk through your living footprint."
        detail="This area now behaves more like an immersive landscape view than a simple list, with stronger imagery and clearer ecological storytelling."
      />

      <DarkCard className="overflow-hidden">
        <div className="relative h-64">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80"
            alt="Forest canopy"
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
            <Pill className="border-white/10 bg-white/10 text-cream">Monsoon readiness 86%</Pill>
            <h2 className="mt-4 font-serif text-[1.95rem] leading-none">Three active zones, one member forest.</h2>
            <p className="mt-3 max-w-sm text-sm text-cream/75">Geo-linked tree stories, restoration health, and long-term biodiversity progress stay visible inside the app.</p>
          </div>
        </div>
      </DarkCard>

      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-4">
          <Trees className="h-5 w-5 text-gold" />
          <p className="mt-3 font-serif text-[1.6rem] text-olive">{trees.length}</p>
          <p className="mini-label">Live saplings</p>
        </GlassCard>
        <GlassCard className="p-4">
          <Waves className="h-5 w-5 text-gold" />
          <p className="mt-3 font-serif text-[1.6rem] text-olive">{Math.min(3, Math.max(1, trees.length || 0))}</p>
          <p className="mini-label">Water zones</p>
        </GlassCard>
        <GlassCard className="p-4">
          <Sprout className="h-5 w-5 text-gold" />
          <p className="mt-3 font-serif text-[1.6rem] text-olive">{trees.length ? "91%" : "0%"}</p>
          <p className="mini-label">Health score</p>
        </GlassCard>
      </div>

      <SectionTitle title="Assigned trees" description="Each tree card now carries more mood, location context, and lifecycle detail." />
      <div className="space-y-4">
        {trees.map((tree) => (
          <GlassCard key={tree.id} className="p-4">
            <div className="relative z-10 flex gap-4">
              <img src={tree.photoUrl} alt={tree.species} className="h-28 w-28 rounded-[1.5rem] object-cover" referrerPolicy="no-referrer" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Pill>{tree.status}</Pill>
                    <h3 className="mt-3 font-serif text-[1.4rem] text-olive">{tree.species}</h3>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-olive/70">
                  <MapPin className="h-4 w-4 text-gold" />
                  {tree.location.name}
                </div>
                <p className="support-text mt-3">{tree.story}</p>
              </div>
            </div>
          </GlassCard>
        ))}
        {trees.length === 0 ? (
          <GlassCard className="p-5">
            <p className="relative z-10 text-sm text-olive">No forest records are available for this account yet.</p>
          </GlassCard>
        ) : null}
      </div>
    </PageTransition>
  );
}
