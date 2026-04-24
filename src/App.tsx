import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  LayoutGrid,
  Leaf,
  Menu,
  ShoppingCart,
  ShoppingBag,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Impact from "./pages/Impact";
import Profile from "./pages/Profile";
import WalletPage from "./pages/Wallet";
import ProductDetails from "./pages/ProductDetails";
import Forest from "./pages/Forest";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Redeem from "./pages/Redeem";
import Notifications from "./pages/Notifications";
import Return from "./pages/Return";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./AuthContext";
import { CartProvider, useCart } from "./CartContext";
import { cn } from "./lib/utils";
import { isSupabaseConfigured } from "./lib/supabase";
import CartPage from "./pages/Cart";

function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="editorial-grid mx-auto max-w-md rounded-[2rem] border border-white/40 bg-white/62 px-4 py-3 backdrop-blur-xl shadow-[0_18px_45px_-28px_rgba(18,34,28,0.55)]"
      >
        <div className="flex items-center justify-between">
          <Link to="/settings" className="secondary-button h-11 w-11 rounded-2xl px-0 py-0">
            <Menu className="h-5 w-5" />
          </Link>

          <Link to="/" className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-[1.3rem] bg-olive text-cream shadow-lg">
              <Leaf className="h-5 w-5 text-gold" />
              <div className="absolute -right-1 -top-1 rounded-full bg-gold px-1.5 py-0.5 text-[7px] font-mono font-bold uppercase tracking-[0.2em] text-ink">
                app
              </div>
            </div>
            <div className="text-center">
              <p className="font-serif text-[1.3rem] leading-none text-olive">EkoKintsugi</p>
              <p className="mt-1 text-[9px] font-mono font-bold uppercase tracking-[0.38em] text-gold">Circular Atelier</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/cart" className="secondary-button relative h-11 w-11 rounded-2xl px-0 py-0">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-gold px-1.5 py-0.5 text-[8px] font-mono font-bold text-ink shadow-[0_10px_20px_-12px_rgba(17,31,26,0.8)]">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            <Link to="/notifications" className="secondary-button relative h-11 w-11 rounded-2xl px-0 py-0">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-white" />
            </Link>
          </div>
        </div>
      </motion.div>
    </header>
  );
}

function BottomNav() {
  const location = useLocation();
  const navItems = [
    { path: "/", icon: LayoutGrid, label: "Home" },
    { path: "/shop", icon: ShoppingBag, label: "Shop" },
    { path: "/impact", icon: Leaf, label: "Impact" },
    { path: "/wallet", icon: Wallet, label: "Wallet" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="editorial-grid mx-auto max-w-md rounded-[2.25rem] border border-white/45 bg-white/74 px-3 py-2 backdrop-blur-xl shadow-[0_20px_55px_-28px_rgba(17,31,26,0.65)]"
      >
        <div className="flex items-center justify-between gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex min-w-[58px] flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[8px] font-mono font-bold uppercase tracking-[0.28em] transition-all",
                  isActive ? "text-olive" : "text-olive/35"
                )}
              >
                {isActive ? (
                  <motion.div
                    layoutId="bottom-nav"
                    className="absolute inset-0 rounded-2xl bg-olive/8"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                  />
                ) : null}
                <item.icon className={cn("relative z-10 h-5 w-5", isActive ? "text-gold" : "text-olive/40")} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
}

function AppLoader() {
  return (
    <div className="app-shell min-h-screen px-5">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
        <div className="page-hero w-full p-10 text-center">
          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-olive text-cream shadow-2xl animate-drift">
              <Sparkles className="h-9 w-9 text-gold" />
            </div>
            <div>
              <p className="gold-label mb-3">Syncing Craft Ledger</p>
              <h1 className="section-title text-[2.2rem]">Preparing Your App</h1>
              <p className="support-text mt-3">Loading account, live impact, and rewards intelligence.</p>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-olive/10">
              <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gold animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SetupScreen() {
  return (
    <div className="app-shell min-h-screen px-5">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
        <div className="page-hero w-full p-8">
          <div className="relative z-10 space-y-5 text-center">
            <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[1.8rem] bg-olive text-cream shadow-xl">
              <Sparkles className="h-8 w-8 text-gold" />
            </div>
            <div>
              <p className="gold-label mb-3">Setup Required</p>
              <h1 className="section-title text-[2.1rem]">Supabase is not configured.</h1>
              <p className="support-text mt-3">
                Create a `.env.local` file in the app folder and add the same `VITE_SUPABASE_URL` and
                `VITE_SUPABASE_ANON_KEY` used by the website.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/50 bg-white/60 p-4 text-left text-sm text-olive">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">Add this file</p>
              <pre className="mt-3 whitespace-pre-wrap font-mono text-[11px] leading-6">{`VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthShell() {
  const location = useLocation();

  return (
    <div className="app-shell min-h-screen text-ink">
      <main className="mx-auto max-w-md">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="*" element={<Login />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function MemberShell() {
  const location = useLocation();

  return (
    <div className="app-shell min-h-screen pb-28 text-ink">
      <Header />
      <main className="mx-auto max-w-md">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetails />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/forest" element={<Forest />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/redeem" element={<Redeem />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/return" element={<Return />} />
          </Routes>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return <AppLoader />;
  if (!user) return <AuthShell />;
  return <MemberShell />;
}

export default function App() {
  if (!isSupabaseConfigured) {
    return <SetupScreen />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
