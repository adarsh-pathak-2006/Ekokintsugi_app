import { LogOut, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { useAuth } from "../AuthContext";
import { USER_DATA } from "../constants";
import { DarkCard, GlassCard, PageHeader, PageTransition } from "../components/app-ui";

export default function Profile() {
  const { profile, user, logout } = useAuth();
  const name = profile?.name || user?.user_metadata?.name || USER_DATA.fullName;
  const email = user?.email || profile?.email || USER_DATA.email;

  return (
    <PageTransition>
      <PageHeader
        subtitle="Member Profile"
        title="Your identity feels more premium now too."
        detail="The profile has been simplified into a cleaner luxury member card with room for future membership and personalization features."
      />

      <DarkCard className="p-6">
        <div className="relative z-10 flex items-start gap-4">
          <img
            src={`https://picsum.photos/seed/${user?.id || "ekokintsugi"}/300/300`}
            alt={name}
            className="h-20 w-20 rounded-[1.8rem] object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <p className="mini-label text-cream/55">Member identity</p>
            <h2 className="mt-2 font-serif text-[1.9rem] text-cream">{name}</h2>
            <p className="mt-2 text-sm text-cream/70">{email}</p>
          </div>
        </div>
      </DarkCard>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <div className="relative z-10 flex items-start gap-4">
            <div className="rounded-[1.3rem] bg-olive/8 p-4 text-gold">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-[1.35rem] text-olive">Member tier</h3>
              <p className="support-text mt-2">Atelier Circle • priority drops, repair access, and member-only storytelling surfaces.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="relative z-10 flex items-start gap-4">
            <div className="rounded-[1.3rem] bg-olive/8 p-4 text-gold">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-[1.35rem] text-olive">Communication</h3>
              <p className="support-text mt-2">Order updates, impact summaries, and community invites all route to your primary email.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="relative z-10 flex items-start gap-4">
            <div className="rounded-[1.3rem] bg-olive/8 p-4 text-gold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-[1.35rem] text-olive">Account security</h3>
              <p className="support-text mt-2">Your authentication is still powered by Firebase, but the presentation has been upgraded around it.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <button type="button" onClick={logout} className="secondary-button w-full py-4">
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </PageTransition>
  );
}
