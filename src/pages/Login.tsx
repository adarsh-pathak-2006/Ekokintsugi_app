import { ArrowRight, Leaf, Lock, Mail, ShieldCheck, Sparkles, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { signInEmail, signUpEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailAction(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password, name);
        setStatus("Account created. If email confirmation is enabled in Supabase, confirm your email and then sign in.");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page min-h-screen justify-center py-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="page-hero overflow-hidden p-6">
        <div className="absolute inset-0">
          <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -right-10 bottom-20 h-40 w-40 rounded-full bg-olive/18 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-olive text-cream shadow-[0_24px_48px_-26px_rgba(21,34,29,0.7)]">
              <Leaf className="h-10 w-10 text-gold" />
            </div>
            <p className="gold-label mb-3">Luxury Circular App</p>
            <h1 className="section-title text-[2.5rem]">EkoKintsugi</h1>
            <p className="support-text mt-4 px-4">
              Reimagined from the website into a more cinematic mobile experience with impact, rewards, catalog, and return flows.
            </p>
          </div>

          <AnimatePresence mode="wait">
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <div className="mb-5 grid grid-cols-3 gap-3 pt-2">
                    {[
                      { icon: ShieldCheck, label: "Shared DB" },
                      { icon: Sparkles, label: "Robust UX" },
                      { icon: Leaf, label: "Impact Sync" },
                    ].map((item) => (
                      <div key={item.label} className="surface-card p-4 text-center">
                        <item.icon className="mx-auto mb-3 h-5 w-5 text-gold" />
                        <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-olive/55">{item.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="gold-label mb-3">{mode === "login" ? "Welcome back" : "Create your profile"}</p>
                  <h2 className="section-title text-[2.1rem]">{mode === "login" ? "Enter your member circle" : "Join the circular loop"}</h2>
                  <p className="support-text mt-3">
                    {mode === "login"
                      ? "Sign in with the same Supabase account used by the website so your profile, orders, impact, trees, and wallet stay consistent."
                      : "Create an account in the same shared Supabase project powering the website and app."}
                  </p>
                </div>

                <form onSubmit={handleEmailAction} className="space-y-4">
                  {mode === "signup" ? (
                    <label className="block">
                      <span className="mini-label mb-2 block">Full name</span>
                      <div className="surface-card flex items-center gap-3 px-4 py-4">
                        <User className="h-4 w-4 text-gold" />
                        <input
                          required
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Your full name"
                          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-olive/30"
                        />
                      </div>
                    </label>
                  ) : null}

                  <label className="block">
                    <span className="mini-label mb-2 block">Email address</span>
                    <div className="surface-card flex items-center gap-3 px-4 py-4">
                      <Mail className="h-4 w-4 text-gold" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="example@email.com"
                        className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-olive/30"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mini-label mb-2 block">Password</span>
                    <div className="surface-card flex items-center gap-3 px-4 py-4">
                      <Lock className="h-4 w-4 text-gold" />
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-olive/30"
                      />
                    </div>
                  </label>

                  {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
                  {status ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</p> : null}

                  <button type="submit" disabled={loading} className="primary-button w-full justify-center py-5">
                    {loading ? "Processing" : mode === "login" ? "Sign in" : "Create account"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <button
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="w-full text-center text-[10px] font-mono uppercase tracking-[0.26em] text-olive/55 transition-colors hover:text-gold"
                >
                  {mode === "login" ? "Need an account? Sign up" : "Already registered? Sign in"}
                </button>
              </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <p className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-olive/35">
        Crafted for circular commerce, visible impact, and richer member journeys
      </p>
    </div>
  );
}
