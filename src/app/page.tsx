import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { BookOpen, Users, Award, ArrowRight, Play, Star, Globe, Sparkles, Zap } from "lucide-react";

export default async function HomePage() {
  const supabase = await createServerSupabase();
  const { data: courses } = await supabase.from("lp_courses").select("*, lp_categories(name, icon)").eq("is_published", true).order("created_at", { ascending: false }).limit(6);
  const { data: categories } = await supabase.from("lp_categories").select("*").order("sort_order");
  const { count: totalCourses } = await supabase.from("lp_courses").select("*", { count: "exact", head: true }).eq("is_published", true);
  const { count: totalStudents } = await supabase.from("lp_enrollments").select("*", { count: "exact", head: true });

  return (
    <div style={{ paddingTop: 64 }}>

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section style={{ padding: "100px 20px 80px", textAlign: "center", position: "relative" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span className="badge" style={{ marginBottom: 20, display: "inline-flex" }}>
            <Sparkles size={12} /> BARASHADA TOOSKA AH
          </span>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 24 }}>
            Ku Baro{" "}
            <span className="gradient-text">Xirfadaha</span>
            <br />
            Mustaqbalka
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Koorsoyin lacag la&apos;aan ah oo Somali iyo English ah — AI, Technology, Business, iyo wax badan.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/courses" className="btn-accent" style={{ padding: "14px 36px", fontSize: "1rem" }}>
              Browse Courses <ArrowRight size={18} />
            </Link>
            <Link href="/auth/signup" className="btn-outline" style={{ padding: "14px 36px", fontSize: "1rem" }}>
              Bilow Maanta — Free
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════ STATS ════════════════════════ */}
      <section style={{ padding: "48px 20px", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
          {[
            { icon: BookOpen, val: `${totalCourses ?? 0}+`, label: "Courses", bg: "rgba(0,229,255,0.1)", color: "#00e5ff" },
            { icon: Users, val: `${totalStudents ?? 0}+`, label: "Students", bg: "rgba(124,58,237,0.1)", color: "#a78bfa" },
            { icon: Award, val: "Free", label: "Certificates", bg: "rgba(16,185,129,0.1)", color: "#34d399" },
            { icon: Globe, val: "SO/EN", label: "Languages", bg: "rgba(245,158,11,0.1)", color: "#fbbf24" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={22} />
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════ CATEGORIES ════════════════════════ */}
      {categories && categories.length > 0 && (
        <section style={{ padding: "80px 20px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
                Browse by <span className="gradient-text">Category</span>
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Dooro qaybta aad rabto inaad barato</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
              {categories.map((cat: any) => (
                <Link key={cat.id} href={`/courses?category=${cat.slug}`}
                  className="glass-card" style={{ padding: 24, textAlign: "center", textDecoration: "none", cursor: "pointer" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{cat.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>{cat.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════ FEATURED COURSES ════════════════════════ */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
            <div>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Featured <span className="gradient-text">Courses</span>
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 6 }}>Koorsooyinka ugu wanaagsan ee hadda</p>
            </div>
            <Link href="/courses" className="btn-ghost" style={{ textDecoration: "none" }}>
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {courses && courses.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
              {courses.map((course: any) => (
                <Link key={course.id} href={`/courses/${course.slug}`}
                  className="glass-card" style={{ textDecoration: "none", overflow: "hidden" }}>
                  <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--bg-elevated)" }}>
                    {(course.thumbnail_url || course.intro_video_id) ? (
                      <img src={course.thumbnail_url || `https://img.youtube.com/vi/${course.intro_video_id}/hqdefault.jpg`}
                        alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BookOpen size={40} style={{ opacity: 0.2, color: "var(--text-muted)" }} />
                      </div>
                    )}
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <span className="badge" style={{ fontSize: 10 }}>
                        {(course.lp_categories as any)?.icon} {(course.lp_categories as any)?.name || "Course"}
                      </span>
                    </div>
                    {course.is_free && (
                      <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                        FREE
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 className="line-clamp-2" style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, color: "var(--text)" }}>{course.title}</h3>
                    <p className="line-clamp-2" style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>{course.short_desc || course.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Star size={12} style={{ color: "#f59e0b" }} fill="#f59e0b" />
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{course.rating || "New"}</span>
                      </span>
                      <span>{course.total_lessons} lessons</span>
                      <span className="badge" style={{ fontSize: 9, padding: "2px 8px", textTransform: "capitalize" }}>{course.level}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(0,229,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <BookOpen size={32} style={{ color: "var(--accent)" }} />
              </div>
              <p style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Courses coming soon...</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>We&apos;re building amazing content for you</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════ WHY US ════════════════════════ */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, textAlign: "center", marginBottom: 48 }}>
            Maxay noogu <span className="gradient-text">fiican tahay</span>?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
            {[
              { emoji: "🆓", title: "100% Lacag La'aan", desc: "Dhammaan koorsooyinka waa bilaash. Waxbarashadaada kuma kharash galinayso." },
              { emoji: "🌍", title: "Somali & English", desc: "Waxbarashada luqaddaada — Somali ama English, adiga ayaa doorta." },
              { emoji: "📱", title: "Mobile-First", desc: "Ku baro telefoonkaaga meel kasta oo aad joogto — xitaa internet yar." },
            ].map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: 32, textAlign: "center", cursor: "default" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{f.emoji}</div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ CTA ════════════════════════ */}
      <section style={{ padding: "60px 20px 80px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="glass-card animate-glow" style={{
            padding: "60px 40px",
            cursor: "default",
            background: "linear-gradient(135deg, var(--bg-card), rgba(0,229,255,0.03), var(--bg-card))",
            borderColor: "rgba(0,229,255,0.12)"
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, margin: "0 auto 24px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--gradient-1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite"
            }}>
              <Zap size={24} style={{ color: "#000" }} />
            </div>
            <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, marginBottom: 12 }}>
              Bilow Waxbarashadaada <span className="gradient-text">Maanta</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32, maxWidth: 480, margin: "0 auto", lineHeight: 1.7, paddingBottom: 32 }}>
              Ku biir kumanaan arday ah oo horumar wanaagsan ka sameeyay xirfadahooda. Bilaash — weligaa.
            </p>
            <Link href="/auth/signup" className="btn-accent" style={{ padding: "14px 40px", fontSize: "1rem" }}>
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "40px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            © 2026 THEQNEW Learning. Built by <strong style={{ color: "var(--text-secondary)" }}>Hanasho AI</strong>
          </span>
          <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
            <Link href="https://theqnew.com" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Main Site</Link>
            <Link href="https://t.me/HANASHO_COMPANY" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Telegram</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
