import { BellRing, Leaf, Sparkles, Trophy, Truck } from "lucide-react";
import { NOTIFICATIONS } from "../constants";
import { GlassCard, PageHeader, PageTransition, Pill } from "../components/app-ui";

export default function Notifications() {
  return (
    <PageTransition>
      <PageHeader
        subtitle="Notification Feed"
        title="A cleaner, more premium activity stream."
        detail="The feed now matches the new design language and gives each alert a stronger visual role."
      />

      <div className="space-y-4">
        {NOTIFICATIONS.map((item) => {
          const iconMap = {
            impact: Leaf,
            order: Truck,
            reward: Trophy,
            community: Sparkles,
          };
          const Icon = iconMap[item.type];

          return (
            <GlassCard key={item.id} className="p-5">
              <div className="relative z-10 flex items-start gap-4">
                <div className="rounded-[1.3rem] bg-olive/8 p-4 text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-olive">{item.title}</h3>
                    <Pill>{item.type}</Pill>
                  </div>
                  <p className="support-text mt-2">{item.description}</p>
                  <p className="mini-label mt-3">{item.time}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="p-5">
        <div className="relative z-10 flex items-start gap-4">
          <div className="rounded-[1.3rem] bg-olive/8 p-4 text-gold">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-[1.35rem] text-olive">Priority filters can come next</h3>
            <p className="support-text mt-2">The new feed is structured so you can later add unread state, push preferences, and action buttons without redesigning again.</p>
          </div>
        </div>
      </GlassCard>
    </PageTransition>
  );
}
