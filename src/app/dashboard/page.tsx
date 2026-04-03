"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { BookOpen, ArrowRight, Clock, Trophy, Play, Award, Sparkles, TrendingUp, Compass, CheckCircle2, Circle } from "lucide-react";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/auth/login"; return; }
      setUser(session.user);

      const { data } = await supabase.from("lp_enrollments")
        .select("*, lp_courses(id, title, slug, thumbnail_url, intro_video_id, total_lessons, duration_hours)")
        .eq("user_id", session.user.id).order("enrolled_at", { ascending: false });
      setEnrollments(data || []);
      setLoading(false);
    })();
  }, []);

  const completed = enrollments.filter(e => e.progress_pct >= 100);
  const inProgress = enrollments.filter(e => e.progress_pct < 100);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Learner";

  if (loading) return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-6 relative overflow-hidden bg-[var(--bg)]">
      <div className="absolute inset-0 mesh-bg opacity-30" />
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-glow"
        style={{ background: "var(--gradient-1)", backgroundSize: "200% 200%", animation: "gradientShift 2s ease infinite" }}>
        <Sparkles size={32} className="text-black" />
      </div>
      <div className="text-sm font-semibold tracking-wide text-[var(--accent)] animate-pulse">Summoning your dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-[var(--bg)] -z-20" />
      <div className="fixed inset-0 grid-pattern opacity-[0.02] -z-10" />
      
      {/* Massive Gradient Header */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] bg-gradient-to-b from-[rgba(124,58,237,0.15)] via-[rgba(0,229,255,0.05)] to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[rgba(0,229,255,0.06)] blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
      
      <div className="pt-32 px-5 container-lg z-10 relative">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 animate-up">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6 text-xs font-bold tracking-widest uppercase text-[var(--accent)] shadow-[0_0_20px_rgba(0,229,255,0.1)]">
              <Sparkles size={14} /> {greeting}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-2">
              Welcome back,<br />
              <span className="gradient-text">{firstName}</span>
            </h1>
          </div>
          
          {/* Floating Stats Dock */}
          <div className="flex items-center gap-6 glass px-8 py-5 rounded-3xl border-white/[0.08] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--gradient-1)] opacity-[0.04]" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Courses</span>
              <span className="text-3xl font-black text-white flex items-center gap-2">
                <BookOpen size={20} className="text-[var(--accent)]"/> {enrollments.length}
              </span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Hours</span>
              <span className="text-3xl font-black text-white flex items-center gap-2">
                <Clock size={20} className="text-[#a78bfa]"/> {enrollments.reduce((s, e) => s + (e.lp_courses?.duration_hours || 0), 0)}
              </span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Won</span>
              <span className="text-3xl font-black text-white flex items-center gap-2">
                <Trophy size={20} className="text-emerald-400"/> {completed.length}
              </span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {enrollments.length === 0 && (
          <div className="glass-card border-dashed border-white/20 p-16 text-center animate-up delay-2">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex flex-col items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border)] shadow-xl relative">
              <div className="absolute inset-0 rounded-full border border-[var(--accent)] opacity-20 animate-ping" style={{ animationDuration: '3s' }}/>
              <Compass size={40} className="text-[var(--text-secondary)]" />
            </div>
            <h2 className="text-2xl font-extrabold mb-3">Your Journey Begins Here</h2>
            <p className="text-[var(--text-muted)] max-w-md mx-auto mb-8 leading-relaxed">
              You haven't enrolled in any modules yet. Discover premium courses and unlock your full potential.
            </p>
            <Link href="/courses" className="btn-accent !px-8 !py-4 rounded-full text-base shadow-[0_0_40px_rgba(0,229,255,0.2)] hover:shadow-[0_0_60px_rgba(0,229,255,0.4)]">
              Explore Catalog <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Active Courses */}
        {inProgress.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 animate-up delay-1">
              <h2 className="text-2xl font-extrabold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Play size={18} className="text-amber-400" />
                </div>
                Jump Back In
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgress.map((e, i) => (
                <Link key={e.id} href={`/courses/${e.lp_courses.slug}/learn`}
                  className="group relative glass-card p-5 rounded-3xl min-h-[320px] flex flex-col overflow-hidden animate-up hover:-translate-y-2 transition-all duration-500"
                  style={{ animationDelay: `${i * 100 + 100}ms`, border: '1px solid rgba(255,255,255,0.06)' }}>
                  
                  {/* Thumbnail Banner */}
                  <div className="absolute inset-0 z-0">
                    <img src={e.lp_courses.thumbnail_url || `https://img.youtube.com/vi/${e.lp_courses.intro_video_id}/maxresdefault.jpg`}
                      alt="" className="w-full h-full object-cover opacity-[0.35] group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/80 to-transparent" />
                  </div>

                  {/* Top Badges */}
                  <div className="relative z-10 flex justify-between items-start mb-auto">
                    <div className="glass px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-white backdrop-blur-md border-white/10 uppercase">
                      {Math.round(e.progress_pct)}% Complete
                    </div>
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center border-white/10 group-hover:bg-[var(--accent)] group-hover:text-black transition-colors duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                      <ArrowRight size={18} />
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 mt-12">
                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-snug group-hover:text-[var(--accent)] transition-colors">
                      {e.lp_courses.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-secondary)] mb-5">
                      <span className="flex items-center gap-1.5"><BookOpen size={14}/> {e.lp_courses.total_lessons} Lessons</span>
                      <span className="flex items-center gap-1.5"><Clock size={14}/> {e.lp_courses.duration_hours} Hours</span>
                    </div>

                    <div className="progress-track !h-[6px] !bg-black/60 !rounded-full overflow-hidden border border-white/5 relative z-10 shadow-inner">
                      <div className="progress-fill !rounded-full !bg-[var(--accent)]" style={{ width: `${e.progress_pct}%`, boxShadow: '0 0 20px rgba(0,229,255,0.8)' }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Completed Courses */}
        {completed.length > 0 && (
          <div className="pb-10">
            <div className="flex items-center justify-between mb-8 animate-up delay-2">
              <h2 className="text-2xl font-extrabold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Trophy size={18} className="text-emerald-400" />
                </div>
                Your Achievements
              </h2>
            </div>
            
            <div className="flex flex-col gap-5">
              {completed.map((e, i) => (
                <div key={e.id} className="glass-card p-4 md:p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center animate-up hover:border-[rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-300"
                  style={{ animationDelay: `${i * 100 + 200}ms` }}>
                  
                  <div className="w-full md:w-48 h-28 rounded-xl overflow-hidden flex-shrink-0 relative group">
                    <img src={e.lp_courses.thumbnail_url || `https://img.youtube.com/vi/${e.lp_courses.intro_video_id}/maxresdefault.jpg`}
                      alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] font-bold text-white uppercase tracking-widest">
                      <CheckCircle2 size={12} className="text-emerald-400" /> Finished
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 truncate">{e.lp_courses.title}</h3>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <span className="badge badge-green !text-[10px] !py-1.5 !px-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        Certified
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-medium">Completed on {new Date(e.enrolled_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                    <a href={`/api/certificates?userId=${user.id}&courseId=${e.course_id}`}
                       className="w-full md:w-auto text-sm font-bold px-6 py-3.5 rounded-xl no-underline flex justify-center items-center gap-2 transition-all duration-300 hover:scale-105 border border-white/10 hover:border-transparent text-black"
                       style={{ background: "var(--gradient-1)", backgroundSize: "200%", animation: "gradientShift 4s ease infinite" }}>
                      <Award size={18} /> Claim Certificate
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
