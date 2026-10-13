import React, { useState, useEffect } from 'react';
import { Compass, Volume2, VolumeX, Sparkles, Map, Bookmark, Image as ImageIcon } from 'lucide-react';
import { soundController } from './AudioController';

interface NavbarProps {
  onOpenPlanner: () => void;
  onOpenAllProvinces: () => void;
  onOpenImageSettings: () => void;
  savedSpotsCount: number;
  currentPhase: number; // 1 or 2
  onJumpToPhase: (phase: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPlanner,
  onOpenAllProvinces,
  onOpenImageSettings,
  savedSpotsCount,
  currentPhase,
  onJumpToPhase,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    const playing = soundController.toggle();
    setIsPlayingAudio(playing);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 transition-all duration-300 backdrop-blur-md bg-slate-950/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onJumpToPhase(1)}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-amber-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              Ülkemi Geziyorum
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider font-medium uppercase">
              Türkiye Keşif Platformu
            </span>
          </div>
        </div>

        {/* Phase Toggle / Segmented Control */}
        <div className="hidden md:flex items-center gap-1 bg-white/10 p-1 rounded-full backdrop-blur-md border border-white/10">
          <button
            onClick={() => onJumpToPhase(1)}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              currentPhase === 1
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            01. Dünya Bakışı
          </button>
          <button
            onClick={() => onJumpToPhase(2)}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              currentPhase === 2
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            02. Türkiye Haritası
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ambient Soundscape Toggle */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
            title={isPlayingAudio ? 'Müziği Duraklat' : 'Doğa Seslerini Başlat'}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                <span className="hidden sm:inline">Ses Açık</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Ortam Sesi</span>
              </>
            )}
          </button>

          {/* Custom Video & Images Setup Button */}
          <button
            onClick={onOpenImageSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-950/70 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900/80 transition-colors cursor-pointer shadow-sm"
            title="Kendi Dünya Videonuzu ve Türkiye Görselinizi Yükleyin"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Video & Görseller</span>
            <span className="sm:hidden">Medya</span>
          </button>

          {/* 81 Provinces Quick Button */}
          <button
            onClick={onOpenAllProvinces}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-colors cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">81 İl Rehberi</span>
            <span className="sm:hidden">81 İl</span>
          </button>

          {/* Route Planner CTA */}
          <button
            onClick={onOpenPlanner}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white shadow-md shadow-cyan-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Rotam</span>
            {savedSpotsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white text-sky-950 font-bold text-[10px]">
                {savedSpotsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
