"use client";
import { useState } from "react";
import { Play, X } from "lucide-react";

interface CourseVideoProps {
  thumbnailUrl?: string;
  introVideoId?: string;
  title: string;
}

export function CourseVideo({ thumbnailUrl, introVideoId, title }: CourseVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumb = thumbnailUrl || (introVideoId ? `https://img.youtube.com/vi/${introVideoId}/maxresdefault.jpg` : "");

  if (isPlaying && introVideoId) {
    return (
      <div className="glass-card overflow-hidden shadow-2xl relative aspect-video bg-black animate-fade">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${introVideoId}?autoplay=1&modestbranding=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-none"
        />
        <button 
          onClick={() => setIsPlaying(false)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="lg:w-[440px] flex-shrink-0 animate-up delay-2">
      <div 
        className="glass-card overflow-hidden animate-glow group cursor-pointer" 
        onClick={() => introVideoId && setIsPlaying(true)}
      >
        <div className="relative aspect-video bg-[var(--bg-elevated)]">
          {thumb ? (
            <img 
              src={thumb} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play size={40} className="opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110"
              style={{ background: "var(--gradient-1)", boxShadow: "0 0 40px rgba(0,229,255,0.3)" }}>
              <Play size={28} fill="#000" className="text-black ml-1" />
            </div>
          </div>
        </div>
      </div>
      {introVideoId && (
        <p className="text-[var(--text-muted)] text-[10px] text-center mt-3 font-medium uppercase tracking-widest">
          Click to play intro video
        </p>
      )}
    </div>
  );
}
