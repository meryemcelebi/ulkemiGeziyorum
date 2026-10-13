import React, { useState, useEffect, useRef } from 'react';
import { EarthGlobeCanvas } from './EarthGlobeCanvas';
import { TurkeyReliefView } from './TurkeyReliefView';
import { LandmarkSpot, REGIONS_DATA } from '../data/regionsData';
import { ArrowRight, Compass, Mouse, ChevronDown, Sparkles } from 'lucide-react';

import { HeroConfig } from '../config/heroImagesConfig';

interface InteractiveHeroProps {
  onSelectSpot: (spot: LandmarkSpot) => void;
  selectedSpot: LandmarkSpot | null;
  savedSpots: string[];
  onToggleSaveSpot: (spotId: string) => void;
  onExploreAllCities: () => void;
  activePhase: number;
  setActivePhase: (phase: number) => void;
  heroConfig: HeroConfig;
  hideTextOverlay: boolean;
}

export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
  onSelectSpot,
  selectedSpot,
  savedSpots,
  onToggleSaveSpot,
  onExploreAllCities,
  activePhase,
  setActivePhase,
  heroConfig,
  hideTextOverlay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 (World) to 1 (Turkey)

  // Scroll tracking within the hero track
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      setScrollProgress(progress);

      if (progress >= 0.5 && activePhase !== 2) {
        setActivePhase(2);
      } else if (progress < 0.5 && activePhase !== 1) {
        setActivePhase(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePhase, setActivePhase]);

  // Video Frame Scrubbing on Scroll (Apple-style interactive scroll video)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !heroConfig.scene1.videoUrl || !heroConfig.scene1.videoScrollControlled) return;

    const scrub = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        // Video advances through its full duration as user scrolls 0 -> 0.55
        const normProgress = Math.min(Math.max(scrollProgress / 0.55, 0), 1);
        video.currentTime = normProgress * video.duration;
      }
    };

    if (video.readyState >= 1) {
      scrub();
    } else {
      video.addEventListener('loadedmetadata', scrub, { once: true });
    }
  }, [scrollProgress, heroConfig.scene1.videoUrl, heroConfig.scene1.videoScrollControlled]);

  // Smooth scroll jump to Turkey or World
  const scrollToPhase = (phase: number) => {
    if (!containerRef.current) return;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = phase === 2 ? totalScrollable : 0;

    window.scrollTo({
      top: containerRef.current.offsetTop + targetY,
      behavior: 'smooth',
    });
  };

  // Scene transition opacities
  // Scene 1 (World / Video): 1.0 at progress 0 -> fades out by 0.55
  const scene1Opacity = Math.max(0, 1 - scrollProgress * 2.2);
  // Scene 2 (Turkey): 0 at 0.4 -> 1.0 by 0.75
  const scene2Opacity = Math.min(1, Math.max(0, (scrollProgress - 0.4) * 2.5));

  // Dynamic zoom-in progress for Turkey (starts at 0.45, reaches 1.0 at full scroll)
  const turkeyZoomProgress = Math.min(Math.max((scrollProgress - 0.45) / 0.55, 0), 1);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[240vh] bg-gradient-to-b from-[#031525] via-[#041c33] to-[#040d1a]"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Dynamic Atmospheric Clouds Background Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Top Sunlight glow */}
          <div className="absolute -top-20 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-amber-200/20 via-sky-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Left Fluffy Cloud Bank (Matching Image 1 & 2) */}
          <div
            className="absolute -left-24 top-1/4 w-[480px] h-[600px] transition-transform duration-700 ease-out pointer-events-none"
            style={{
              transform: `translateX(${-scrollProgress * 80}px)`,
              background:
                'radial-gradient(ellipse at 30% 50%, rgba(255, 255, 255, 0.28) 0%, rgba(224, 242, 254, 0.15) 45%, transparent 75%)',
              filter: 'blur(30px)',
            }}
          />

          {/* Right Fluffy Cloud Bank */}
          <div
            className="absolute -right-24 top-1/3 w-[520px] h-[650px] transition-transform duration-700 ease-out pointer-events-none"
            style={{
              transform: `translateX(${scrollProgress * 80}px)`,
              background:
                'radial-gradient(ellipse at 70% 50%, rgba(255, 255, 255, 0.32) 0%, rgba(224, 242, 254, 0.18) 45%, transparent 75%)',
              filter: 'blur(35px)',
            }}
          />

          {/* Bottom Ambient Cloud Horizon */}
          <div className="absolute bottom-0 inset-x-0 h-52 bg-gradient-to-t from-[#040d1a] via-[#040d1a]/80 to-transparent pointer-events-none" />
        </div>

        {/* ================= SCENE 1: GLOBAL WORLD VIEW ================= */}
        <div
          className="absolute inset-0 z-10 flex flex-col justify-between transition-opacity duration-300 pointer-events-auto"
          style={{
            opacity: scene1Opacity,
            pointerEvents: scrollProgress > 0.5 ? 'none' : 'auto',
          }}
        >
          {/* Top Text Content (Matching Image 1) */}
          {!hideTextOverlay ? (
            <div className="relative z-20 pt-20 sm:pt-24 text-center max-w-3xl mx-auto px-4 flex flex-col items-center">
              {/* Upper Category Label */}
              <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase mb-2 drop-shadow-sm">
                {heroConfig.scene1.categoryText}
              </span>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                <span>{heroConfig.scene1.titleMain}</span>
                <span className="font-handwriting font-normal text-5xl sm:text-7xl md:text-8xl text-cyan-200 text-shadow-glow rotate-[-2deg]">
                  {heroConfig.scene1.titleHandwritten}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-200/90 max-w-xl font-normal leading-relaxed drop-shadow">
                {heroConfig.scene1.description}
              </p>

              {/* Primary Action Button */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => scrollToPhase(2)}
                  className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-cyan-600/90 hover:bg-cyan-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-cyan-900/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-cyan-400/40"
                >
                  <span>{heroConfig.scene1.buttonText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative z-20 pt-16 flex justify-center">
              <button
                onClick={() => scrollToPhase(2)}
                className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-cyan-600/90 hover:bg-cyan-500 text-white font-semibold text-sm shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer border border-cyan-400/40"
              >
                <span>{heroConfig.scene1.buttonText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Hand-drawn Note on the Right (Matching Image 1) */}
          {!hideTextOverlay && (
            <div className="absolute right-4 sm:right-12 lg:right-28 top-32 sm:top-36 z-30 pointer-events-none hidden md:block">
              <div className="flex flex-col items-end rotate-[5deg]">
                <span className="font-handwriting text-2xl lg:text-3xl font-semibold text-white/95 text-shadow-glow leading-snug text-right whitespace-pre-line">
                  {heroConfig.scene1.noteText}
                </span>
                <svg
                  className="w-10 h-12 text-white/80 mt-1 mr-3 drop-shadow"
                  viewBox="0 0 50 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 40 5 Q 35 30 18 42" />
                  <path d="M 26 35 L 18 43 L 13 32" />
                </svg>
              </div>
            </div>
          )}

          {/* Compass Rose on the Bottom-Left (Matching Image 1) */}
          <div className="absolute left-6 sm:left-12 bottom-12 z-20 pointer-events-none hidden sm:flex flex-col items-center">
            <div className="relative w-14 h-14 rounded-full border border-white/25 flex items-center justify-center bg-slate-950/40 backdrop-blur-md">
              <Compass className="w-8 h-8 text-cyan-300/80 animate-[spin_80s_linear_infinite]" />
              <span className="absolute top-0.5 text-[9px] font-bold text-white/80">N</span>
              <span className="absolute right-1 text-[9px] font-bold text-white/80">E</span>
              <span className="absolute bottom-0.5 text-[9px] font-bold text-white/80">S</span>
              <span className="absolute left-1 text-[9px] font-bold text-white/80">W</span>
            </div>
          </div>

          {/* Scroll Down Indicator at the Bottom Center (Matching Image 1) */}
          <div
            onClick={() => scrollToPhase(2)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer group hover:scale-105 transition-transform"
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5 bg-slate-900/30 backdrop-blur">
              <div className="w-1.5 h-2.5 rounded-full bg-cyan-300 animate-bounce" />
            </div>
            <span className="text-xs font-medium text-slate-300 tracking-wider group-hover:text-cyan-300 transition-colors">
              {heroConfig.scene1.scrollText}
            </span>
          </div>
        </div>

        {/* ================= BACKGROUND 1: VIDEO, 3D EARTH GLOBE, OR CUSTOM IMAGE ================= */}
        <div
          className="absolute inset-0 z-5 transition-opacity duration-500 pointer-events-auto"
          style={{
            opacity: scrollProgress > 0.85 ? Math.max(0, (1 - scrollProgress) * 6) : 1,
            pointerEvents: scrollProgress > 0.7 ? 'none' : 'auto',
          }}
        >
          {heroConfig.scene1.videoUrl ? (
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                src={heroConfig.scene1.videoUrl}
                playsInline
                muted
                autoPlay={!heroConfig.scene1.videoScrollControlled}
                loop={!heroConfig.scene1.videoScrollControlled}
                preload="auto"
                className="w-full h-full object-cover object-center transition-transform duration-100 ease-out"
                style={{
                  transform: `scale(${1 + scrollProgress * 0.12})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#031525]/20 via-transparent to-[#040d1a]" />
            </div>
          ) : heroConfig.scene1.imageUrl ? (
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
              <img
                src={heroConfig.scene1.imageUrl}
                alt="1. Görsel: Dünya"
                className="w-full h-full object-cover object-center transition-transform duration-300 ease-out"
                style={{
                  transform: `scale(${1 + scrollProgress * 0.35}) rotate(${scrollProgress * -4}deg)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#031525]/30 via-transparent to-[#040d1a]" />
            </div>
          ) : (
            <EarthGlobeCanvas
              scrollProgress={scrollProgress}
              onInspectTurkey={() => scrollToPhase(2)}
            />
          )}
        </div>

        {/* ================= SCENE 2: TURKEY RELIEF PANORAMA (APPROACHING / ZOOM-IN) ================= */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-between transition-opacity duration-500"
          style={{
            opacity: scene2Opacity,
            pointerEvents: scrollProgress < 0.4 ? 'none' : 'auto',
          }}
        >
          <TurkeyReliefView
            onSelectSpot={onSelectSpot}
            selectedSpot={selectedSpot}
            savedSpots={savedSpots}
            onToggleSaveSpot={onToggleSaveSpot}
            onExploreAllCities={onExploreAllCities}
            customImageUrl={heroConfig.scene2.imageUrl}
            hideTextOverlay={hideTextOverlay}
            zoomProgress={turkeyZoomProgress}
            zoomIntensity={heroConfig.scene2.zoomIntensity}
          />
        </div>

        {/* Global Floating Interactive Phase Indicator */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 bg-slate-950/50 backdrop-blur-md p-2 rounded-full border border-white/10">
          <button
            onClick={() => scrollToPhase(1)}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              scrollProgress < 0.5
                ? 'bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50'
                : 'bg-white/30 hover:bg-white/60'
            }`}
            title="01. Dünya Bakışı"
          />
          <div className="w-0.5 h-6 bg-white/20" />
          <button
            onClick={() => scrollToPhase(2)}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              scrollProgress >= 0.5
                ? 'bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50'
                : 'bg-white/30 hover:bg-white/60'
            }`}
            title="02. Türkiye Haritası"
          />
        </div>
      </div>
    </div>
  );
};
