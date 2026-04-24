import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import { syncProfileForUser } from "./lib/data";
import type { ProfileData } from "./types";

const AUTH_BOOT_TIMEOUT_MS = 3500;

async function withTimeout<T>(promise: Promise<T>, fallback: T, timeoutMs = AUTH_BOOT_TIMEOUT_MS): Promise<T> {
  let timer: number | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = window.setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) window.clearTimeout(timer);
  }
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileData | null;
  loading: boolean;
  displayName: string;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured || !supabase) {
      setSession(null);
      setProfile(null);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    async function hydrate() {
      try {
        const { data } = await withTimeout(
          supabase.auth.getSession(),
          { data: { session: null } } as Awaited<ReturnType<typeof supabase.auth.getSession>>
        );
        if (!mounted) return;
        setSession(data.session);

        if (data.session?.user) {
          const syncedProfile = await withTimeout(
            syncProfileForUser(data.session.user),
            {
              id: data.session.user.id,
              name: data.session.user.user_metadata?.name || data.session.user.email?.split("@")[0] || "Member",
              email: data.session.user.email || "",
              createdAt: new Date().toISOString(),
            }
          );
          if (mounted) setProfile(syncedProfile);
        } else if (mounted) {
          setProfile(null);
        }
      } catch {
        if (!mounted) return;
        setSession(null);
        setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    hydrate();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      try {
        setSession(nextSession);

        if (nextSession?.user) {
          const syncedProfile = await withTimeout(
            syncProfileForUser(nextSession.user),
            {
              id: nextSession.user.id,
              name: nextSession.user.user_metadata?.name || nextSession.user.email?.split("@")[0] || "Member",
              email: nextSession.user.email || "",
              createdAt: new Date().toISOString(),
            }
          );
          setProfile(syncedProfile);
        } else {
          setProfile(null);
        }
      } catch {
        setSession(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(() => {
    const user = session?.user ?? null;
    const displayName =
      profile?.name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "Member";

    return {
      user,
      session,
      profile,
      loading,
      displayName,
      signInEmail: async (email: string, pass: string) => {
        if (!supabase) {
          throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.");
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: pass,
        });

        if (error) throw error;
      },
      signUpEmail: async (email: string, pass: string, name: string) => {
        if (!supabase) {
          throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.");
        }
        const normalizedEmail = email.trim().toLowerCase();
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: pass,
          options: {
            data: { name: name.trim() },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.user) {
          const syncedProfile = await syncProfileForUser(data.user, {
            name: name.trim(),
            email: normalizedEmail,
          });
          setProfile(syncedProfile);
        }
      },
      logout: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    };
  }, [loading, profile, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
