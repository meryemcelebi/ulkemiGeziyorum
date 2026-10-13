'use client';

import React from 'react';
import { Compass, Bookmark, ChevronDown, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenPlanner: () => void;
  onOpenAllProvinces: () => void;
  savedSpotsCount: number;
  onExploreClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPlanner,
  onOpenAllProvinces,
  savedSpotsCount,
  onExploreClick,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          {/* Logo (Terra-style icon + brand name) */}
          <a
            href="#"
            className="flex items-center gap-2.5 group select-none text-slate-900"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                Ülkemi Geziyorum
              </span>
            </div>
          </a>

          {/* Clean Nav Links (matching 2nd image layout) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('places-section')}
              className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Mekanlar</span>
            </button>

            <button
              onClick={onOpenAllProvinces}
              className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>81 İl Kataloğu</span>
            </button>

            <button
              onClick={() => scrollToSection('routes-section')}
              className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Rotalar</span>
            </button>

            <button
              onClick={() => scrollToSection('places-section')}
              className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Açık Veri</span>
            </button>
          </nav>
        </div>

        {/* Right Actions: Login/Rotam & Blue Sign-Up style CTA Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* "Rotam" button (styled like "Login" in Image 2) */}
          <button
            onClick={onOpenPlanner}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-slate-500" />
            <span>Rotam</span>
            {savedSpotsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold">
                {savedSpotsCount}
              </span>
            )}
          </button>

          {/* Primary CTA (Vibrant blue pill button, exact match of "Sign Up" in Image 2) */}
          <button
            onClick={() => {
              if (onExploreClick) {
                onExploreClick();
              } else {
                scrollToSection('places-section');
              }
            }}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>Keşfetmeye Başla</span>
          </button>
        </div>
      </div>
    </header>
  );
};
