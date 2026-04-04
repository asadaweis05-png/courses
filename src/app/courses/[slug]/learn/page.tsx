"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { CheckCircle, Play, ChevronRight, Sparkles, X, Send, Bot, Menu, Clock } from "lucide-react";

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
    <div className="pt-16 flex h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Drawer on Mobile, Sticky on Desktop */}
      <div className={`
        fixed inset-y-16 left-0 z-40 w-72 bg-[#0d1220] border-r border-white/[0.07] transform transition-transform duration-300 md:relative md:translate-x-0 md:inset-0 md:z-auto md:w-80 md:flex flex-col shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"}
      `}>
        <div className="p-4 md:p-5 border-b border-white/[0.07] flex items-center justify-between">
          <h2 className="text-xs md:text-sm font-bold text-white truncate pr-4">{course.title}</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
        
        <div className="px-4 md:px-5 py-4 border-b border-white/[0.04] bg-white/[0.02]">
          <div className="flex justify-between text-[10px] text-[#64748b] mb-1.5 font-bold uppercase tracking-wider">
            <span>{completedCount}/{lessons.length} lessons</span>
            <span className="text-[#00e5ff]">{pct}%</span>
          </div>
          <div className="progress-track !h-1.5 shadow-inner"><div className="progress-fill !bg-gradient-to-r !from-[#00e5ff] !to-[#7c3aed]" style={{ width: `${pct}%` }}/></div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {lessons.map((l, i) => (
            <button key={l.id} onClick={() => { setCurrentLesson(l); if(window.innerWidth < 768) setSidebarOpen(false); }}
              className={`w-full text-left px-5 py-4 flex items-center gap-3 border-b border-white/[0.02] transition-all hover:bg-white/[0.03] group ${
                currentLesson?.id === l.id ? "bg-[#00e5ff]/[0.06] border-l-2 border-l-[#00e5ff]" : ""
              }`}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-black ${
                progress[l.id] ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]" : currentLesson?.id === l.id ? "bg-[#00e5ff] text-black" : "bg-white/[0.05] text-[#475569] group-hover:text-gray-400"
              }`}>
                {progress[l.id] ? <CheckCircle size={12}/> : i + 1}
              </div>
              <span className={`text-[11px] md:text-xs truncate transition-colors ${currentLesson?.id === l.id ? "text-white font-black" : "text-[#94a3b8]"}`}>{l.title}</span>
              {currentLesson?.id === l.id && <Play size={10} className="ml-auto text-[#00e5ff] animate-pulse" />}
            </button>
          ))}
        </div>

        {/* AI Tutor Entry inside Sidebar */}
        <div className="p-4 border-t border-white/[0.07] bg-black/20">
          <button onClick={() => setAiPanelOpen(true)}
            className="w-full btn-accent !py-2.5 !px-4 text-[11px] !rounded-xl !justify-center shadow-[0_0_20px_rgba(0,229,255,0.1)] hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]">
            <Bot size={14} /> AI Assistant
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#050816] relative overflow-hidden">
        {/* Mobile Toggle & Lesson Title Overlay */}
        <div className="flex md:hidden items-center gap-3 p-3 bg-[#0d1220]/80 border-b border-white/[0.07] backdrop-blur-md">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white/[0.05] text-white">
            <Menu size={18} />
          </button>
          <span className="text-xs font-bold text-gray-300 truncate">{currentLesson?.title || "Select Lesson"}</span>
        </div>

        {currentLesson ? (
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="bg-black aspect-video w-full max-h-[70vh] flex-shrink-0">
               <iframe 
                 src={`https://www.youtube-nocookie.com/embed/${currentLesson.video_id}?autoplay=1&modestbranding=1&rel=0`}
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
                 className="w-full h-full border-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
               />
            </div>
            
            <div className="p-5 md:p-8 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-6">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-white leading-tight">{currentLesson.title}</h1>
                  <div className="flex items-center gap-4 mt-2">
                     <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-[#64748b] bg-white/[0.03] px-2 py-1 rounded-md">
                       <Clock size={12}/> {currentLesson.duration_minutes} min
                     </span>
                     <span className="text-[10px] md:text-xs text-[#475569]">Module {lessons.indexOf(currentLesson) + 1} of {lessons.length}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {!progress[currentLesson.id] && (
                    <button onClick={() => markComplete(currentLesson.id)} 
                      className="btn-accent text-[11px] md:text-xs !py-2.5 !px-5 shadow-lg flex-1 sm:flex-none">
                      <CheckCircle size={14}/> Mark Complete
                    </button>
                  )}
                  {lessons.indexOf(currentLesson) < lessons.length - 1 && (
                    <button onClick={() => setCurrentLesson(lessons[lessons.indexOf(currentLesson) + 1])} 
                      className="btn-outline text-[11px] md:text-xs !py-2.5 !px-5 flex-1 sm:flex-none">
                      Next Lesson <ChevronRight size={14}/>
                    </button>
                  )}
                </div>
              </div>

              <div className="max-w-4xl">
                 <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                   {currentLesson.description || "No description available for this lesson."}
                 </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#475569] gap-4 p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.07]">
              <Play size={32} className="opacity-20" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Ready to start?</h3>
              <p className="text-sm">Select a lesson from the sidebar to begin your journey.</p>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="md:hidden btn-outline !py-2 !px-4 text-xs mt-2">Open Lessons Menu</button>
          </div>
        )}
      </div>

      {/* AI Tutor Sidebar Overlay (Drawer on Mobile and Desktop) */}
      <div className={`fixed inset-y-0 right-0 w-[450px] max-w-full bg-[#0d1220] border-l border-white/10 z-[60] transform transition-transform duration-300 flex flex-col shadow-2xl ${aiPanelOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#161d2f]/50 backdrop-blur-xl">
          <h3 className="font-extrabold flex items-center gap-2 text-[var(--accent)]"><Bot size={20} /> AI Tutor Assistant</h3>
          <button onClick={() => setAiPanelOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1"><X size={20}/></button>
        </div>
        
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 relative custom-scrollbar">
          <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />
          {aiResponse ? (
            <div className="relative z-10 animate-fade">
              <div className="flex justify-start mb-4">
                <button onClick={() => setAiResponse("")} className="text-[10px] text-[var(--accent)] hover:underline uppercase tracking-widest font-black">← New Request</button>
              </div>
              <div className="text-sm md:text-base text-gray-200 whitespace-pre-wrap leading-relaxed p-6 rounded-2xl glass border-white/[0.08] shadow-xl">
                {aiResponse}
              </div>
            </div>
          ) : (
             <div className="flex flex-col gap-3 relative z-10">
               <div className="glass p-4 rounded-xl mb-2 border-white/[0.05]">
                 <p className="text-xs text-gray-400 font-medium">Topic: <strong className="text-white">{currentLesson?.title}</strong></p>
               </div>
               <button onClick={() => askAI('summarize')} className="btn-outline !justify-start !py-3 text-xs md:text-sm !rounded-xl hover:bg-white/[0.05]"><span className="text-xl mr-2">📝</span> Summarize Key points</button>
               <button onClick={() => askAI('translate_somali')} className="btn-outline !justify-start !py-3 text-xs md:text-sm !rounded-xl hover:bg-white/[0.05]"><span className="text-xl mr-2">🇸🇴</span> Translate to Somali</button>
               <button onClick={() => askAI('notes')} className="btn-outline !justify-start !py-3 text-xs md:text-sm !rounded-xl hover:bg-white/[0.05]"><span className="text-xl mr-2">✍️</span> Structured Study Notes</button>
               <button onClick={() => askAI('quiz')} className="btn-outline !justify-start !py-3 text-xs md:text-sm !rounded-xl hover:bg-white/[0.05]"><span className="text-xl mr-2">❓</span> Practice Quiz</button>
               <button onClick={() => askAI('explain')} className="btn-outline !justify-start !py-3 text-xs md:text-sm !rounded-xl hover:bg-white/[0.05]"><span className="text-xl mr-2">🧠</span> Deep Explanation</button>
             </div>
          )}
          {aiLoading && (
            <div className="absolute inset-0 bg-[#0d1220]/80 backdrop-blur-md z-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-glow mb-4"
                style={{ background: "var(--gradient-1)", backgroundSize: "200% 200%", animation: "gradientShift 2s ease infinite" }}>
                <Sparkles size={24} className="text-black animate-spin" />
              </div>
              <span className="text-xs font-black text-[var(--accent)] tracking-widest uppercase animate-pulse">Analyzing Content</span>
            </div>
          )}
        </div>
 
        <div className="p-5 border-t border-white/10 bg-[#161d2f]/50 backdrop-blur-xl">
           <form onSubmit={(e) => { e.preventDefault(); askAI('custom_question'); }} className="flex gap-2">
             <input value={customQuestion} onChange={e=>setCustomQuestion(e.target.value)} required placeholder="Ask the Tutor anything..." className="glass-input !py-3.5 text-xs md:text-sm flex-1 !rounded-2xl" />
             <button type="submit" disabled={aiLoading || !customQuestion} className="btn-accent !px-5 !rounded-2xl disabled:opacity-50 transition-all"><Send size={18}/></button>
           </form>
        </div>
      </div>
    </div>
  );
}
