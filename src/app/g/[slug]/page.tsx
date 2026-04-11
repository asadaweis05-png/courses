import { createServerSupabase } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExperienceViewer } from "./ExperienceViewer";

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: page } = await supabase.from("qr_pages").select("*").eq("slug", slug).single();

  if (!page) return { title: "QR Salaan — THEQNEW" };

  const categoryLabels: Record<string, string> = {
    romantic: "💕 Fariin Jacayl",
    birthday: "🎂 Hambalyo Dhalasho",
    apology: "🙏 Raali Galin",
    friendship: "🤝 Saaxiibtinimo",
    casual: "👋 Salaan",
    eid: "🌙 Ciid Wanaagsan",
    motivational: "💪 Dhiiri Galin",
  };

  const previewText = page.message?.substring(0, 120) + (page.message?.length > 120 ? "..." : "");

  return {
    title: `${categoryLabels[page.category] || "QR Salaan"} — THEQNEW`,
    description: previewText,
    openGraph: {
      title: categoryLabels[page.category] || "QR Salaan",
      description: previewText,
      type: "website",
    },
  };
}

export default async function ExperiencePage({ params }: PageParams) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: page } = await supabase.from("qr_pages").select("*").eq("slug", slug).single();

  if (!page) notFound();

  // Increment view count (fire and forget)
  supabase.rpc("increment_qr_view_count", { page_slug: slug }).then(() => {});

  return <ExperienceViewer page={page} />;
}
