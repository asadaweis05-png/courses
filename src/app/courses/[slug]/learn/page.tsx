"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { CheckCircle, Play, ChevronRight, Sparkles, X, Send, Bot } from "lucide-react";

export default function LearnPage() {
  const supabase = createClient();
  const params = useParams();
  const slug = params.slug as string;
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // AI Tutor State
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: c } = await supabase.from("lp_courses").select("*, lp_lessons(*)").eq("slug", slug).single();
    if (!c) return;
    setCourse(c);
    const sorted = (c.lp_lessons || []).sort((a: any, b: any) => a.order_index - b.order_index);
    setLessons(sorted);
    if (sorted.length > 0) setCurrentLesson(sorted[0]);

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: prog } = await supabase.from("lp_progress").select("lesson_id, completed").eq("user_id", session.user.id).eq("course_id", c.id);
      const map: Record<string, boolean> = {};
      (prog || []).forEach((p: any) => { map[p.lesson_id] = p.completed; });
      setProgress(map);
    }
  }

  async function markComplete(lessonId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !course) return;
    await supabase.from("lp_progress").upsert({
      user_id: session.user.id, lesson_id: lessonId, course_id: course.id, completed: true, completed_at: new Date().toISOString()
    }, { onConflict: "user_id,lesson_id" });
    setProgress(p => ({ ...p, [lessonId]: true }));
  }

  const completedCount = Object.values(progress).filter(Boolean).length;
  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  async function askAI(action: string) {
    if (!currentLesson) return;
    setAiLoading(true);
    setAiResponse("");
    try {
      const lessonText = `${currentLesson.title}\n\n${currentLesson.description || ""}`;
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, lessonText, customQuestion })
      });
      const data = await res.json();
      if (data.error) setAiResponse(`Error: ${data.error}`);
      else setAiResponse(data.result);
    } catch (err: any) {
      setAiResponse(`Error connecting to AI: ${err.message}`);
    }
    setAiLoading(false);
    if (action === "custom_question") setCustomQuestion("");
  }

  if (!course) return <div className="pt-24 text-center text-[#64748b]">Loading...</div>;

  return (
    <div className="pt-16 flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-80" : "w-0"} bg-[#0d1220] border-r border-white/[0.07] flex-shrink-0 overflow-hidden transition-all duration-200 flex flex-col`}>
        <div className="p-5 border-b border-white/[0.07]">
          <h2 className="text-sm font-bold text-white truncate">{course.title}</h2>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-[#64748b] mb-1.5">
              <span>{completedCount}/{lessons.length} lessons</span>
              <span className="text-[#00e5ff] font-bold">{pct}%</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }}/></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {lessons.map((l, i) => (
            <button key={l.id} onClick={() => setCurrentLesson(l)}
              className={`w-full text-left px-5 py-3.5 flex items-center gap-3 border-b border-white/[0.04] transition-colors ${
                currentLesson?.id === l.id ? "bg-[#00e5ff]/[0.08]" : "hover:bg-white/[0.02]"
              }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                progress[l.id] ? "bg-[#10b981] text-white" : currentLesson?.id === l.id ? "bg-[#00e5ff] text-black" : "bg-white/[0.06] text-[#64748b]"
              }`}>
                {progress[l.id] ? <CheckCircle size={12}/> : i + 1}
              </div>
              <span className={`text-xs truncate ${currentLesson?.id === l.id ? "text-white font-semibold" : "text-[#94a3b8]"}`}>{l.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden absolute top-20 left-2 z-10 bg-[#0d1220] border border-white/[0.07] rounded-lg p-2 text-white">
          <ChevronRight size={16} className={sidebarOpen ? "rotate-180" : ""}/>
        </button>

        {currentLesson ? (
          <>
            <div className="bg-black flex-shrink-0">
              <div className="max-w-5xl mx-auto">
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                  <iframe src={`https://www.youtube-nocookie.com/embed/${currentLesson.video_id}?autoplay=1&modestbranding=1&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}/>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/[0.07] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">{currentLesson.title}</h3>
                <p className="text-xs text-[#64748b] mt-1">{currentLesson.duration_minutes} min · Lesson {lessons.indexOf(currentLesson) + 1} of {lessons.length}</p>
              </div>
              <div className="flex gap-3">
                {!progress[currentLesson.id] && (
                  <button onClick={() => markComplete(currentLesson.id)} className="btn-accent text-xs !py-2 !px-4">
                    <CheckCircle size={14}/> Mark Complete
                  </button>
                )}
                {lessons.indexOf(currentLesson) < lessons.length - 1 && (
                  <button onClick={() => setCurrentLesson(lessons[lessons.indexOf(currentLesson) + 1])} className="btn-outline text-xs !py-2 !px-4">
                    Next <ChevronRight size={14}/>
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#64748b]">Select a lesson to start</div>
        )}
      </div>

      {/* Floating AI Tutor Button */}
      {!aiPanelOpen && currentLesson && (
        <button onClick={() => setAiPanelOpen(true)}
          className="fixed bottom-6 right-6 z-40 btn-accent shadow-[0_0_30px_rgba(0,229,255,0.3)] !px-5 !py-3 !rounded-full group animate-up">
          <Sparkles size={18} className="group-hover:animate-spin" /> Ask AI Tutor
        </button>
      )}

      {/* AI Tutor Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-[400px] max-w-[90vw] bg-[var(--bg-elevated)] border-l border-white/10 z-50 transform transition-transform duration-300 flex flex-col shadow-2xl ${aiPanelOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[var(--bg-card)]">
          <h3 className="font-extrabold flex items-center gap-2 text-[var(--accent)]"><Bot size={20} /> AI Course Tutor</h3>
          <button onClick={() => setAiPanelOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20}/></button>
        </div>
        
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 relative">
          <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />
          {aiResponse ? (
            <div className="relative z-10">
              <div className="flex justify-start mb-4">
                <button onClick={() => setAiResponse("")} className="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest font-bold">← Clear Chat</button>
              </div>
              <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed p-4 rounded-xl glass border-white/5">
                {aiResponse}
              </div>
            </div>
          ) : (
             <div className="flex flex-col gap-3 relative z-10">
               <p className="text-xs text-gray-400 mb-2 font-medium">How can I help you with <strong>{currentLesson?.title}</strong>?</p>
               <button onClick={() => askAI('summarize')} className="btn-outline !justify-start !py-2.5 text-xs"><span className="text-xl mr-1">📝</span> Summarize Lesson</button>
               <button onClick={() => askAI('translate_somali')} className="btn-outline !justify-start !py-2.5 text-xs"><span className="text-xl mr-1">🇸🇴</span> Translate to Somali</button>
               <button onClick={() => askAI('notes')} className="btn-outline !justify-start !py-2.5 text-xs"><span className="text-xl mr-1">✍️</span> Create Organized Notes</button>
               <button onClick={() => askAI('quiz')} className="btn-outline !justify-start !py-2.5 text-xs"><span className="text-xl mr-1">❓</span> Generate 5-Question Quiz</button>
               <button onClick={() => askAI('explain')} className="btn-outline !justify-start !py-2.5 text-xs"><span className="text-xl mr-1">🧠</span> Explain Simply w/ Examples</button>
             </div>
          )}
          {aiLoading && (
            <div className="absolute inset-0 bg-[var(--bg-elevated)]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-glow mb-4"
                style={{ background: "var(--gradient-1)", backgroundSize: "200% 200%", animation: "gradientShift 2s ease infinite" }}>
                <Sparkles size={24} className="text-black animate-spin" />
              </div>
              <span className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase">Thinking...</span>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-white/10 bg-[var(--bg-card)]">
           <form onSubmit={(e) => { e.preventDefault(); askAI('custom_question'); }} className="flex gap-2">
             <input value={customQuestion} onChange={e=>setCustomQuestion(e.target.value)} required placeholder="Ask a specific question..." className="glass-input !py-3 text-xs flex-1" />
             <button type="submit" disabled={aiLoading || !customQuestion} className="btn-accent !px-4 disabled:opacity-50"><Send size={16}/></button>
           </form>
        </div>
      </div>

    </div>
  );
}
