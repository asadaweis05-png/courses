import { createServerSupabase } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, BarChart3, Globe, Star, Users, Play, CheckCircle, ArrowRight, Award } from "lucide-react";
import { EnrollButton } from "@/components/EnrollButton";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: course } = await supabase.from("lp_courses")
    .select("*, lp_categories(name, icon, slug), lp_instructors(name, bio, avatar_url), lp_lessons(id, title, duration_minutes, order_index, is_free_preview, video_id)")
    .eq("slug", slug).eq("is_published", true).single();

  if (!course) notFound();

  const lessons = (course.lp_lessons || []).sort((a: any, b: any) => a.order_index - b.order_index);
  const { count: reviewCount } = await supabase.from("lp_reviews").select("*", { count: "exact", head: true }).eq("course_id", course.id);
  const { data: reviews } = await supabase.from("lp_reviews").select("*").eq("course_id", course.id).order("created_at", { ascending: false }).limit(5);

  return (
    <div className="pt-16 min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative py-20 px-5 overflow-hidden">
        {/* Background blur from thumbnail */}
        {(course.thumbnail_url || course.intro_video_id) && (
          <div className="absolute inset-0 pointer-events-none">
            <img src={course.thumbnail_url || `https://img.youtube.com/vi/${course.intro_video_id}/hqdefault.jpg`}
              alt="" className="w-full h-full object-cover opacity-[0.06] blur-[60px] scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/90 to-[var(--bg)]" />
          </div>
        )}

        <div className="container-lg flex flex-col lg:flex-row gap-12 relative z-10">
          {/* Info */}
          <div className="flex-1 animate-up">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="badge">{(course.lp_categories as any)?.icon} {(course.lp_categories as any)?.name}</div>
              <span className="badge badge-purple capitalize">{course.level}</span>
              {course.is_free && <span className="badge badge-green">FREE</span>}
            </div>
            <h1 className="heading-lg mb-5 leading-tight">{course.title}</h1>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8 max-w-2xl">{course.description}</p>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {[
                { icon: BookOpen, label: `${course.total_lessons} Lessons`, color: "stat-icon-cyan" },
                { icon: Clock, label: `${course.duration_hours}h Duration`, color: "stat-icon-purple" },
                { icon: Globe, label: course.language === "so" ? "Somali" : "English", color: "stat-icon-amber" },
                { icon: Users, label: `${course.enrollment_count} Students`, color: "stat-icon-green" },
                { icon: BarChart3, label: course.level, color: "stat-icon-cyan" },
                ...(course.rating > 0 ? [{ icon: Star, label: `${course.rating} (${reviewCount} reviews)`, color: "stat-icon-amber" }] : []),
              ].map((m, i) => (
                <div key={i} className="glass-card-static p-3 flex items-center gap-3">
                  <div className={`stat-icon ${m.color}`} style={{ width: 36, height: 36, borderRadius: 10 }}>
                    <m.icon size={16} />
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] font-medium capitalize">{m.label}</span>
                </div>
              ))}
            </div>

            <EnrollButton
              courseId={course.id}
              courseSlug={course.slug}
              isFree={course.is_free}
              price={course.price}
              courseTitle={course.title}
            />
          </div>

          {/* Thumbnail / Video */}
          <div className="lg:w-[440px] flex-shrink-0 animate-up delay-2">
            <div className="glass-card overflow-hidden animate-glow" style={{ cursor: "default" }}>
              <div className="relative aspect-video bg-[var(--bg-elevated)]">
                <img src={course.thumbnail_url || `https://img.youtube.com/vi/${course.intro_video_id}/hqdefault.jpg`}
                  alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
                    style={{ background: "var(--gradient-1)", boxShadow: "0 0 40px rgba(0,229,255,0.3)" }}>
                    <Play size={28} fill="#000" className="text-black ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CURRICULUM ═══ */}
      <section className="py-16 px-5">
        <div className="container-md">
          <h2 className="heading-md mb-8 flex items-center gap-3">
            <div className="stat-icon stat-icon-cyan" style={{ width: 40, height: 40, borderRadius: 12 }}>
              <BookOpen size={20} />
            </div>
            Course Curriculum
            <span className="badge text-[10px] ml-2">{lessons.length} lessons</span>
          </h2>
          <div className="space-y-3">
            {lessons.map((lesson: any, i: number) => (
              <div key={lesson.id} className="glass-card p-4 flex items-center gap-4 animate-up"
                style={{ animationDelay: `${i * 30}ms`, cursor: "default" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(0,229,255,0.06)", color: "var(--accent)" }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-secondary)] truncate">{lesson.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{lesson.duration_minutes} min</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {lesson.is_free_preview && <span className="badge badge-green text-[9px]">Preview</span>}
                  <Play size={14} className="text-[var(--text-muted)]" />
                </div>
              </div>
            ))}
            {lessons.length === 0 && (
              <div className="text-center py-16 glass-card-static">
                <BookOpen size={32} className="mx-auto mb-3 text-[var(--text-muted)] opacity-30" />
                <p className="text-sm text-[var(--text-muted)]">Curriculum coming soon</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ INSTRUCTOR ═══ */}
      {course.lp_instructors && (
        <section className="py-16 px-5 border-t border-white/[0.04]">
          <div className="container-md">
            <h2 className="heading-md mb-8">Instructor</h2>
            <div className="glass-card p-6 flex items-start gap-5 animate-up" style={{ cursor: "default" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-black flex-shrink-0"
                style={{ background: "var(--gradient-1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite" }}>
                {(course.lp_instructors as any).name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">{(course.lp_instructors as any).name}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{(course.lp_instructors as any).bio}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
