import { Gift, Sparkles, Ticket } from "lucide-react";
import { REWARD_OPTIONS } from "../constants";
import { GlassCard, PageHeader, PageTransition } from "../components/app-ui";

export default function Redeem() {
  return (
    <PageTransition>
      <PageHeader
        subtitle="Redeem Rewards"
        title="Spend points on things that feel worth it."
        detail="This screen has been reframed around premium reward experiences rather than plain utility coupons."
      />

      <div className="space-y-4">
        {REWARD_OPTIONS.map((reward) => (
          <GlassCard key={reward.id} className="p-5">
            <div className="relative z-10 flex items-start gap-4">
              <div className={`rounded-[1.4rem] bg-gradient-to-br ${reward.accent} p-4 text-white shadow-lg`}>
                <Gift className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-serif text-[1.45rem] text-olive">{reward.title}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-gold">{reward.points} pts</span>
                </div>
                <p className="support-text mt-2">{reward.description}</p>
                <button type="button" className="primary-button mt-4">
                  <Ticket className="h-4 w-4" />
                  Redeem now
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-5">
        <div className="relative z-10 flex items-start gap-4">
          <div className="rounded-[1.4rem] bg-olive/8 p-4 text-gold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-[1.35rem] text-olive">Redemption can get richer later</h3>
            <p className="support-text mt-2">The new layout leaves room for payment, eligibility, stock, and member-tier logic when you wire the backend flow in next.</p>
          </div>
        </div>
      </GlassCard>
    </PageTransition>
  );
}
