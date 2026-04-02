"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { BookOpen, ArrowRight, Clock, Trophy, Play, Award, Sparkles, TrendingUp } from "lucide-react";

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

  if (loading) return (
    <div className="pt-24 flex flex-col items-center justify-center gap-4">
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      <span className="text-sm text-[var(--text-muted)]">Loading your dashboard...</span>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen">
      {/* Welcome Banner */}
      <section className="py-12 px-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,229,255,0.04)] via-transparent to-[rgba(124,58,237,0.04)] pointer-events-none" />
        <div className="container-lg relative z-10">
          <div className="glass-card p-8 md:p-10 animate-up" style={{ cursor: "default", background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(0,229,255,0.03) 100%)", borderColor: "rgba(0,229,255,0.1)" }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-black"
                    style={{ background: "var(--gradient-1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite" }}>
                    {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                      Welcome back, <span className="gradient-text">{user?.user_metadata?.full_name || user?.email?.split("@")[0]}</span>
                    </h1>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Track your learning progress</p>
                  </div>
                </div>
              </div>
              <Link href="/courses" className="btn-accent !py-3 !px-6 no-underline text-sm">
                <BookOpen size={16} /> Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-lg py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BookOpen, val: enrollments.length, label: "Enrolled", color: "cyan" },
            { icon: Play, val: inProgress.length, label: "In Progress", color: "amber" },
            { icon: Trophy, val: completed.length, label: "Completed", color: "green" },
            { icon: Clock, val: `${enrollments.reduce((s, e) => s + (e.lp_courses?.duration_hours || 0), 0)}h`, label: "Learning Time", color: "purple" },
          ].map((s, i) => (
            <div key={i} className="glass-card p-5 animate-up" style={{ animationDelay: `${i * 0.06}s`, cursor: "default" }}>
              <div className={`stat-icon stat-icon-${s.color} mb-3`}>
                <s.icon size={20} />
              </div>
              <div className="text-2xl font-extrabold">{s.val}</div>
              <div className="text-[10px] text-[var(--text-muted)] font-medium mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* In Progress */}
        {inProgress.length > 0 && (
          <div className="mb-12">
            <h2 className="heading-md mb-6 flex items-center gap-3">
              <div className="stat-icon stat-icon-amber" style={{ width: 36, height: 36, borderRadius: 10 }}>
                <TrendingUp size={18} />
              </div>
              Continue Learning
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {inProgress.map((e, i) => (
                <Link key={e.id} href={`/courses/${e.lp_courses.slug}/learn`}
                  className="glass-card p-5 flex gap-5 items-center no-underline group animate-up"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-elevated)]">
                    <img src={e.lp_courses.thumbnail_url || `https://img.youtube.com/vi/${e.lp_courses.intro_video_id}/hqdefault.jpg`}
                      alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate mb-2">{e.lp_courses.title}</h3>
                    <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1.5">
                      <span>{e.lp_courses.total_lessons} lessons</span>
                      <span className="gradient-text font-bold">{Math.round(e.progress_pct)}%</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${e.progress_pct}%` }} /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div className="mb-12">
            <h2 className="heading-md mb-6 flex items-center gap-3">
              <div className="stat-icon stat-icon-green" style={{ width: 36, height: 36, borderRadius: 10 }}>
                <Trophy size={18} />
              </div>
              Completed
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {completed.map((e, i) => (
                <div key={e.id} className="glass-card p-5 flex gap-5 items-center animate-up"
                  style={{ animationDelay: `${i * 50}ms`, cursor: "default" }}>
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-elevated)]">
                    <img src={e.lp_courses.thumbnail_url || `https://img.youtube.com/vi/${e.lp_courses.intro_video_id}/hqdefault.jpg`}
                      alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate mb-2">{e.lp_courses.title}</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#34d399] font-bold">
                        <Trophy size={12} /> Completed
                      </div>
                      <a
                        href={`/api/certificates?userId=${user.id}&courseId=${e.course_id}`}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-lg no-underline flex items-center gap-1 transition-all hover:scale-105"
                        style={{ background: "var(--gradient-1)", backgroundSize: "200%", color: "#000", animation: "gradientShift 4s ease infinite" }}>
                        <Award size={10} /> Download Cert
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {enrollments.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-float"
              style={{ background: "rgba(0,229,255,0.06)" }}>
              <Sparkles size={36} className="text-[var(--accent)]" />
            </div>
            <p className="text-[var(--text-secondary)] font-semibold mb-2 text-lg">Start Your Learning Journey</p>
            <p className="text-[var(--text-muted)] text-sm mb-8">You haven&apos;t enrolled in any courses yet</p>
            <Link href="/courses" className="btn-accent no-underline !py-3.5 !px-8">
              Browse Courses <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
