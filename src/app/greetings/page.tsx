"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { CATEGORIES, QUICK_SEND_TEMPLATES } from "@/lib/qr-templates";
import { Heart, ArrowRight, Sparkles, Zap, Send, QrCode } from "lucide-react";
import { AdUnit } from "@/components/AdUnit";

export default function GreetingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [sendingQuick, setSendingQuick] = useState<string | null>(null);

  async function handleQuickSend(template: typeof QUICK_SEND_TEMPLATES[0]) {
    setSendingQuick(template.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/login"); return; }

      const res = await fetch("/api/qr-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: template.category,
          message: template.text,
          theme: "midnight",
        }),
      });
      const data = await res.json();
      if (data.page) {
        router.push(`/greetings/create?created=${data.page.slug}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingQuick(null);
    }
  }

  return (
    <div className="qr-landing-page" style={{ paddingTop: 64, minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ padding: "80px 20px 60px", textAlign: "center", position: "relative" }}>
        <div className="qr-hero-glow" />
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="badge" style={{ marginBottom: 20, display: "inline-flex", gap: 6, background: "rgba(236,72,153,0.1)", borderColor: "rgba(236,72,153,0.2)", color: "#ec4899" }}>
            <Heart size={12} /> QR SALAAN
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
            U Samee Qof Aan{" "}
            <span className="gradient-text" style={{ background: "linear-gradient(135deg, #ec4899, #f43f5e, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Iloobi Karin
            </span>
            <br />Bogag Dareen Leh
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Samee fariimo qurux badan oo dareen leh, ku wadaag QR code ama link — qofka furayaa wuxuu arkayaa waayo-aragnimo dhab ah.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/greetings/create" className="btn-accent" style={{ padding: "14px 32px", fontSize: "0.95rem", background: "linear-gradient(135deg, #ec4899, #f43f5e, #f59e0b)", backgroundSize: "200%", animation: "gradientShift 4s ease infinite" }}>
              <Sparkles size={18} /> Bilow Hadda
            </Link>
            <Link href="/greetings/my-pages" className="btn-outline" style={{ padding: "14px 32px", fontSize: "0.95rem", borderColor: "rgba(236,72,153,0.3)", color: "#ec4899" }}>
              <QrCode size={18} /> Bogageyga
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Placement */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px" }}>
        <AdUnit slot="greetings_landing_middle" />
      </div>

      {/* Quick Send */}
      <section style={{ padding: "40px 20px 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
              <Zap size={22} style={{ display: "inline", verticalAlign: "middle", color: "#f59e0b", marginRight: 8 }} />
              Dir <span className="gradient-text">Hadda</span> — Hal Gujis
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Salaan fudud oo degdeg ah — gujis oo dir</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {QUICK_SEND_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleQuickSend(t)}
                disabled={sendingQuick === t.id}
                className="glass-card"
                style={{
                  padding: "16px 14px",
                  cursor: "pointer",
                  textAlign: "center",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{t.text}</div>
                {sendingQuick === t.id && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(5,8,22,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="spinner" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "40px 20px 80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
              Dooro <span className="gradient-text">Nooca</span> Fariintaada
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Qaybaha kala duwan ee fariimaha</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/greetings/create?category=${cat.key}`}
                className="qr-category-card glass-card"
                style={{ padding: "28px 20px", textAlign: "center", textDecoration: "none", cursor: "pointer", position: "relative", overflow: "hidden" }}
              >
                <div className="qr-cat-icon-wrap" style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", background: `${cat.color}15`, border: `1px solid ${cat.color}25`, fontSize: 28, transition: "all 0.3s ease" }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>{cat.labelSo}</h3>
                <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>{cat.description}</p>
                <div className="qr-cat-arrow" style={{ position: "absolute", bottom: 12, right: 12, opacity: 0, transition: "all 0.3s ease", color: cat.color }}>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "60px 20px 80px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800, textAlign: "center", marginBottom: 48, letterSpacing: "-0.02em" }}>
            Sidee u <span className="gradient-text">shaqeysaa</span>?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[
              { step: "1", emoji: "✍️", title: "Qor ama dooro fariin", desc: "Dooro template ama ku qor fariintaada Soomaaliga ah." },
              { step: "2", emoji: "🎨", title: "Qurxi bogagga", desc: "Ku dar muusig, sawirro, iyo theme qurux badan." },
              { step: "3", emoji: "📲", title: "Wadaag QR code", desc: "U dir link-ga ama QR code qofka aad u qorsheysay." },
              { step: "4", emoji: "✨", title: "Waayo-aragnimo", desc: "Qofka furayaa wuxuu arkayaa bogag animated oo qurux badan." },
            ].map((s, i) => (
              <div key={i} className="glass-card-static" style={{ padding: 28, textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--gradient-1)", backgroundSize: "200%", animation: "gradientShift 4s ease infinite", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 800, fontSize: 16, margin: "0 auto 16px" }}>{s.step}</div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.emoji}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
