import { Bell, Palette, Shield, Smartphone } from "lucide-react";
import { GlassCard, PageHeader, PageTransition } from "../components/app-ui";

const settings = [
  {
    title: "Interface polish",
    description: "Motion density, transitions, and premium presentation settings for the rebuilt app.",
    icon: Palette,
  },
  {
    title: "Notifications",
    description: "Control order, impact, and community updates without losing the cleaner new feed.",
    icon: Bell,
  },
  {
    title: "Device sync",
    description: "Prepare Capacitor-native enhancements, wallet QR actions, and app-level hardware integrations.",
    icon: Smartphone,
  },
  {
    title: "Privacy controls",
    description: "Keep account, auth, and profile handling aligned with Firebase-powered access.",
    icon: Shield,
  },
];

export default function Settings() {
  return (
    <PageTransition>
      <PageHeader
        subtitle="Settings"
        title="The control layer is cleaner now."
        detail="Even the utility screens now follow the same richer visual language so nothing feels like a downgrade."
      />

      <div className="space-y-4">
        {settings.map((item) => (
          <GlassCard key={item.title} className="p-5">
            <div className="relative z-10 flex items-start gap-4">
              <div className="rounded-[1.3rem] bg-olive/8 p-4 text-gold">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-[1.35rem] text-olive">{item.title}</h3>
                <p className="support-text mt-2">{item.description}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </PageTransition>
  );
}
