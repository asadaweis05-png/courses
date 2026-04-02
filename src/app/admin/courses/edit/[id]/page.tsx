"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { extractYouTubeId } from "@/lib/youtube";
import {
  ArrowLeft, Save, Loader2, Plus, Trash2,
  Play, Layout, Clock, CheckCircle, AlertCircle, Link2
} from "lucide-react";
import Link from "next/link";

export default function EditCoursePage() {
  const supabase = createClient();
  const params = useParams();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const [introUrl, setIntroUrl] = useState("");

  useEffect(() => { loadCourse(); }, [courseId]);

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function loadCourse() {
    setLoading(true);
    const { data: c } = await supabase.from("lp_courses").select("*").eq("id", courseId).single();
    const { data: l } = await supabase.from("lp_lessons").select("*").eq("course_id", courseId).order("order_index", { ascending: true });
    setCourse(c);
    setLessons(l || []);
    // Seed URL fields from existing IDs
    if (c?.intro_video_id) setIntroUrl(c.intro_video_id);
    const urls: Record<string, string> = {};
    (l || []).forEach((lesson: any) => { if (lesson.video_id) urls[lesson.id] = lesson.video_id; });
    setVideoUrls(urls);
    setLoading(false);
  }

  function handleCourseChange(e: any) {
    const { name, value, type, checked } = e.target;
    setCourse((prev: any) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleIntroUrl(value: string) {
    setIntroUrl(value);
    const id = extractYouTubeId(value);
    setCourse((prev: any) => ({ ...prev, intro_video_id: id }));
  }

  async function saveCourse() {
    setSaving(true);
    const totalLessons = lessons.length;
    const totalMinutes = lessons.reduce((s: number, l: any) => s + (parseInt(l.duration_minutes) || 0), 0);

    const { error } = await supabase.from("lp_courses").update({
      ...course,
      total_lessons: totalLessons,
      duration_hours: Math.round(totalMinutes / 60 * 10) / 10,
      updated_at: new Date().toISOString()
    }).eq("id", courseId);

    if (error) showToast("Error: " + error.message, "err");
    else showToast("Course saved!");
    setSaving(false);
  }

  async function addLesson() {
    setAddingLesson(true);
    const { data, error } = await supabase.from("lp_lessons").insert([{
      course_id: courseId,
      title: `Lesson ${lessons.length + 1}`,
      video_id: "",
      duration_minutes: 0,
      order_index: lessons.length,
      is_free_preview: false
    }]).select();
    if (error) showToast("Error: " + error.message, "err");
    else if (data) { setLessons([...lessons, data[0]]); showToast("Lesson added!"); }
    setAddingLesson(false);
  }

  function updateLocal(id: string, field: string, value: any) {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  }

  async function saveField(id: string, field: string, value: any) {
    const { error } = await supabase.from("lp_lessons").update({ [field]: value }).eq("id", id);
    if (error) showToast("Error: " + error.message, "err");
  }

  function handleLessonUrl(id: string, url: string) {
    setVideoUrls(prev => ({ ...prev, [id]: url }));
    const vid = extractYouTubeId(url);
    updateLocal(id, "video_id", vid);
  }

  function saveLessonUrl(id: string) {
    const lesson = lessons.find(l => l.id === id);
    if (lesson) saveField(id, "video_id", lesson.video_id);
  }

  async function deleteLesson(id: string) {
    if (!confirm("Delete this lesson?")) return;
    const { error } = await supabase.from("lp_lessons").delete().eq("id", id);
    if (error) showToast("Error: " + error.message, "err");
    else { setLessons(prev => prev.filter(l => l.id !== id)); showToast("Lesson deleted"); }
  }

  if (loading) return (
    <div style={{ paddingTop: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Loading editor...</span>
    </div>
  );

  if (!course) return (
    <div style={{ paddingTop: 100, textAlign: "center" }}>
      <p style={{ color: "var(--text-muted)" }}>Course not found.</p>
      <Link href="/admin" style={{ color: "var(--accent)" }}>Back to Admin</Link>
    </div>
  );

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 100,
          padding: "10px 20px", borderRadius: 12, display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          background: toast.type === "ok" ? "rgba(16,185,129,0.95)" : "rgba(239,68,68,0.95)", color: "#fff"
        }}>
          {toast.type === "ok" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <Link href="/admin" style={{ padding: 8, borderRadius: 10, background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", display: "flex", flexShrink: 0 }}>
              <ArrowLeft size={18} />
            </Link>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: 16, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{course.title}</h1>
              <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                  ...(course.is_published
                    ? { background: "rgba(16,185,129,0.12)", color: "#34d399" }
                    : { background: "rgba(239,68,68,0.12)", color: "#f87171" })
                }}>{course.is_published ? "LIVE" : "DRAFT"}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{lessons.length} lessons</span>
              </div>
            </div>
          </div>
          <button onClick={saveCourse} disabled={saving} className="btn-accent" style={{ padding: "10px 20px", fontSize: 13, flexShrink: 0 }}>
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save</>}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 60px" }}>
        {/* ─── Course Settings (collapsible on mobile) ─── */}
        <details open style={{ marginBottom: 24 }}>
          <summary style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>
            <Layout size={16} /> Course Settings
          </summary>
          <div className="glass-card-static" style={{ padding: "20px 16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Title</label>
                  <input name="title" value={course.title} onChange={handleCourseChange} className="glass-input" />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Slug</label>
                  <input name="slug" value={course.slug} onChange={handleCourseChange} className="glass-input" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Description</label>
                <textarea name="description" value={course.description || ""} onChange={handleCourseChange} rows={3} className="glass-input" />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Intro Video (YouTube URL)</label>
                <input value={introUrl} onChange={e => handleIntroUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                  className="glass-input" />
                {course.intro_video_id && (
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                    ID: <strong style={{ color: "var(--accent)" }}>{course.intro_video_id}</strong>
                  </p>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Level</label>
                  <select name="level" value={course.level} onChange={handleCourseChange} className="glass-input">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Language</label>
                  <select name="language" value={course.language || "so"} onChange={handleCourseChange} className="glass-input">
                    <option value="so">Somali</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => setCourse({ ...course, is_published: true })}
                  style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
                    ...(course.is_published ? { background: "#10b981", color: "#fff" } : { background: "rgba(255,255,255,0.04)", color: "var(--text-muted)" }) }}>
                  Publish
                </button>
                <button type="button" onClick={() => setCourse({ ...course, is_published: false })}
                  style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
                    ...(!course.is_published ? { background: "#ef4444", color: "#fff" } : { background: "rgba(255,255,255,0.04)", color: "var(--text-muted)" }) }}>
                  Draft
                </button>
              </div>
            </div>
          </div>
        </details>

        {/* ─── Lessons ─── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Lessons</h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Add video lessons from YouTube — unlimited</p>
          </div>
          <button onClick={addLesson} disabled={addingLesson} className="btn-accent" style={{ padding: "10px 18px", fontSize: 13, flexShrink: 0 }}>
            {addingLesson ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add Lesson
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="glass-card-static" style={{ padding: "16px 16px" }}>
              {/* Lesson header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(0,229,255,0.08)", color: "var(--accent)", fontSize: 12, fontWeight: 800, flexShrink: 0
                  }}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <input
                    value={lesson.title}
                    onChange={(e) => updateLocal(lesson.id, "title", e.target.value)}
                    onBlur={(e) => saveField(lesson.id, "title", e.target.value)}
                    placeholder="Lesson Title"
                    style={{ background: "transparent", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, outline: "none", minWidth: 0, flex: 1 }}
                  />
                </div>
                <button onClick={() => deleteLesson(lesson.id)}
                  style={{ padding: 8, borderRadius: 8, background: "rgba(239,68,68,0.06)", color: "#f87171", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>

              {/* YouTube URL + Duration */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 3 }}>YouTube URL</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "0 12px" }}>
                    <Link2 size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    <input
                      value={videoUrls[lesson.id] || ""}
                      onChange={(e) => handleLessonUrl(lesson.id, e.target.value)}
                      onBlur={() => saveLessonUrl(lesson.id)}
                      placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                      style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 13, outline: "none", padding: "10px 0", width: "100%" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
                  <div style={{ flex: "0 0 120px" }}>
                    <label style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 3 }}>Duration (min)</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "0 12px" }}>
                      <Clock size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                      <input type="number"
                        value={lesson.duration_minutes || 0}
                        onChange={(e) => updateLocal(lesson.id, "duration_minutes", parseInt(e.target.value) || 0)}
                        onBlur={(e) => saveField(lesson.id, "duration_minutes", parseInt(e.target.value) || 0)}
                        style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 13, outline: "none", padding: "10px 0", width: "100%" }}
                      />
                    </div>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "10px 0" }}>
                    <input type="checkbox" checked={lesson.is_free_preview || false}
                      onChange={(e) => { updateLocal(lesson.id, "is_free_preview", e.target.checked); saveField(lesson.id, "is_free_preview", e.target.checked); }}
                      style={{ width: 16, height: 16, accentColor: "#10b981" }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Free Preview</span>
                  </label>
                </div>
              </div>

              {/* Thumbnail */}
              {lesson.video_id && (
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 72, height: 40, borderRadius: 6, overflow: "hidden", background: "var(--bg-elevated)", flexShrink: 0 }}>
                    <img src={`https://img.youtube.com/vi/${lesson.video_id}/default.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      ID: <strong style={{ color: "var(--accent)" }}>{lesson.video_id}</strong>
                    </p>
                    <a href={`https://youtube.com/watch?v=${lesson.video_id}`} target="_blank" rel="noreferrer"
                      style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none" }}>
                      ▶ Open on YouTube
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}

          {lessons.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", border: "2px dashed rgba(255,255,255,0.06)", borderRadius: 16 }}>
              <Play size={40} style={{ color: "var(--text-muted)", opacity: 0.2, margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>No lessons yet</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Paste YouTube URLs to add video lessons</p>
              <button onClick={addLesson} className="btn-accent" style={{ padding: "10px 24px", fontSize: 13 }}>
                <Plus size={14} /> Add First Lesson
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
