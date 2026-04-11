"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  QrCode, Plus, Eye, Copy, Download, Trash2, ArrowLeft,
  Heart, Sparkles, ExternalLink, Check, BarChart3, Calendar
} from "lucide-react";
import { AdUnit } from "@/components/AdUnit";
import type { QrPage } from "@/lib/types";

const CATEGORY_META: Record<string, { icon: string; label: string; color: string }> = {
  romantic: { icon: "💕", label: "Jacayl", color: "#ec4899" },
  birthday: { icon: "🎂", label: "Dhalasho", color: "#f59e0b" },
  apology: { icon: "🙏", label: "Raali Galin", color: "#8b5cf6" },
  friendship: { icon: "🤝", label: "Saaxiibtinimo", color: "#06b6d4" },
  casual: { icon: "👋", label: "Salaan", color: "#10b981" },
  eid: { icon: "🌙", label: "Ciid", color: "#a78bfa" },
  motivational: { icon: "💪", label: "Dhiiri Galin", color: "#f97316" },
};

export default function MyPagesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [pages, setPages] = useState<QrPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/auth/login"); return; }
    const res = await fetch("/api/qr-pages");
    const data = await res.json();
    setPages(data.pages || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Ma hubtaa inaad masaxdo boggan?")) return;
    setDeletingId(id);
    await fetch(`/api/qr-pages?id=${id}`, { method: "DELETE" });
    setPages(pages.filter(p => p.id !== id));
    setDeletingId(null);
  }

  function copyLink(slug: string, id: string) {
    navigator.clipboard.writeText(`${window.location.origin}/g/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function downloadQR(slug: string) {
    const QRCode = (await import("qrcode")).default;
    const url = `${window.location.origin}/g/${slug}`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 400, margin: 2,
      color: { dark: "#ffffff", light: "#050816" },
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-salaan-${slug}.png`;
    a.click();
  }

  const totalViews = pages.reduce((s, p) => s + (p.view_count || 0), 0);

  if (loading) return (
    <div style={{ paddingTop: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Loading...</span>
    </div>
  );

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <Link href="/greetings" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", textDecoration: "none", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={16} /> QR Salaan
        </Link>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Bogageyga <span className="gradient-text">QR</span>
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Dhamaan bogagaaga dareenka leh</p>
          </div>
          <Link href="/greetings/create" className="btn-accent" style={{ textDecoration: "none", padding: "10px 24px", fontSize: 14, background: "linear-gradient(135deg, #ec4899, #f43f5e, #f59e0b)", backgroundSize: "200%", animation: "gradientShift 4s ease infinite" }}>
            <Plus size={16} /> Cusub Samee
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
          <div className="glass-card-static" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{pages.length}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>Bogagga</div>
          </div>
          <div className="glass-card-static" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{totalViews}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>Views</div>
          </div>
          <div className="glass-card-static" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{pages.length > 0 ? Math.round(totalViews / pages.length) : 0}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>Avg Views</div>
          </div>
        </div>

        {/* Pages List */}
        {pages.length === 0 ? (
          <div className="glass-card-static" style={{ padding: "60px 20px", textAlign: "center", borderStyle: "dashed" }}>
            <QrCode size={48} style={{ color: "var(--text-muted)", opacity: 0.3, margin: "0 auto 16px", display: "block" }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Wali bogag ma samayn</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>Samee bogagaaga koowaad ee dareenka leh</p>
            <Link href="/greetings/create" className="btn-accent" style={{ textDecoration: "none" }}>
              <Sparkles size={16} /> Bilow Hadda
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pages.map((page) => {
              const meta = CATEGORY_META[page.category] || { icon: "💌", label: page.category, color: "#00e5ff" };
              return (
                <div key={page.id} className="glass-card-static" style={{ padding: "16px 20px", position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Icon */}
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: `${meta.color}12`, border: `1px solid ${meta.color}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22,
                    }}>
                      {meta.icon}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{meta.label}</span>
                        {page.recipient_name && (
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>→ {page.recipient_name}</span>
                        )}
                      </div>
                      <div className="line-clamp-1" style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
                        {page.message}
                      </div>
                      <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 10, color: "var(--text-muted)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Eye size={10} /> {page.view_count} views</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Calendar size={10} /> {new Date(page.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => copyLink(page.slug, page.id)}
                        title="Copy link"
                        style={{ padding: 8, borderRadius: 8, background: copiedId === page.id ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)", border: "none", color: copiedId === page.id ? "#34d399" : "var(--text-muted)", cursor: "pointer" }}>
                        {copiedId === page.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                      <button onClick={() => downloadQR(page.slug)}
                        title="Download QR"
                        style={{ padding: 8, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                        <Download size={14} />
                      </button>
                      <Link href={`/g/${page.slug}`} target="_blank"
                        style={{ padding: 8, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <ExternalLink size={14} />
                      </Link>
                      <button onClick={() => handleDelete(page.id)}
                        disabled={deletingId === page.id}
                        title="Delete"
                        style={{ padding: 8, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "none", color: "var(--text-muted)", cursor: "pointer", opacity: deletingId === page.id ? 0.4 : 1 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Ad Placement */}
        <div style={{ marginTop: 40 }}>
          <AdUnit slot="my_pages_bottom" />
        </div>
      </div>
    </div>
  );
}
