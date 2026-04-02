"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, BookOpen, Users, Award } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  }

  return (
    <div className="pt-16 min-h-screen flex">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 relative overflow-hidden px-12"
        style={{ background: "linear-gradient(135deg, #050816 0%, #0a1128 40%, #0d1424 100%)" }}>
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,229,255,0.12), transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full blur-[80px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)" }} />

        <div className="relative z-10 max-w-md">
          <div className="w-14 h-14 rounded-2xl mb-8 flex items-center justify-center"
            style={{ background: "var(--gradient-1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite" }}>
            <Sparkles size={24} className="text-black" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            Welcome to <span className="gradient-text">THEQNEW</span> Learning
          </h2>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-10">
            Access free courses in Somali & English. Learn AI, Technology, Business and more — at your own pace.
          </p>
          <div className="space-y-4">
            {[
              { icon: BookOpen, text: "50+ Free Courses", color: "stat-icon-cyan" },
              { icon: Users, text: "Join Thousands of Learners", color: "stat-icon-purple" },
              { icon: Award, text: "Earn Verified Certificates", color: "stat-icon-green" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 animate-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`stat-icon ${item.color}`} style={{ width: 40, height: 40, borderRadius: 10 }}>
                  <item.icon size={18} />
                </div>
                <span className="text-sm text-[var(--text-secondary)] font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 md:p-10 animate-up" style={{ cursor: "default" }}>
            <div className="text-center mb-8">
              <div className="lg:hidden w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "var(--gradient-1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite" }}>
                <Sparkles size={20} className="text-black" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Welcome Back</h1>
              <p className="text-[var(--text-muted)] text-sm mt-2">Soo gal akoonkaaga — Login to continue learning</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="glass-input !pl-11" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                    className="glass-input !pl-11 !pr-11" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-start gap-2">
                  <span className="mt-0.5">⚠</span> {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="btn-accent w-full justify-center !py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <><div className="spinner" /> Logging in...</> : <>Login <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-[var(--text-muted)]">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <p className="text-center text-sm text-[var(--text-muted)]">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-[var(--accent)] font-semibold no-underline hover:underline">
                Sign Up Free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
