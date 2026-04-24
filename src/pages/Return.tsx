import { ArrowRight, PackageCheck, Recycle, Truck } from "lucide-react";
import { DarkCard, GlassCard, PageHeader, PageTransition, SectionTitle } from "../components/app-ui";

const steps = [
  {
    title: "Schedule pickup",
    description: "Choose your pickup window and packaging instructions directly inside the app.",
    icon: Truck,
  },
  {
    title: "Quality assessment",
    description: "We route your item to repair, resale, or material recovery based on condition.",
    icon: PackageCheck,
  },
  {
    title: "Instant rewards",
    description: "Eco points and credits flow back into your wallet once the loop closes.",
    icon: Recycle,
  },
];

export default function Return() {
  return (
    <PageTransition>
      <PageHeader
        subtitle="Reverse Logistics"
        title="Close the loop beautifully."
        detail="The return journey now feels like a premium service flow, not a form-heavy utility screen."
      />

      <DarkCard className="p-6">
        <div className="relative z-10">
          <h2 className="font-serif text-[2rem] leading-none text-cream">Return old pieces, reclaim new value.</h2>
          <p className="mt-3 max-w-sm text-sm text-cream/75">Get pickup, inspection, circular routing, and wallet rewards in one polished path.</p>
          <button type="button" className="primary-button mt-6">
            Start return request
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </DarkCard>

      <SectionTitle title="How the flow works" description="Designed for clarity, confidence, and better perceived quality." />
      <div className="space-y-4">
        {steps.map((step) => (
          <GlassCard key={step.title} className="p-5">
            <div className="relative z-10 flex items-start gap-4">
              <div className="rounded-[1.4rem] bg-olive/8 p-4 text-gold">
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-[1.4rem] text-olive">{step.title}</h3>
                <p className="support-text mt-2">{step.description}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-5">
        <div className="relative z-10 rounded-[1.5rem] border border-dashed border-gold/40 bg-gold/8 p-5">
          <p className="gold-label">Estimated reward</p>
          <h3 className="mt-3 font-serif text-[1.6rem] text-olive">Rs. 500 credit or 320 eco points</h3>
          <p className="support-text mt-2">Final value depends on product type, condition, and whether the item is repaired, resold, or disassembled.</p>
        </div>
      </GlassCard>
    </PageTransition>
  );
}
