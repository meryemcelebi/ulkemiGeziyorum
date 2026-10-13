'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ModernHeroProps {
  onExploreClick: () => void;
  onOpenAllProvinces: () => void;
}

export const ModernHero: React.FC<ModernHeroProps> = ({
  onExploreClick,
  onOpenAllProvinces,
}) => {
  return (
    <section className="relative w-full bg-white pt-2 sm:pt-4 pb-0 overflow-hidden">
      {/* Subtle top ambient aura */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-blue-50/70 via-sky-50/30 to-transparent pointer-events-none -z-10" />

      {/* ================= UPPER HERO CONTENT (Compact for first-screen fit) ================= */}
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Top Product-Hunt style badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-200/90 bg-amber-50/80 text-amber-900 text-[11px] font-semibold shadow-2xs">
          <span className="text-amber-600 text-xs">🏆</span>
          <span className="tracking-wide">AÇIK VERİ KÜLTÜR PORTALI</span>
          <span className="text-amber-400 font-normal">•</span>
          <span className="text-amber-800 font-medium">81 İl & Rota Rehberi</span>
        </div>

        {/* Main Title - Compact & impactful */}
        <h1 className="mt-2.5 sm:mt-3 text-2xl sm:text-4xl md:text-[2.75rem] font-extrabold tracking-tight text-slate-900 text-center leading-[1.15] max-w-3xl mx-auto">
          <span className="text-blue-600 block sm:inline">Türkiye&apos;yi keşfetmenin </span>
          <span className="inline-flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap mt-0.5">
            <span className="text-blue-600">en yenilikçi</span>
            <span className="relative inline-block text-slate-900 px-2 sm:px-2.5 py-0.5">
              rehberi
              {/* Dashed selection box with corner handles */}
              <span className="absolute inset-0 border-2 border-dashed border-slate-400/80 rounded pointer-events-none" />
              <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white border border-slate-600 rounded-[1px]" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white border border-slate-600 rounded-[1px]" />
              <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white border border-slate-600 rounded-[1px]" />
              <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white border border-slate-600 rounded-[1px]" />
            </span>
          </span>
        </h1>

        {/* Subtitle - More compact */}
        <p className="mt-2 text-xs sm:text-sm md:text-[15px] text-slate-600 max-w-lg mx-auto text-center leading-relaxed font-normal">
          Belediye açık veri portallarından derlenen tarihi mekanlar, müzeler ve kültürel rotalar. 81 ilin zengin mirasını tek platformda keşfedin.
        </p>

        {/* Primary CTA Button - Sleek and compact */}
        <div className="mt-3 sm:mt-3.5 flex items-center justify-center">
          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Hemen Keşfet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= FULL-WIDTH OVAL DOME VIDEO HERO AREA ================= */}
      <div className="relative mt-4 sm:mt-5 w-full overflow-hidden select-none pointer-events-none">
        {/* Ambient glow framing the top arc of the dome */}
        <div className="absolute -top-10 inset-x-1/4 h-28 bg-gradient-to-r from-blue-400/25 via-sky-400/30 to-blue-500/25 blur-3xl rounded-full pointer-events-none -z-10" />

        {/* Full-Width Oval Dome Container matching the user's marked arch across the full screen */}
        <div
          className="relative w-full border-t border-slate-200/80 bg-slate-950 shadow-2xl shadow-blue-900/20 overflow-hidden mx-auto"
          style={{
            borderTopLeftRadius: '50% 100%',
            borderTopRightRadius: '50% 100%',
            isolation: 'isolate',
            transform: 'translateZ(0)',
          }}
        >
          {/* Video Player Frame - Sized so entire hero fits on initial screen */}
          <div className="relative w-full h-[340px] sm:h-[440px] md:h-[490px] lg:h-[530px] bg-slate-950 flex items-center justify-center">
            <video
              src="/videos/hero.mp4"
              playsInline
              autoPlay
              loop
              muted
              className="w-full h-full object-cover object-center pointer-events-none select-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};


