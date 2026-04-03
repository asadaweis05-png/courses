"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ArrowRight, CheckCircle } from "lucide-react";

export function EnrollButton({ 
  courseId, 
  courseSlug
}: { 
  courseId: string; 
  courseSlug: string; 
}) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleEnroll() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/login"); return; }

      const { error } = await supabase.from("lp_enrollments").upsert({
        user_id: session.user.id, course_id: courseId
      }, { onConflict: "user_id,course_id" });

      if (error) {
        alert("Enrollment error: " + error.message);
      } else {
        setEnrolled(true);
        setTimeout(() => router.push(`/courses/${courseSlug}/learn`), 600);
      }
    } catch (err: any) {
      if (err.message?.includes("fetch")) {
        alert("Network error: Please check if Supabase environment variables are set correctly in Vercel.");
      } else {
        alert("An unexpected error occurred: " + err.message);
      }
    }
    setLoading(false);
  }

  if (enrolled) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#10b981", fontSize: 14, fontWeight: 700 }}>
      <CheckCircle size={18}/> Enrolled!
    </div>
  );

  return (
    <button onClick={handleEnroll} disabled={loading} className="btn-accent" style={{ padding: "12px 32px", fontSize: 15 }}>
      {loading ? "Enrolling..." : <>Enroll Now — Free <ArrowRight size={18} style={{ marginLeft: 8 }} /></>}
    </button>
  );
}
