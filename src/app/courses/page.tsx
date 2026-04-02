"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Search, BookOpen, Star, Play, ArrowRight } from "lucide-react";

export default function CoursesPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("category") || "");
  const [level, setLevel] = useState("");

  useEffect(() => {
    supabase.from("lp_categories").select("*").order("sort_order").then(({ data }) => setCategories(data || []));
    loadCourses();
  }, []);

  useEffect(() => { loadCourses(); }, [selectedCat, level]);

  async function loadCourses() {
    setLoading(true);
    let q = supabase.from("lp_courses").select("*, lp_categories(name, icon)").eq("is_published", true).order("created_at", { ascending: false });
    if (selectedCat) {
      const cat = categories.find(c => c.slug === selectedCat);
      if (cat) q = q.eq("category_id", cat.id);
    }
    if (level) q = q.eq("level", level);
    const { data } = await q;
    setCourses(data || []);
    setLoading(false);
  }

  const filtered = courses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>

      {/* ─── Header ─── */}
      <section style={{ padding: "48px 20px 40px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span className="badge" style={{ marginBottom: 12, display: "inline-flex" }}>📚 Course Catalog</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Dhammaan <span className="gradient-text">Koorsooyinka</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Discover courses in Somali & English — all free</p>
        </div>
      </section>

      {/* ─── Content ─── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, marginBottom: 20 }}>
            <button onClick={() => setSelectedCat("")}
              style={{
                flexShrink: 0, padding: "8px 18px", borderRadius: 9999, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                ...(! selectedCat
                  ? { background: "var(--gradient-1)", backgroundSize: "200%", color: "#000" }
                  : { background: "rgba(255,255,255,0.04)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.06)" }
                )
              }}>
              All
            </button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setSelectedCat(c.slug)}
                style={{
                  flexShrink: 0, padding: "8px 18px", borderRadius: 9999, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                  ...(selectedCat === c.slug
                    ? { background: "var(--gradient-1)", backgroundSize: "200%", color: "#000" }
                    : { background: "rgba(255,255,255,0.04)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.06)" }
                  )
                }}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Search + Level Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..."
              className="glass-input" style={{ paddingLeft: 42 }} />
          </div>
          <select value={level} onChange={e => setLevel(e.target.value)} className="glass-input" style={{ width: 180, flex: "none" }}>
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24, fontWeight: 500 }}>
          Showing <span className="gradient-text" style={{ fontWeight: 700 }}>{filtered.length}</span> courses
        </div>

        {/* ─── Grid ─── */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card-static" style={{ overflow: "hidden" }}>
                <div className="skeleton" style={{ aspectRatio: "16/9" }} />
                <div style={{ padding: 20 }}>
                  <div className="skeleton" style={{ height: 16, width: "75%", marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 12, width: "100%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(0,229,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <BookOpen size={32} style={{ color: "var(--accent)" }} />
            </div>
            <p style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>No courses found</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Try changing your search or filters</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}
                className="glass-card" style={{ textDecoration: "none", overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--bg-elevated)", overflow: "hidden" }}>
                  <img src={course.thumbnail_url || `https://img.youtube.com/vi/${course.intro_video_id}/hqdefault.jpg`}
                    alt={course.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--bg), transparent 60%)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span className="badge" style={{ fontSize: 10 }}>
                      {(course.lp_categories as any)?.icon} {(course.lp_categories as any)?.name}
                    </span>
                  </div>
                  {course.is_free && (
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)",
                      color: "#34d399", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20
                    }}>FREE</div>
                  )}
                </div>
                <div style={{ padding: 20 }}>
                  <h3 className="line-clamp-2" style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, color: "var(--text)" }}>
                    {course.title}
                  </h3>
                  <p className="line-clamp-2" style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
                    {course.short_desc || course.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={12} style={{ color: "#f59e0b" }} fill="#f59e0b" />
                      <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{course.rating || "New"}</span>
                    </span>
                    <span>{course.total_lessons} lessons · {course.duration_hours}h</span>
                    <span className="badge" style={{ fontSize: 9, padding: "2px 8px", textTransform: "capitalize" }}>{course.level}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
