"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin-config";
import { extractYouTubeId } from "@/lib/youtube";
import { ArrowLeft, Save, BookOpen, Image, Settings } from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "", slug: "", description: "", short_desc: "",
    intro_video_id: "", thumbnail_url: "",
    level: "beginner", language: "so", category_id: ""
  });

  useEffect(() => {
    // Admin gate
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || !isAdmin(session.user.email)) {
        alert("Access denied. Admin only.");
        window.location.href = "/";
        return;
      }
    });
    supabase.from("lp_categories").select("*").order("sort_order").then(({ data }) => setCategories(data || []));
  }, []);

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "title") updated.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
      return updated;
    });
  }

  function handleVideoUrl(value: string) {
    setVideoUrl(value);
    setFormData(prev => ({ ...prev, intro_video_id: extractYouTubeId(value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) { alert("Title and Description are required."); return; }
    setLoading(true);
    const payload: any = { ...formData, is_published: false };
    if (!payload.category_id) delete payload.category_id;
    if (!payload.intro_video_id) delete payload.intro_video_id;
    if (!payload.thumbnail_url) delete payload.thumbnail_url;

    const { data, error } = await supabase.from("lp_courses").insert([payload]).select();
    if (error) { alert("Error: " + error.message); setLoading(false); }
    else router.push(`/admin/courses/edit/${data[0].id}`);
  }

  const extractedId = formData.intro_video_id;

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <header style={{ padding: "24px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin" style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", display: "flex" }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800 }}>Create New Course</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Fill in the details, then add lessons</p>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px 60px" }}>
        <form onSubmit={handleSubmit}>
          {/* Details */}
          <div className="glass-card-static" style={{ padding: "24px 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <BookOpen size={15} style={{ color: "var(--accent)" }} />
              <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)" }}>Details</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Title *</label>
                <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Mastering Python" className="glass-input" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Slug</label>
                <input name="slug" value={formData.slug} onChange={handleChange} required placeholder="mastering-python" className="glass-input" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Short Summary</label>
                <input name="short_desc" value={formData.short_desc} onChange={handleChange} placeholder="One-line card description" className="glass-input" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Full course description..." className="glass-input" />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="glass-card-static" style={{ padding: "24px 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Image size={15} style={{ color: "var(--accent)" }} />
              <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)" }}>Media</h2>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Intro Video (YouTube URL)</label>
              <input value={videoUrl} onChange={e => handleVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                className="glass-input" />
              {extractedId && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
                    Extracted ID: <strong style={{ color: "var(--accent)" }}>{extractedId}</strong>
                  </p>
                  <div style={{ maxWidth: 280, aspectRatio: "16/9", borderRadius: 10, overflow: "hidden", background: "var(--bg-elevated)" }}>
                    <img src={`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="glass-card-static" style={{ padding: "24px 20px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Settings size={15} style={{ color: "var(--accent)" }} />
              <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)" }}>Settings</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Level</label>
                  <select name="level" value={formData.level} onChange={handleChange} className="glass-input">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Language</label>
                  <select name="language" value={formData.language} onChange={handleChange} className="glass-input">
                    <option value="so">Somali</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Category</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} className="glass-input">
                  <option value="">Select...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-accent"
            style={{ width: "100%", padding: "16px 0", fontSize: 15, fontWeight: 700 }}>
            {loading
              ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Creating...</>
              : <><Save size={18} /> Create Course & Add Lessons</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}
