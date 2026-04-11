"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { CATEGORIES, TEMPLATES, type QrCategory } from "@/lib/qr-templates";
import { MUSIC_PRESETS } from "@/lib/qr-music";
import {
  ArrowLeft, ArrowRight, Sparkles, Wand2, Check, Copy, Download,
  Music, Image as ImageIcon, Palette, Send, Eye, QrCode, ChevronDown, X, Loader2
} from "lucide-react";

const THEMES = [
  { id: "midnight", name: "Midnight", colors: ["#050816", "#0a1128", "#7c3aed", "#00e5ff"] },
  { id: "rose", name: "Rose", colors: ["#1a0a14", "#2d1020", "#ec4899", "#f43f5e"] },
  { id: "ocean", name: "Ocean", colors: ["#020c1b", "#0a192f", "#0ea5e9", "#06b6d4"] },
  { id: "sunset", name: "Sunset", colors: ["#1a0e05", "#2d1a0a", "#f97316", "#f59e0b"] },
  { id: "aurora", name: "Aurora", colors: ["#050d14", "#0a1a28", "#10b981", "#34d399"] },
];

function CreateWizardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const preCategory = searchParams.get("category") as QrCategory | null;
  const createdSlug = searchParams.get("created");

  const [step, setStep] = useState(createdSlug ? 5 : (preCategory ? 1 : 0));
  const [category, setCategory] = useState<QrCategory>(preCategory || "romantic");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [musicUrl, setMusicUrl] = useState("https://ia801309.us.archive.org/28/items/GooGooDollsIris/Goo%20Goo%20Dolls%20-%20Iris.mp3");
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [theme, setTheme] = useState("midnight");
  const [generating, setGenerating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [createdPage, setCreatedPage] = useState<any>(createdSlug ? { slug: createdSlug } : null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Load QR code for created page
  useEffect(() => {
    if (createdPage?.slug) {
      generateQR(createdPage.slug);
    }
  }, [createdPage]);

  async function generateQR(slug: string) {
    try {
      const QRCode = (await import("qrcode")).default;
      const url = `${window.location.origin}/g/${slug}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400, margin: 2,
        color: { dark: "#ffffff", light: "#050816" },
      });
      setQrDataUrl(dataUrl);
    } catch (e) { console.error("QR generation error:", e); }
  }

  async function handleAIGenerate() {
    setAiLoading(true);
    setError("");
    try {
      const res = await fetch("/api/qr-pages/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, context: recipientName ? `Recipient: ${recipientName}` : "" }),
      });
      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
      } else {
        setError(data.error || "AI-ga fariin ma soo saari karo hadda");
      }
    } catch {
      setError("Khalad ayaa dhacay. Markale isku day.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleCreate() {
    setGenerating(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/login"); return; }

      const res = await fetch("/api/qr-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category, message, sender_name: senderName, recipient_name: recipientName,
          music_url: musicUrl, images, theme,
        }),
      });
      const data = await res.json();
      if (data.page) {
        setCreatedPage(data.page);
        setStep(5);
      } else {
        setError(data.error || "Error creating page");
      }
    } catch {
      setError("Khalad ayaa dhacay");
    } finally {
      setGenerating(false);
    }
  }

  function toggleAudioPreview(url: string) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioPlaying && musicUrl === url) {
      setAudioPlaying(false);
      return;
    }
    if (url) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
      setAudioPlaying(true);
    }
  }

  function addImage() {
    if (imageInput.trim() && images.length < 5) {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  }

  function removeImage(idx: number) {
    setImages(images.filter((_, i) => i !== idx));
  }

  function copyLink() {
    const url = `${window.location.origin}/g/${createdPage?.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQR() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-salaan-${createdPage?.slug}.png`;
    a.click();
  }

  const pageUrl = createdPage?.slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/g/${createdPage.slug}` : "";
  const templates = TEMPLATES[category] || [];
  const catInfo = CATEGORIES.find(c => c.key === category);

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 0", maxWidth: 700, margin: "0 auto" }}>
        <Link href="/greetings" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", textDecoration: "none", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          <ArrowLeft size={16} /> Dib u noqo
        </Link>

        {/* Progress */}
        {step < 5 && (
          <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
            {["Nooca", "Fariinta", "Macluumaad", "Media", "Preview"].map((label, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{
                  height: 3, borderRadius: 3,
                  background: i <= step ? (catInfo?.color || "var(--accent)") : "rgba(255,255,255,0.06)",
                  transition: "all 0.4s ease",
                }} />
                <div style={{ fontSize: 9, marginTop: 4, color: i <= step ? "var(--text-secondary)" : "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px" }}>

        {/* Step 0: Category */}
        {step === 0 && (
          <div className="animate-up">
            <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800, marginBottom: 8 }}>
              Dooro <span className="gradient-text">nooca</span> fariintaada
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 28 }}>Nooca fariimaha qaybaha kala duwan</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
              {CATEGORIES.map((cat) => (
                <button key={cat.key} onClick={() => { setCategory(cat.key); setStep(1); }}
                  className="glass-card" style={{ padding: "20px 14px", cursor: "pointer", textAlign: "center", border: category === cat.key ? `2px solid ${cat.color}` : "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{cat.labelSo}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>{cat.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Message */}
        {step === 1 && (
          <div className="animate-up">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ fontSize: 28 }}>{catInfo?.icon}</div>
              <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>{catInfo?.labelSo}</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Dooro template ama ku qor fariintaada</p>
              </div>
            </div>

            {/* AI Generate Button */}
            <button onClick={handleAIGenerate} disabled={aiLoading}
              style={{
                width: "100%", padding: "14px 20px", marginBottom: 20,
                background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))",
                border: "1px solid rgba(124,58,237,0.25)", borderRadius: 12,
                color: "#a78bfa", fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.3s ease",
              }}>
              {aiLoading ? <><Loader2 size={18} className="qr-spin" /> Waa la soo saareyaa...</> : <><Wand2 size={18} /> Iiga qor fariin — AI</>}
            </button>

            {/* Templates */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Templates</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 240, overflowY: "auto" }}>
                {templates.map((t) => (
                  <button key={t.id} onClick={() => !t.isPremium && setMessage(t.text)}
                    style={{
                      padding: "12px 14px", borderRadius: 10, textAlign: "left", cursor: t.isPremium ? "not-allowed" : "pointer",
                      background: message === t.text ? `${catInfo?.color}15` : "rgba(255,255,255,0.02)",
                      border: message === t.text ? `1px solid ${catInfo?.color}40` : "1px solid rgba(255,255,255,0.04)",
                      color: t.isPremium ? "var(--text-muted)" : "var(--text-secondary)",
                      fontSize: 13, lineHeight: 1.5, position: "relative",
                      opacity: t.isPremium ? 0.5 : 1,
                    }}>
                    {t.text}
                    {t.isPremium && <span style={{ position: "absolute", top: 6, right: 8, fontSize: 9, background: "rgba(245,158,11,0.15)", color: "#f59e0b", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>PREMIUM</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom message */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Ama ku qor fariintaada</div>
              <textarea
                className="glass-input"
                rows={4}
                placeholder="Halkan ku qor fariintaada Af-Soomaaliga ah..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ resize: "vertical", minHeight: 100 }}
              />
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, textAlign: "right" }}>{message.length} xaraf</div>
            </div>

            {error && <div style={{ color: "#f87171", fontSize: 13, marginTop: 12, padding: "10px 14px", background: "rgba(239,68,68,0.08)", borderRadius: 8 }}>{error}</div>}

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(0)} className="btn-ghost" style={{ flex: 1 }}>
                <ArrowLeft size={16} /> Dib u noqo
              </button>
              <button onClick={() => { if (message.trim()) setStep(2); }} className="btn-accent" style={{ flex: 2, justifyContent: "center", opacity: message.trim() ? 1 : 0.4, pointerEvents: message.trim() ? "auto" : "none", background: catInfo?.gradient }}>
                Sii wad <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Personalize */}
        {step === 2 && (
          <div className="animate-up">
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 8 }}>Macluumaad dheeraad ah</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 28 }}>Ku dar magacaaga iyo qofka aad u direyso (ikhtiyaari)</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Magacaaga (sender)</label>
                <input className="glass-input" placeholder="Tusaale: Maxamed" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Magaca qofka (recipient)</label>
                <input className="glass-input" placeholder="Tusaale: Xaliimo" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button onClick={() => setStep(1)} className="btn-ghost" style={{ flex: 1 }}><ArrowLeft size={16} /> Dib</button>
              <button onClick={() => setStep(3)} className="btn-accent" style={{ flex: 2, justifyContent: "center", background: catInfo?.gradient }}>Sii wad <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 3: Media & Theme */}
        {step === 3 && (
          <div className="animate-up">
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 24 }}>Media & Theme</h2>

            {/* Music selection */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Music size={18} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 13, fontWeight: 700 }}>Muusig</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
                {MUSIC_PRESETS.map((m) => (
                  <button key={m.id}
                    onClick={() => { if (!m.isPremium) { setMusicUrl(m.url); toggleAudioPreview(m.url); } }}
                    style={{
                      padding: "12px 10px", borderRadius: 10, cursor: m.isPremium ? "not-allowed" : "pointer",
                      background: musicUrl === m.url ? "rgba(0,229,255,0.08)" : "rgba(255,255,255,0.02)",
                      border: musicUrl === m.url ? "1px solid rgba(0,229,255,0.3)" : "1px solid rgba(255,255,255,0.04)",
                      textAlign: "center", color: "var(--text)", fontSize: 12, fontWeight: 600,
                      opacity: m.isPremium ? 0.4 : 1, position: "relative",
                    }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                    {m.nameSo}
                    {m.isPremium && <span style={{ display: "block", fontSize: 9, color: "#f59e0b", marginTop: 2 }}>Premium</span>}
                    {musicUrl === m.url && <Check size={12} style={{ position: "absolute", top: 6, right: 6, color: "var(--accent)" }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Images */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <ImageIcon size={18} style={{ color: "#a78bfa" }} />
                <span style={{ fontSize: 13, fontWeight: 700 }}>Sawirro (max 5)</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input className="glass-input" placeholder="Image URL ku geli..." value={imageInput} onChange={(e) => setImageInput(e.target.value)} style={{ flex: 1 }} />
                <button onClick={addImage} disabled={!imageInput.trim() || images.length >= 5} className="btn-ghost" style={{ flexShrink: 0 }}>
                  Ku dar
                </button>
              </div>
              {images.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", position: "relative", border: "1px solid var(--border)" }}>
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => removeImage(i)} style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Theme */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Palette size={18} style={{ color: "#f59e0b" }} />
                <span style={{ fontSize: 13, fontWeight: 700 }}>Theme</span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {THEMES.map((t) => (
                  <button key={t.id} onClick={() => setTheme(t.id)}
                    style={{
                      width: 60, height: 60, borderRadius: 12, cursor: "pointer",
                      background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})`,
                      border: theme === t.id ? `2px solid ${t.colors[2]}` : "2px solid rgba(255,255,255,0.06)",
                      position: "relative", overflow: "hidden", transition: "all 0.3s ease",
                    }}>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: `linear-gradient(135deg, ${t.colors[2]}, ${t.colors[3]})`, opacity: 0.6 }} />
                    {theme === t.id && <Check size={16} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff" }} />}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{THEMES.find(t => t.id === theme)?.name}</div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button onClick={() => setStep(2)} className="btn-ghost" style={{ flex: 1 }}><ArrowLeft size={16} /> Dib</button>
              <button onClick={() => setStep(4)} className="btn-accent" style={{ flex: 2, justifyContent: "center", background: catInfo?.gradient }}>Preview <Eye size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 4: Preview & Generate */}
        {step === 4 && (
          <div className="animate-up">
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 24 }}>Preview & Samee</h2>

            {/* Preview card */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 24, borderColor: `${catInfo?.color}30` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>{catInfo?.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: catInfo?.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{catInfo?.labelSo}</span>
              </div>

              {recipientName && <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Gaarsiisan: <strong style={{ color: "var(--text-secondary)" }}>{recipientName}</strong></div>}

              <div style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text)", fontWeight: 500, marginBottom: 16, fontStyle: "italic", borderLeft: `3px solid ${catInfo?.color}40`, paddingLeft: 16 }}>
                {message}
              </div>

              {senderName && <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "right" }}>— {senderName}</div>}

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16, fontSize: 11, color: "var(--text-muted)" }}>
                {musicUrl && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Music size={12} /> Muusig</span>}
                {images.length > 0 && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ImageIcon size={12} /> {images.length} sawir</span>}
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Palette size={12} /> {THEMES.find(t => t.id === theme)?.name}</span>
              </div>
            </div>

            {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 16, padding: "10px 14px", background: "rgba(239,68,68,0.08)", borderRadius: 8 }}>{error}</div>}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(3)} className="btn-ghost" style={{ flex: 1 }}><ArrowLeft size={16} /> Dib</button>
              <button onClick={handleCreate} disabled={generating} className="btn-accent"
                style={{ flex: 2, justifyContent: "center", background: catInfo?.gradient, opacity: generating ? 0.7 : 1 }}>
                {generating ? <><Loader2 size={18} className="qr-spin" /> Waa la sameynayaa...</> : <><Sparkles size={18} /> Samee Bogga</>}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success / Share */}
        {step === 5 && createdPage && (
          <div className="animate-up" style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.15))", border: "1px solid rgba(16,185,129,0.3)" }}>
              <Check size={32} style={{ color: "#34d399" }} />
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 8 }}>Waad ku <span style={{ color: "#34d399" }}>guuleysatay</span>!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 32 }}>Boggaaga dareenka leh waa diyaar. Ku wadaag qofka aad jeceshahay.</p>

            {/* QR Code */}
            {qrDataUrl && (
              <div style={{ display: "inline-block", padding: 20, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
                <img src={qrDataUrl} alt="QR Code" style={{ width: 180, height: 180, borderRadius: 8 }} />
              </div>
            )}

            {/* Link */}
            <div style={{ display: "flex", gap: 8, maxWidth: 480, margin: "0 auto 24px", alignItems: "center" }}>
              <div className="glass-input" style={{ flex: 1, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--accent)" }}>
                {pageUrl}
              </div>
              <button onClick={copyLink}
                style={{ padding: "12px 16px", borderRadius: 10, background: copied ? "rgba(16,185,129,0.15)" : "rgba(0,229,255,0.1)", border: "1px solid " + (copied ? "rgba(16,185,129,0.3)" : "rgba(0,229,255,0.2)"), color: copied ? "#34d399" : "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={downloadQR} className="btn-outline" style={{ gap: 6 }}><Download size={16} /> Download QR</button>
              <Link href={`/g/${createdPage.slug}`} target="_blank" className="btn-accent" style={{ textDecoration: "none", gap: 6 }}><Eye size={16} /> Eeg Bogga</Link>
            </div>

            <div style={{ marginTop: 32 }}>
              <Link href="/greetings/create" style={{ color: "var(--text-muted)", fontSize: 13, textDecoration: "none" }}>
                ← Mid kale samee
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Loading...</span>
      </div>
    }>
      <CreateWizardInner />
    </Suspense>
  );
}
