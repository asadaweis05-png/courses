"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin-config";
import { Menu, X, BookOpen, GraduationCap, LayoutDashboard, LogOut, LogIn, ChevronDown, User, Shield } from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };

  const links = [
    { href: "/", label: "Home", icon: BookOpen },
    { href: "/courses", label: "Courses", icon: GraduationCap },
    ...(user ? [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] : []),
    ...(user && isAdmin(user.email) ? [{ href: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[#050816]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/20"
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="container-lg h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-white font-extrabold text-lg tracking-tight no-underline group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: "var(--gradient-1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite" }}>
            Q
          </div>
          <span className="tracking-tight">THE<span className="gradient-text">QNEW</span></span>
          <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-[0.2em] uppercase ml-0.5 hidden sm:inline">Learn</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="text-[var(--text-secondary)] text-sm font-medium hover:text-white transition-colors no-underline px-4 py-2 rounded-lg hover:bg-white/[0.04]">
              {l.label}
            </Link>
          ))}

          <div className="w-px h-6 bg-white/[0.08] mx-2" />

          {user ? (
            <div className="flex items-center gap-3">
              <button onClick={logout}
                className="text-[var(--text-muted)] text-sm font-medium hover:text-red-400 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-500/[0.06]">
                <LogOut size={14} /> Logout
              </button>
              <Link href="/dashboard" className="no-underline">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ background: "var(--gradient-1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite" }}>
                  {initials}
                </div>
              </Link>
            </div>
          ) : (
            <Link href="/auth/login" className="btn-accent text-sm !py-2 !px-5 no-underline">
              <LogIn size={14} /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2 rounded-lg hover:bg-white/[0.06] transition-colors">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden slide-down border-t border-white/[0.06]"
          style={{ background: "rgba(5, 8, 22, 0.95)", backdropFilter: "blur(24px)" }}>
          <div className="container-lg py-4 flex flex-col gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 text-[var(--text-secondary)] text-sm font-medium py-3 px-4 no-underline rounded-xl hover:bg-white/[0.04] transition-colors">
                <l.icon size={18} className="text-[var(--accent)]" /> {l.label}
              </Link>
            ))}
            <div className="h-px bg-white/[0.06] my-2" />
            {user ? (
              <button onClick={() => { logout(); setOpen(false); }}
                className="flex items-center gap-3 text-red-400 text-sm font-medium py-3 px-4 text-left rounded-xl hover:bg-red-500/[0.06] transition-colors">
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link href="/auth/login" onClick={() => setOpen(false)}
                className="btn-accent text-sm !py-3 text-center justify-center no-underline mt-2">
                <LogIn size={16} /> Sign In / Create Account
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
