'use client';

import React, { useState } from 'react';
import { REGIONS_DATA, LandmarkSpot } from '@/data/regionsData';
import { MapPin, Sparkles, Compass, Eye, ArrowRight, Heart } from 'lucide-react';

interface TurkeyReliefViewProps {
  onSelectSpot: (spot: LandmarkSpot) => void;
  selectedSpot: LandmarkSpot | null;
  savedSpots: string[];
  onToggleSaveSpot: (spotId: string) => void;
  onExploreAllCities: () => void;
  customImageUrl?: string;
  hideTextOverlay?: boolean;
  zoomProgress?: number; // 0 to 1 (scroll-driven zoom-in)
  zoomIntensity?: 'subtle' | 'cinematic' | 'dramatic';
}

export const TurkeyReliefView: React.FC<TurkeyReliefViewProps> = ({
  onSelectSpot,
  selectedSpot,
  savedSpots,
  onToggleSaveSpot,
  onExploreAllCities,
  customImageUrl,
  hideTextOverlay = false,
  zoomProgress = 1,
  zoomIntensity = 'cinematic',
}) => {
  const [hoveredSpot, setHoveredSpot] = useState<LandmarkSpot | null>(null);
  const [balloonClickedCount, setBalloonClickedCount] = useState(0);

  // Parallax tilt on mouse move
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 6, y: y * -6 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleBalloonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBalloonClickedCount((prev) => prev + 1);
    const kapadokya = REGIONS_DATA.find((r) => r.id === 'kapadokya');
    if (kapadokya) {
      onSelectSpot(kapadokya);
    }
  };

  // Zoom factor calculations
  const zoomFactorMap = {
    subtle: 0.12,
    cinematic: 0.22,
    dramatic: 0.36,
  };
  const factor = zoomFactorMap[zoomIntensity] || 0.22;
  const currentScale = 0.88 + zoomProgress * factor;
  const currentTranslateY = (1 - zoomProgress) * 35; // Approaches up towards camera

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Sun Flare and Sky Rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Central Sun Glow behind the curvature */}
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-t from-cyan-300/30 via-sky-400/15 to-transparent rounded-full blur-3xl" />
        
        {/* Radiant Light Rays */}
        <div
          className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] opacity-40 mix-blend-screen pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(254, 240, 138, 0.45) 0%, rgba(56, 189, 248, 0.25) 35%, transparent 70%)',
          }}
        />
      </div>

      {/* Top Header Section */}
      {!hideTextOverlay ? (
        <div className="relative z-20 pt-8 sm:pt-12 text-center max-w-3xl px-4 flex flex-col items-center">
          {/* Subtle Category Kicker */}
          <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase mb-2 drop-shadow-sm">
            ŞİMDİ SIRA
          </span>

          {/* Main Display Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>Türkiye'yi</span>
            <span className="font-handwriting font-normal text-4xl sm:text-6xl md:text-7xl text-cyan-200 text-shadow-glow rotate-[-2deg]">
              Keşfetmekte
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-200/90 max-w-xl font-normal leading-relaxed drop-shadow">
            Tarihi, doğası, kültürü ve eşsiz şehirleriyle Türkiye seni bekliyor.
          </p>

          {/* Primary CTA Button */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onExploreAllCities}
              className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-white/95 text-sky-950 font-semibold text-sm sm:text-base shadow-xl shadow-cyan-950/30 backdrop-blur-md hover:bg-white hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span>Türkiye'yi Keşfet</span>
              <ArrowRight className="w-4 h-4 text-sky-700 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-20 pt-6 px-4">
          <button
            onClick={onExploreAllCities}
            className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/95 text-sky-950 font-semibold text-sm shadow-xl backdrop-blur-md hover:bg-white hover:scale-105 transition-all cursor-pointer"
          >
            <span>81 İli Keşfet</span>
            <ArrowRight className="w-4 h-4 text-sky-700 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Hand-drawn Note on the Right */}
      {!hideTextOverlay && (
        <div className="absolute right-4 sm:right-12 lg:right-24 top-24 sm:top-28 z-30 pointer-events-none hidden md:block">
          <div className="flex flex-col items-end rotate-[6deg]">
            <span className="font-handwriting text-2xl lg:text-3xl font-semibold text-white/95 text-shadow-glow leading-snug text-right">
              81 il<br />binlerce keşif<br />seni bekliyor
            </span>
            <svg
              className="w-12 h-14 text-white/80 mt-1 mr-4 drop-shadow"
              viewBox="0 0 50 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 40 5 Q 35 35 15 48" />
              <path d="M 23 40 L 14 49 L 10 37" />
            </svg>
          </div>
        </div>
      )}

      {/* The 3D Curved Earth Horizon & Anatolia Landscape - Approaching Zoom-In Animation */}
      <div
        className="relative z-10 w-full flex-1 min-h-[460px] sm:min-h-[520px] md:min-h-[580px] flex items-end justify-center transition-all duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${currentScale}) translateY(${currentTranslateY}px)`,
        }}
      >
        {/* Custom Image Mode (If user provided their own image) */}
        {customImageUrl ? (
          <div className="relative w-full max-w-[1400px] h-[440px] sm:h-[520px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={customImageUrl}
              alt="Türkiye 3D Haritası"
              className="w-full h-full object-cover object-bottom filter brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a] via-transparent to-transparent opacity-80 pointer-events-none" />

            {/* Overlaid Interactive Pins */}
            {/* 1. ISTANBUL */}
            <div
              className="absolute left-[32.5%] top-[34%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'istanbul');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-400/80 shadow-xl text-white text-xs font-semibold group-hover:bg-cyan-500 group-hover:scale-110 transition-all">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -left-1" />
                <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
                <span>İstanbul</span>
              </div>
            </div>

            {/* 2. KAPADOKYA */}
            <div
              className="absolute left-[48%] top-[45%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'kapadokya');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-400/80 shadow-xl text-white text-xs font-semibold group-hover:bg-amber-500 group-hover:scale-110 transition-all">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -left-1" />
                <MapPin className="w-3.5 h-3.5 text-amber-400 group-hover:text-white" />
                <span>Kapadokya</span>
              </div>
            </div>

            {/* 3. EGE */}
            <div
              className="absolute left-[13.5%] top-[56.5%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'ege');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-teal-400/80 shadow-xl text-white text-xs font-semibold group-hover:bg-teal-500 group-hover:scale-110 transition-all">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping absolute -left-1" />
                <MapPin className="w-3.5 h-3.5 text-teal-400 group-hover:text-white" />
                <span>Ege</span>
              </div>
            </div>

            {/* 4. AKDENİZ */}
            <div
              className="absolute left-[38.5%] top-[70.5%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'akdeniz');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-400/80 shadow-xl text-white text-xs font-semibold group-hover:bg-cyan-500 group-hover:scale-110 transition-all">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -left-1" />
                <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
                <span>Akdeniz</span>
              </div>
            </div>

            {/* 5. GÜNEYDOĞU ANADOLU */}
            <div
              className="absolute left-[75.5%] top-[60.5%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'guneydogu');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-500/80 shadow-xl text-white text-xs font-semibold group-hover:bg-amber-600 group-hover:scale-110 transition-all">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -left-1" />
                <MapPin className="w-3.5 h-3.5 text-amber-400 group-hover:text-white" />
                <span>Güneydoğu Anadolu</span>
              </div>
            </div>

            {/* 6. DOĞU ANADOLU */}
            <div
              className="absolute left-[86.5%] top-[33.5%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'dogu_anadolu');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-purple-400/80 shadow-xl text-white text-xs font-semibold group-hover:bg-purple-500 group-hover:scale-110 transition-all">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping absolute -left-1" />
                <MapPin className="w-3.5 h-3.5 text-purple-300 group-hover:text-white" />
                <span>Doğu Anadolu</span>
              </div>
            </div>
          </div>
        ) : (
          /* Procedural 3D SVG Relief Mode */
          <div className="relative w-[120%] sm:w-[110%] max-w-[1500px] h-[380px] sm:h-[460px] md:h-[520px]">
            <svg
              className="absolute inset-0 w-full h-full drop-shadow-[0_-15px_40px_rgba(56,189,248,0.4)]"
              viewBox="0 0 1400 600"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="horizonGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                  <stop offset="8%" stopColor="#0284c7" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#0369a1" stopOpacity="1" />
                  <stop offset="70%" stopColor="#0c4a6e" stopOpacity="1" />
                  <stop offset="100%" stopColor="#082f49" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="anatoliaTerrain" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#15803d" />
                  <stop offset="25%" stopColor="#16a34a" />
                  <stop offset="48%" stopColor="#d97706" />
                  <stop offset="70%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                <filter id="coastalGlow">
                  <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#22d3ee" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Earth Horizon Curve (Upper Arc) */}
              <path
                d="M -100 550 Q 700 80 1500 550 L 1500 650 L -100 650 Z"
                fill="url(#horizonGlow)"
              />

              {/* Glowing Atmosphere Rim Line */}
              <path
                d="M -100 550 Q 700 80 1500 550"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="4"
                opacity="0.9"
              />
              <path
                d="M -100 550 Q 700 80 1500 550"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="12"
                opacity="0.45"
              />

              {/* Anatolian Peninsula Land Relief */}
              <path
                d="M 230 460 
                   Q 280 430 330 400 
                   Q 360 375 410 370 
                   Q 470 340 540 330 
                   Q 650 310 770 315 
                   Q 900 325 1040 370 
                   Q 1130 410 1190 460
                   Q 1160 510 1050 515
                   Q 940 500 860 520
                   Q 780 540 680 520
                   Q 560 545 460 525
                   Q 360 535 270 510
                   Z"
                fill="url(#anatoliaTerrain)"
                filter="url(#coastalGlow)"
                stroke="#6ee7b7"
                strokeWidth="2.5"
              />

              {/* Aegean & Mediterranean Turquoise Water Inlets */}
              <path
                d="M 270 510 Q 360 535 460 525 Q 560 545 680 520"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="6"
                opacity="0.8"
              />

              {/* Black Sea Water Boundary */}
              <path
                d="M 410 370 Q 540 330 770 315 Q 900 325 1040 370"
                fill="none"
                stroke="#0284c7"
                strokeWidth="5"
                opacity="0.75"
              />

              {/* Taurus Mountains (South) */}
              <path
                d="M 480 480 Q 600 460 740 470"
                fill="none"
                stroke="#78350f"
                strokeWidth="4"
                strokeDasharray="4 6"
                opacity="0.7"
              />
              {/* Pontic Mountains (North) */}
              <path
                d="M 600 345 Q 750 335 930 355"
                fill="none"
                stroke="#14532d"
                strokeWidth="4"
                strokeDasharray="3 5"
                opacity="0.8"
              />
            </svg>

            {/* 1. ISTANBUL */}
            <div
              className="absolute left-[26%] sm:left-[28%] top-[56%] sm:top-[54%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'istanbul');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="relative mb-1 transition-transform group-hover:scale-125 duration-300">
                <svg className="w-12 h-14 sm:w-16 sm:h-18 drop-shadow-lg" viewBox="0 0 60 70" fill="none">
                  <path d="M 22 45 L 22 25 L 26 12 L 28 8 L 30 12 L 34 25 L 34 45 Z" fill="#d4a373" stroke="#8d5b4c" strokeWidth="1.5" />
                  <path d="M 28 3 L 28 8" stroke="#f59e0b" strokeWidth="2" />
                  <rect x="25" y="22" width="6" height="8" rx="3" fill="#3e2723" />
                  <path d="M 38 48 L 40 28 L 41 20 L 42 28 L 44 48 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="41" cy="18" r="2" fill="#fbbf24" />
                  <ellipse cx="48" cy="45" rx="9" ry="7" fill="#64748b" />
                  <circle cx="48" cy="37" r="1.5" fill="#f59e0b" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-400/60 shadow-lg text-white text-xs font-semibold group-hover:bg-cyan-500 group-hover:border-cyan-300 transition-all">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
                <span>İstanbul</span>
              </div>
            </div>

            {/* 2. CAPPADOCIA */}
            <div
              className="absolute left-[49%] sm:left-[50%] top-[48%] sm:top-[46%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-30"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'kapadokya');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div
                className="relative -top-2 flex items-center gap-2 cursor-pointer transition-transform group-hover:scale-115"
                onClick={handleBalloonClick}
                title="Kapadokya balonlarını havalandır!"
              >
                <div className="animate-float-balloon relative">
                  <svg className="w-10 h-14 sm:w-12 sm:h-16 drop-shadow-xl" viewBox="0 0 50 65" fill="none">
                    <ellipse cx="25" cy="24" rx="20" ry="22" fill="#ea580c" />
                    <path d="M 12 18 Q 25 38 38 18" fill="#facc15" opacity="0.85" />
                    <path d="M 16 12 Q 25 36 34 12" fill="#38bdf8" opacity="0.85" />
                    <path d="M 25 2 Q 25 46 25 46" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
                    <path d="M 18 40 L 22 48 L 28 48 L 32 40 Z" fill="#c2410c" />
                    <rect x="22" y="52" width="6" height="5" rx="1" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                    <line x1="21" y1="48" x2="23" y2="52" stroke="#451a03" strokeWidth="1" />
                    <line x1="29" y1="48" x2="27" y2="52" stroke="#451a03" strokeWidth="1" />
                  </svg>
                </div>

                <div className="animate-float-balloon-delayed relative -top-3">
                  <svg className="w-7 h-10 sm:w-8 sm:h-12 drop-shadow-md" viewBox="0 0 50 65" fill="none">
                    <ellipse cx="25" cy="24" rx="18" ry="20" fill="#db2777" />
                    <path d="M 14 16 Q 25 36 36 16" fill="#fde047" opacity="0.9" />
                    <rect x="22" y="50" width="6" height="5" rx="1" fill="#78350f" />
                  </svg>
                </div>
              </div>

              <div className="flex items-end gap-1 -mt-3 mb-1">
                <div className="w-2.5 h-6 bg-amber-700/80 rounded-t-sm relative">
                  <div className="w-4 h-2 bg-amber-900 rounded-full -ml-0.5 -mt-1" />
                </div>
                <div className="w-3.5 h-8 bg-amber-600/90 rounded-t-sm relative">
                  <div className="w-5 h-2.5 bg-amber-950 rounded-full -ml-0.5 -mt-1" />
                </div>
                <div className="w-2.5 h-5 bg-amber-700/80 rounded-t-sm relative">
                  <div className="w-4 h-2 bg-amber-900 rounded-full -ml-0.5 -mt-1" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-500/70 shadow-lg text-white text-xs font-semibold group-hover:bg-amber-600 group-hover:border-amber-400 transition-all">
                <MapPin className="w-3.5 h-3.5 text-amber-400 group-hover:text-white" />
                <span>Kapadokya</span>
              </div>
            </div>

            {/* 3. EGE */}
            <div
              className="absolute left-[18%] sm:left-[21%] top-[68%] sm:top-[66%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'ege');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="mb-1 transition-transform group-hover:scale-125 duration-300">
                <svg className="w-14 h-12 sm:w-16 sm:h-14 drop-shadow-md" viewBox="0 0 60 45" fill="none">
                  <polygon points="10,12 30,2 50,12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="8" y="12" width="44" height="4" fill="#e2e8f0" />
                  <rect x="12" y="16" width="4" height="20" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
                  <rect x="22" y="16" width="4" height="20" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
                  <rect x="34" y="16" width="4" height="20" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
                  <rect x="44" y="16" width="4" height="20" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
                  <rect x="6" y="36" width="48" height="3" fill="#cbd5e1" />
                  <rect x="4" y="39" width="52" height="3" fill="#94a3b8" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-teal-400/60 shadow-lg text-white text-xs font-semibold group-hover:bg-teal-600 transition-all">
                <MapPin className="w-3.5 h-3.5 text-teal-400 group-hover:text-white" />
                <span>Ege</span>
              </div>
            </div>

            {/* 4. AKDENİZ */}
            <div
              className="absolute left-[38%] sm:left-[41%] top-[78%] sm:top-[76%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'akdeniz');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="mb-1 transition-transform group-hover:scale-125 duration-300">
                <svg className="w-14 h-12 sm:w-16 sm:h-14 drop-shadow-md" viewBox="0 0 60 45" fill="none">
                  <rect x="10" y="18" width="40" height="18" fill="#d4a373" stroke="#8c5d32" strokeWidth="1.2" />
                  <rect x="8" y="12" width="9" height="12" fill="#b07d46" />
                  <rect x="43" y="12" width="9" height="12" fill="#b07d46" />
                  <path d="M 26 36 L 26 26 Q 30 22 34 26 L 34 36 Z" fill="#2d1c0b" />
                  <path d="M 4 40 Q 30 36 56 40" stroke="#22d3ee" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-400/60 shadow-lg text-white text-xs font-semibold group-hover:bg-cyan-600 transition-all">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
                <span>Akdeniz</span>
              </div>
            </div>

            {/* 5. GÜNEYDOĞU ANADOLU */}
            <div
              className="absolute left-[66%] sm:left-[67%] top-[70%] sm:top-[68%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'guneydogu');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="mb-1 transition-transform group-hover:scale-125 duration-300">
                <svg className="w-14 h-12 sm:w-16 sm:h-14 drop-shadow-md" viewBox="0 0 60 45" fill="none">
                  <rect x="15" y="24" width="30" height="14" fill="#d97706" stroke="#92400e" strokeWidth="1" />
                  <rect x="22" y="14" width="18" height="12" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
                  <rect x="28" y="7" width="10" height="8" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
                  <path d="M 26 26 Q 30 20 34 26" stroke="#78350f" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-500/60 shadow-lg text-white text-xs font-semibold group-hover:bg-amber-600 transition-all">
                <MapPin className="w-3.5 h-3.5 text-amber-400 group-hover:text-white" />
                <span>Güneydoğu Anadolu</span>
              </div>
            </div>

            {/* 6. DOĞU ANADOLU */}
            <div
              className="absolute left-[78%] sm:left-[80%] top-[48%] sm:top-[46%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'dogu_anadolu');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="mb-1 transition-transform group-hover:scale-125 duration-300">
                <svg className="w-16 h-14 sm:w-18 sm:h-16 drop-shadow-lg" viewBox="0 0 70 55" fill="none">
                  <polygon points="10,48 35,12 55,48" fill="#475569" stroke="#334155" strokeWidth="1.5" />
                  <polygon points="26,25 35,12 44,25 39,22 35,26 31,22" fill="#ffffff" />
                  <polygon points="45,48 58,24 68,48" fill="#64748b" stroke="#334155" strokeWidth="1" />
                  <polygon points="53,33 58,24 63,33 60,31 58,34 56,31" fill="#ffffff" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-purple-400/60 shadow-lg text-white text-xs font-semibold group-hover:bg-purple-600 transition-all">
                <MapPin className="w-3.5 h-3.5 text-purple-300 group-hover:text-white" />
                <span>Doğu Anadolu</span>
              </div>
            </div>

            {/* 7. KARADENİZ */}
            <div
              className="absolute left-[62%] sm:left-[64%] top-[34%] sm:top-[32%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
              onClick={() => {
                const spot = REGIONS_DATA.find((r) => r.id === 'karadeniz');
                if (spot) onSelectSpot(spot);
              }}
            >
              <div className="mb-1 transition-transform group-hover:scale-125 duration-300">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" viewBox="0 0 50 45" fill="none">
                  <polygon points="5,42 25,12 45,42" fill="#14532d" />
                  <rect x="20" y="22" width="14" height="12" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
                  <rect x="24" y="18" width="6" height="5" fill="#dc2626" />
                  <polygon points="12,38 16,30 20,38" fill="#166534" />
                  <polygon points="32,38 36,28 40,38" fill="#166534" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-emerald-400/60 shadow-lg text-white text-xs font-semibold group-hover:bg-emerald-600 transition-all">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                <span>Karadeniz</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Parting Clouds Layer */}
        <div className="absolute -bottom-8 inset-x-0 h-44 pointer-events-none overflow-hidden z-20">
          <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a] via-[#040d1a]/70 to-transparent z-10" />
          <div
            className="absolute bottom-2 -left-28 w-[650px] h-36 bg-white/20 rounded-full blur-3xl transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${-zoomProgress * 120}px)` }}
          />
          <div
            className="absolute bottom-2 -right-28 w-[720px] h-40 bg-white/25 rounded-full blur-3xl transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${zoomProgress * 120}px)` }}
          />
        </div>
      </div>

      {/* Elegant Bottom Footer Controls */}
      <div className="relative z-20 w-full px-6 py-4 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-slate-900/60 backdrop-blur">
            <Compass className="w-5 h-5 text-cyan-300 animate-[spin_60s_linear_infinite]" />
            <span className="absolute -top-3 text-[9px] font-bold text-white/80">N</span>
          </div>
          <span className="hidden sm:inline font-mono tracking-wider text-[11px] text-slate-400">
            39.9334° N, 32.8597° E
          </span>
        </div>

        {/* Interactive Spot Quick Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 max-w-[65%] sm:max-w-none">
          {REGIONS_DATA.slice(0, 5).map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors shrink-0 cursor-pointer"
            >
              {spot.name}
            </button>
          ))}
          <button
            onClick={onExploreAllCities}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 shrink-0 cursor-pointer"
          >
            + 81 İl
          </button>
        </div>

        {/* Saved Count */}
        <button
          onClick={onExploreAllCities}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/10 hover:border-pink-500/40 text-slate-200 transition-colors cursor-pointer"
        >
          <Heart className={`w-3.5 h-3.5 ${savedSpots.length > 0 ? 'text-pink-500 fill-pink-500' : 'text-slate-400'}`} />
          <span className="text-xs font-medium">{savedSpots.length} Rota</span>
        </button>
      </div>
    </div>
  );
};
