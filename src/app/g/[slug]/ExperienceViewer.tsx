"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Volume2, VolumeX, Heart, Sparkles, ArrowRight, Zap } from "lucide-react";

const THEME_STYLES: Record<string, { bg: string; accent: string; accent2: string; glow: string; particleColor: string; gradientOverlay: string }> = {
  midnight: { bg: "#050816", accent: "#00e5ff", accent2: "#7c3aed", glow: "rgba(0,229,255,0.15)", particleColor: "#00e5ff", gradientOverlay: "linear-gradient(135deg, rgba(0,229,255,0.05), rgba(124,58,237,0.05))" },
  rose: { bg: "#0f0508", accent: "#ec4899", accent2: "#f43f5e", glow: "rgba(236,72,153,0.15)", particleColor: "#ec4899", gradientOverlay: "linear-gradient(135deg, rgba(236,72,153,0.05), rgba(244,63,94,0.05))" },
  ocean: { bg: "#020c1b", accent: "#0ea5e9", accent2: "#06b6d4", glow: "rgba(14,165,233,0.15)", particleColor: "#0ea5e9", gradientOverlay: "linear-gradient(135deg, rgba(14,165,233,0.05), rgba(6,182,212,0.05))" },
  sunset: { bg: "#0f0805", accent: "#f97316", accent2: "#f59e0b", glow: "rgba(249,115,22,0.15)", particleColor: "#f97316", gradientOverlay: "linear-gradient(135deg, rgba(249,115,22,0.05), rgba(245,158,11,0.05))" },
  aurora: { bg: "#030f0a", accent: "#10b981", accent2: "#34d399", glow: "rgba(16,185,129,0.15)", particleColor: "#10b981", gradientOverlay: "linear-gradient(135deg, rgba(16,185,129,0.05), rgba(52,211,153,0.05))" },
};

const CATEGORY_ICONS: Record<string, string> = {
  romantic: "💕", birthday: "🎂", apology: "🙏", friendship: "🤝",
  casual: "👋", eid: "🌙", motivational: "💪",
};

interface ExperienceViewerProps {
  page: {
    slug: string; category: string; message: string;
    sender_name?: string | null; recipient_name?: string | null;
    music_url?: string | null; images?: string[];
    theme?: string; is_premium?: boolean;
  };
}

type Phase = "ready" | "intro" | "message" | "images" | "complete";

export function ExperienceViewer({ page }: ExperienceViewerProps) {
  const themeKey = page.theme || "midnight";
  const theme = THEME_STYLES[themeKey] || THEME_STYLES.midnight;

  const [phase, setPhase] = useState<Phase>("ready");
  const [displayedText, setDisplayedText] = useState("");
  const [muted, setMuted] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showParticles, setShowParticles] = useState(true);
  const [particles, setParticles] = useState<any[]>([]);
  const [audioError, setAudioError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize audio object once
  useEffect(() => {
    if (page.music_url) {
      const audio = new Audio(page.music_url);
      audio.loop = true;
      audio.volume = 0.5;
      audio.onerror = () => setAudioError(true);
      audioRef.current = audio;
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [page.music_url]);

  function startExperience() {
    setPhase("intro");
    if (audioRef.current && !audioError) {
      audioRef.current.play().then(() => {
        setMuted(false);
      }).catch((err) => {
        console.warn("Autoplay still blocked or link failed:", err);
      });
    }
    
    // Auto-advance from intro to message after 2s
    setTimeout(() => setPhase("message"), 2000);
  }

  // Typing effect
  useEffect(() => {
    if (phase !== "message") return;
    let i = 0;
    const text = page.message;
    textIntervalRef.current = setInterval(() => {
      if (i <= text.length) {
        setDisplayedText(text.substring(0, i));
        i++;
      } else {
        if (textIntervalRef.current) clearInterval(textIntervalRef.current);
        // After typing, show images if any
        setTimeout(() => {
          if (page.images && page.images.length > 0) {
            setPhase("images");
          } else {
            setPhase("complete");
          }
        }, 1000);
      }
    }, 40);
    return () => { if (textIntervalRef.current) clearInterval(textIntervalRef.current); };
  }, [phase, page.message, page.images]);

  // Image slideshow
  useEffect(() => {
    if (phase !== "images" || !page.images?.length) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => {
        if (prev >= (page.images?.length || 1) - 1) {
          clearInterval(timer);
          setTimeout(() => setPhase("complete"), 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [phase, page.images]);

  // Audio toggle (for manual use later)
  function toggleAudio() {
    if (!audioRef.current) return;
    if (muted) {
      audioRef.current.play().catch(() => {});
      setMuted(false);
    } else {
      audioRef.current.pause();
      setMuted(true);
    }
  }

  // Generate particles only on the client
  useEffect(() => {
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 4,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="qr-experience" style={{
      minHeight: "100vh",
      background: theme.bg,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Background gradient */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, ${theme.glow}, transparent),
          radial-gradient(ellipse 60% 60% at 80% 100%, ${theme.glow.replace("0.15", "0.08")}, transparent),
          ${theme.gradientOverlay}
        `,
      }} />

      {/* Particles */}
      {showParticles && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
          {particles.map((p) => (
            <div key={p.id} className="qr-particle" style={{
              position: "absolute",
              left: `${p.left}%`,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: theme.particleColor,
              opacity: 0.4,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }} />
          ))}
        </div>
      )}

      {/* Music toggle */}
      {page.music_url && (
        <button onClick={toggleAudio}
          style={{
            position: "fixed", top: 20, right: 20, zIndex: 50,
            width: 44, height: 44, borderRadius: "50%",
            background: `rgba(255,255,255,0.06)`,
            backdropFilter: "blur(10px)",
            border: `1px solid rgba(255,255,255,0.1)`,
            color: muted ? "rgba(255,255,255,0.4)" : theme.accent,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s ease",
          }}>
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* READY PHASE / SPLASH */}
      {phase === "ready" && (
        <div style={{
          zIndex: 100, textAlign: "center", animation: "qrFadeIn 1s ease forwards",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 32
        }}>
          <div style={{
            fontSize: 84, animation: "qrPulse 2s infinite"
          }}>
            {CATEGORY_ICONS[page.category] || "💌"}
          </div>
          
          <h2 style={{ 
            fontSize: "clamp(1.5rem, 5vw, 2.2rem)", fontWeight: 800, color: "white",
            letterSpacing: "-0.02em", textShadow: `0 0 30px ${theme.accent}40`
          }}>
            Kani waa fariin kuuaradsan...
          </h2>

          <button onClick={startExperience} className="qr-start-btn" style={{
            padding: "18px 48px", borderRadius: 40,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
            color: "#000", fontWeight: 800, fontSize: 18,
            border: "none", cursor: "pointer",
            boxShadow: `0 10px 40px ${theme.accent}60`,
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <Heart size={22} fill="currentColor" />
              FURI FARIINTA
          </button>
          
          {page.music_url && (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
              <Zap size={12} style={{ display: "inline", marginRight: 4 }} />
              Muusig ayaa la socda
            </div>
          )}
        </div>
      )}

      {/* INTRO PHASE */}
      {phase === "intro" && (
        <div className="qr-intro-anim" style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          zIndex: 10, padding: 20,
        }}>
          <div style={{
            fontSize: 64,
            animation: "qrPulse 1.5s ease-in-out infinite",
          }}>
            {CATEGORY_ICONS[page.category] || "💌"}
          </div>
          {page.recipient_name && (
            <div style={{
              fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
              fontWeight: 700,
              color: theme.accent,
              opacity: 0,
              animation: "qrFadeIn 1s ease 0.5s forwards",
              textAlign: "center",
            }}>
              {page.recipient_name}, kani waa adiga...
            </div>
          )}
        </div>
      )}

      {/* MESSAGE PHASE */}
      {(phase === "message" || phase === "images" || phase === "complete") && (
        <div style={{
          zIndex: 10,
          maxWidth: 600,
          width: "100%",
          padding: "40px 24px",
          textAlign: "center",
          animation: "qrFadeIn 0.8s ease forwards",
        }}>
          {/* Category badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 20,
            background: `${theme.accent}15`,
            border: `1px solid ${theme.accent}25`,
            color: theme.accent,
            fontSize: 11, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.1em",
            marginBottom: 24,
          }}>
            {CATEGORY_ICONS[page.category]} {page.category}
          </div>

          {/* Recipient */}
          {page.recipient_name && (
            <div style={{
              fontSize: 14, color: "rgba(255,255,255,0.5)",
              marginBottom: 16, fontWeight: 500,
            }}>
              Gaarsiisan: <span style={{ color: theme.accent }}>{page.recipient_name}</span>
            </div>
          )}

          {/* Message with typing effect */}
          <div style={{
            fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)",
            lineHeight: 1.9,
            fontWeight: 500,
            color: "rgba(255,255,255,0.92)",
            marginBottom: 24,
            minHeight: "3em",
            fontStyle: "italic",
            position: "relative",
          }}>
            “{displayedText}
            {phase === "message" && displayedText.length < page.message.length && (
              <span className="qr-cursor" style={{
                display: "inline-block",
                width: 2, height: "1.2em",
                background: theme.accent,
                verticalAlign: "text-bottom",
                marginLeft: 2,
              }} />
            )}
            {displayedText.length >= page.message.length && "”"}
          </div>

          {/* Sender */}
          {page.sender_name && displayedText.length >= page.message.length && (
            <div style={{
              fontSize: 15, color: "rgba(255,255,255,0.6)",
              fontWeight: 600,
              animation: "qrFadeIn 0.5s ease forwards",
            }}>
              — {page.sender_name}
            </div>
          )}
        </div>
      )}

      {/* IMAGES PHASE */}
      {phase === "images" && page.images && page.images.length > 0 && (
        <div style={{
          zIndex: 10,
          maxWidth: 400, width: "100%",
          padding: "0 24px",
          marginTop: 20,
        }}>
          <div style={{
            borderRadius: 16,
            overflow: "hidden",
            aspectRatio: "4/3",
            position: "relative",
            border: `1px solid ${theme.accent}20`,
          }}>
            {page.images.map((img, i) => (
              <img key={i} src={img} alt=""
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  opacity: currentImage === i ? 1 : 0,
                  transition: "opacity 1s ease",
                  animation: currentImage === i ? "qrKenBurns 6s ease forwards" : "none",
                }} />
            ))}
          </div>
          {page.images.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
              {page.images.map((_, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: currentImage === i ? theme.accent : "rgba(255,255,255,0.15)",
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* COMPLETE PHASE — CTA */}
      {phase === "complete" && (
        <div style={{
          zIndex: 10,
          marginTop: 40,
          textAlign: "center",
          animation: "qrFadeIn 1s ease 0.3s forwards",
          opacity: 0,
          padding: "0 24px",
        }}>
          <div style={{ height: 1, width: 60, background: `${theme.accent}30`, margin: "0 auto 32px" }} />

          {/* Viral CTA */}
          <Link href="/greetings" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 28px", borderRadius: 12,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
            color: "#000", fontWeight: 700, fontSize: 14,
            textDecoration: "none",
            boxShadow: `0 4px 30px ${theme.glow}`,
            transition: "all 0.3s ease",
          }}>
            <Sparkles size={18} />
            Adiga sidoo kale sameyso
            <ArrowRight size={16} />
          </Link>

          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 16 }}>
            Powered by <strong>THEQNEW</strong>
          </div>
        </div>
      )}

      {/* Watermark for free users */}
      {!page.is_premium && phase === "complete" && (
        <div style={{
          position: "fixed", bottom: 12, right: 12, zIndex: 50,
          fontSize: 9, color: "rgba(255,255,255,0.15)",
          fontWeight: 600, letterSpacing: "0.1em",
        }}>
          THEQNEW.COM
        </div>
      )}
    </div>
  );
}
