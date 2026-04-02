"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  Users, BookOpen, Plus, Edit, Trash2,
  ExternalLink, Shield, TrendingUp, Eye, EyeOff, LogOut
} from "lucide-react";

export default function AdminDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, totalEnrollments: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = "/auth/login"; return; }
    setUser(session.user);
    loadData();
  }

  async function loadData() {
    setLoading(true);
    const [{ count: students }, { count: enrollments }, { data: coursesData }] = await Promise.all([
      supabase.from("lp_enrollments").select("user_id", { count: "exact", head: true }),
      supabase.from("lp_enrollments").select("*", { count: "exact", head: true }),
      supabase.from("lp_courses").select("*, lp_lessons(id)").order("created_at", { ascending: false })
    ]);
    setStats({
      totalStudents: students || 0,
      totalCourses: coursesData?.length || 0,
      totalEnrollments: enrollments || 0,
    });
    setCourses(coursesData || []);
    setLoading(false);
  }

  async function togglePublish(courseId: string, current: boolean) {
    await supabase.from("lp_courses").update({ is_published: !current }).eq("id", courseId);
    loadData();
  }

  async function deleteCourse(courseId: string, title: string) {
    if (!confirm(`Delete "${title}"? All lessons will also be removed.`)) return;
    await supabase.from("lp_lessons").delete().eq("course_id", courseId);
    await supabase.from("lp_courses").delete().eq("id", courseId);
    loadData();
  }

  if (loading) return (
    <div style={{ paddingTop: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Loading admin dashboard...</span>
    </div>
  );

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ padding: "40px 20px 32px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--gradient-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={22} style={{ color: "#fff" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Admin Dashboard</h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Manage courses and lessons</p>
            </div>
          </div>
          <Link href="/admin/courses/new" className="btn-accent" style={{ padding: "10px 24px", fontSize: 14, textDecoration: "none" }}>
            <Plus size={16} /> Create Course
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
          {[
            { label: "Courses", value: stats.totalCourses, icon: BookOpen, color: "rgba(0,229,255,0.1)", iconColor: "#00e5ff" },
            { label: "Enrollments", value: stats.totalEnrollments, icon: TrendingUp, color: "rgba(16,185,129,0.1)", iconColor: "#34d399" },
            { label: "Students", value: stats.totalStudents, icon: Users, color: "rgba(124,58,237,0.1)", iconColor: "#a78bfa" },
          ].map((s, i) => (
            <div key={i} className="glass-card-static" style={{ padding: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: s.color, color: s.iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <s.icon size={22} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Courses Table */}
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>All Courses</h2>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{courses.length} total</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {courses.map((course) => (
            <div key={course.id} className="glass-card-static" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0, flex: 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--bg-elevated)", overflow: "hidden", flexShrink: 0 }}>
                  <img
                    src={course.thumbnail_url || `https://img.youtube.com/vi/${course.intro_video_id || "default"}/hqdefault.jpg`}
                    alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 400 }}>{course.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                      ...(course.is_published
                        ? { background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }
                        : { background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }
                      )
                    }}>
                      {course.is_published ? "LIVE" : "DRAFT"}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {course.lp_lessons?.length || 0} lessons
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>{course.level}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => togglePublish(course.id, course.is_published)}
                  title={course.is_published ? "Unpublish" : "Publish"}
                  style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "none", cursor: "pointer" }}>
                  {course.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <Link href={`/admin/courses/edit/${course.id}`}
                  style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Edit size={15} />
                </Link>
                <Link href={`/courses/${course.slug}`} target="_blank"
                  style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <ExternalLink size={15} />
                </Link>
                <button onClick={() => deleteCourse(course.id, course.title)}
                  style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "none", cursor: "pointer" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px", border: "2px dashed rgba(255,255,255,0.06)", borderRadius: 16 }}>
              <BookOpen size={40} style={{ color: "var(--text-muted)", opacity: 0.3, margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>No courses created yet.</p>
              <Link href="/admin/courses/new" className="btn-accent" style={{ padding: "10px 24px", fontSize: 14, textDecoration: "none" }}>
                <Plus size={16} /> Create First Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
