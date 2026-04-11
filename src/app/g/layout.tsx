import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Salaan — THEQNEW",
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="qr-experience-layout" style={{ position: "relative" }}>
      <style>{`
        .qr-experience-layout ~ .mesh-bg,
        .qr-experience-layout ~ .grid-pattern { display: none !important; }
        nav { display: none !important; }
        main { padding: 0 !important; }
      `}</style>
      {children}
    </div>
  );
}
